# Tasks: Import Glassware & Scaffold Data Model

## Phase 1: Schema + Cleanup

- [x] T1.1 Add warehouse stock fields to ERPSKU model
- [x] T1.2 Create CategoryGroup model
- [x] T1.3 Add categoryGroupId to SPU model
- [x] T1.4 Remove old Product, ProductImage, ProductSupplier models
- [x] T1.5 Update OrderItem.productId to reference ERPSKU instead of Product
- [x] T1.6 Apply schema changes (`prisma db push`)

## Phase 2: Import Script

- [x] T2.1 Write `scripts/import-v32-glassware.js`
  - [x] T2.1a Read Excel + clean data ("None"→NULL, Gross_Margin×100)
  - [x] T2.1b Seed SupplierMaster("ENB")
  - [x] T2.1c Seed CategoryGroup records (10 categories)
  - [x] T2.1d Create SPU records (19)
  - [x] T2.1e Create ProductVariant records (104)
  - [x] T2.1f Create ERPSKU records (104, stock=500/500)
  - [x] T2.1g Create VariantSupplierMap records (link to ENB)
- [ ] T2.2 Run dry-run validation
- [ ] T2.3 Run full import

## Phase 3: Frontend Migration

- [x] T3.1 Create new API route `/api/v2/products` (SPU list)
- [x] T3.2 Create `/api/v2/products/[slug]` (product detail)
- [x] T3.3 Create `/api/v2/categories` (category list)
- [ ] T3.4 Update product list page (SPU-aggregated)
- [ ] T3.5 Update product detail page (Variant selector + Spec table)
- [ ] T3.6 Update category navigation

## Phase 4: Cleanup + Verify

- [ ] T4.1 Remove old `/api/products` route
- [ ] T4.2 Verify all 104 SKUs display correctly
- [ ] T4.3 Verify sorting and basic search
- [ ] T4.4 Archive this change
