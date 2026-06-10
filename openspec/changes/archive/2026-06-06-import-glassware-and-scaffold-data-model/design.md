# Design: Import Glassware Data & Scaffold Data Model

## 1. Prisma Schema Changes

### ERPSKU — Add warehouse fields

```prisma
model ERPSKU {
  // existing fields...
  erpSku           String   @id @map("erp_sku") @db.VarChar(30)
  variantId        String   @map("variant_id") @db.VarChar(50)
  businessSku      String   @map("business_sku") @db.VarChar(30)
  initialStockQty  Int      @default(0) @map("initial_stock_qty")
  lowStockAlertQty Int      @default(0) @map("low_stock_alert_qty")

  // NEW: dual-warehouse stock
  stockHouston         Int  @default(0) @map("stock_houston")
  stockChina           Int  @default(0) @map("stock_china")
  lowStockAlertHouston Int  @default(0) @map("low_stock_alert_houston")
  lowStockAlertChina   Int  @default(0) @map("low_stock_alert_china")

  // existing relations...
  variant ProductVariant @relation(fields: [variantId], references: [variantId])
}
```

### Remove deprecated models

Delete these models from `schema.prisma`:
- `Product` — the old flat product model
- `ProductImage` — only used by old Product
- `ProductSupplier` — only used by old Product
- `OrderItem` — only references old Product (migrate to ERPSKU if needed)

Keep these models (still in use):
- All V3.2 models: `SupplierMaster`, `SPU`, `ProductVariant`, `ERPSKU`, `VariantSupplierMap`, `ProductStandard`
- Order/Quote models: `Order`, `Quote`, `QuoteItem`
- Auth models: `User`, `Account`, `Session`, `Address`, `VerificationToken`

**Important**: `OrderItem` currently references `prisma.product`. Since there are no real orders yet (dev only), this is safe to clean. The field `productId` on `OrderItem` should be changed to reference `ERPSKU.erpSku` instead.

## 2. Import Script Architecture

### Script: `scripts/import-v32-glassware.js`

```
┌─────────────────────────────────────────────────────────┐
│                  import-v32-glassware.js                  │
├─────────────────────────────────────────────────────────┤
│  1. Read Excel file (xlsx)                               │
│  2. Clean data (None→NULL, Gross_Margin×100)             │
│  3. Create SupplierMaster("ENB") if not exists           │
│  4. Create SPU records (19 unique SPU_IDs)               │
│  5. Create ProductVariant records (104 rows)              │
│  6. Create ERPSKU records (104 rows, stock=500/500)      │
│  7. Create VariantSupplierMap (link to ENB)              │
│  8. Report summary                                       │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
Excel row
  │
  ├─→ SPU (group by SPU_ID, 19 unique)
  │     spuId, productFamilyName, categoryL1, seoTitle
  │
  ├─→ ProductVariant (one per row, 104)
  │     variantId, spuId, variantName, volumeMl, jointType,
  │     jointSize, wallType, materialFamily, color,
  │     accuracyClass, sellingPriceUsd, costPriceUsd,
  │     grossMarginPct, slug
  │
  └─→ ERPSKU (one per row, 104)
        erpSku, variantId, businessSku,
        initialStockQty, lowStockAlertQty,
        stockHouston: 500, stockChina: 500
```

### Dry-run mode

The script supports `--dry-run` flag that validates data without writing to DB.

### Command

```bash
# dry-run first
node scripts/import-v32-glassware.js --dry-run

# actual import
node scripts/import-v32-glassware.js

# specify file path
node scripts/import-v32-glassware.js --file "/Volumes/PC E/玻璃仪器数据/v32_sku_104_fixed.xlsx"
```

## 3. Category Restructure

### New Category → SPU mapping (stored in DB)

Rather than creating a separate `Category` model (which was used by the old Product),
we use `SPU.categoryL1` as the primary classification field, and define category
metadata (display name, slug, SEO text) in a new lightweight approach.

**Option chosen**: Add a `CategoryGroup` model to provide category-level metadata
for the frontend navigation, since `SPU.categoryL1` is just a string field.

```prisma
model CategoryGroup {
  id          String @id @default(cuid())
  name        String @unique  // "Beakers", "Flasks", etc.
  slug        String @unique
  description String?         // SEO description for category page
  sortOrder   Int    @default(0)
  isActive    Boolean @default(true)
}
```

And add a `categoryGroupId` foreign key to `SPU`:

```prisma
model SPU {
  // existing fields...
  categoryL1 String @map("category_l1") @db.VarChar(50)
  // NEW:
  categoryGroupId String?
  categoryGroup   CategoryGroup? @relation(fields: [categoryGroupId], references: [id])
}
```

This approach:
- Keeps backward compatibility (`categoryL1` still exists)
- Allows category page metadata (SEO description, header text)
- Enables proper navigation slugs (`/beakers`, `/flasks`)
- Can be seeded during import

### Navigation structure

```
/beakers              → SPUs where categoryGroup.slug = "beakers"
  /beakers/griffin    → SPUs where productFamilyName = "Griffin Beaker"
/flasks               → SPUs where ...
```

## 4. Frontend: Product List (SPU-aggregated)

### Current: `/app/api/products/route.ts`

Reads from `prisma.product` — needs to be rewritten to read from V3.2.

### New API route: `/app/api/v2/products/route.ts`

Temporarily create a new route while the old one is deprecated:

```typescript
// GET /api/v2/products
// Returns SPU list, each with aggregated variant info

const spus = await prisma.sPU.findMany({
  include: {
    variants: {
      include: {
        erpSkus: { take: 1 },
      },
    },
    categoryGroup: true,
  },
  where: { isActive: true },
})
```

After the new route is verified, the old `/api/products` can be replaced.

### Product list page: SPU card display

Each SPU card shows:
- SPU name (productFamilyName)
- Category badge
- Price range: "$4.90 – $48.90" (from min/max variant sellingPriceUsd)
- Variant count: "7 sizes available"
- First variant image (when available)

## 5. Frontend: Product Detail (SPU → Variant)

### Current: `/app/(store)/products/[slug]/page.tsx`

Reads from `prisma.product` — needs to read from V3.2.

### New approach

```typescript
// Detail page reads SPU by variant slug, joins variants
const variant = await prisma.productVariant.findFirst({
  where: { slug, isActive: true },
  include: {
    spu: {
      include: {
        variants: {
          include: { erpSkus: { take: 1 } },
          where: { isActive: true },
          orderBy: { volumeMl: 'asc' },
        },
      },
    },
  },
})
```

### Product detail layout

```
┌──────────────────────────────────────────────────┐
│  Product Name (variantName)                      │
│  SKU: BG-000001 | Brand: ENB                     │
│                                                  │
│  ┌─────────────┐  Volume: [50ml] [100] [250]    │
│  │  Product     │  [500] [1000] [2000] [5000]   │
│  │  Image       │                                │
│  │              │  Price: $4.90                  │
│  └─────────────┘  Stock: Houston ✓ | China ✓    │
│                                                  │
│  Specs:                                          │
│  ├ Capacity        250ml                         │
│  ├ Material        Borosilicate 3.3             │
│  ├ Wall Type       Normal Wall                   │
│  ├ Color           Clear                         │
│  └ Standard        ASTM E438                     │
│                                                  │
│  Description: ...                                │
│                                                  │
│  [Add to Cart]  [Request Quote]                  │
└──────────────────────────────────────────────────┘
```

## 6. Phase Plan

### Phase 1: Schema + Cleanup (what we're doing now)
- Update Prisma schema (ERPSKU fields + CategoryGroup + remove old models)
- Delete old Product table and related models
- Run `prisma db push` to apply

### Phase 2: Import Script
- Write `scripts/import-v32-glassware.js`
- Dry-run validation
- Full import

### Phase 3: Frontend Migration
- New API route `/api/v2/products`
- Update product list page (SPU-aggregated)
- Update product detail page (SPU → Variant with spec display)
- Update category pages (new navigation)

### Phase 4: Cleanup + Verify
- Remove old API route
- Verify all 104 SKUs display correctly
- Verify sorting and basic search work
- Run `openspec sync` to update baseline specs

## 7. Rollback Plan

If the migration fails:

1. **Schema**: `prisma db push` is reversible; the old Product table can be recreated from a backup
2. **Import**: Keep the Excel file as a backup; delete imported records via Prisma Studio if needed
3. **Frontend**: Old API route is preserved until Phase 4; revert to `/api/products` if new route has issues
