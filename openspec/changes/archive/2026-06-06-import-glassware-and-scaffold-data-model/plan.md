# Execution Plan: Import Glassware & Scaffold Data Model

## Execution Strategy

Phase-based execution, strictly sequential (each phase depends on previous).

```
Phase 1 (Schema) → Phase 2 (Import) → Phase 3 (Frontend) → Phase 4 (Cleanup)
```

Each phase ends with a verification step. If a phase fails, stop and report before proceeding.

## Phase 1: Schema + Cleanup

**Goal**: Update Prisma schema, remove old models, apply to database.

**Steps**:

1. Read current `prisma/schema.prisma` to understand existing structure
2. Apply patch: add 4 warehouse fields to ERPSKU
3. Apply patch: add CategoryGroup model
4. Apply patch: add categoryGroupId to SPU
5. Apply patch: remove Product, ProductImage, ProductSupplier models
6. Apply patch: update OrderItem.productId to reference ERPSKU
7. Run `npx prisma db push` to apply
8. Verify: `npx prisma db push` reports success

**Risks**:
- Schema removal may fail if OrderItem still has references → verify OrderItem migration first
- Seed data for CategoryGroup needed (10 records)

## Phase 2: Import Script

**Goal**: Write and run the import script.

**Steps**:

1. Create `scripts/import-v32-glassware.js`
2. Test with `--dry-run` flag
3. Run full import
4. Verify: check 1 SupplierMaster + 19 SPUs + 104 Variants + 104 ERPSKUs exist

**Dry-run output expected**:
```
[DRY-RUN] Would create: 1 SupplierMaster, 19 SPUs, 104 Variants, 104 ERPSKUs
[DRY-RUN] Cleaned: 52 "None" values, 104 margin values converted
[DRY-RUN] No errors found - ready for import
```

## Phase 3: Frontend Migration

**Goal**: Switch product listing and detail pages to V3.2 data.

**Steps**:

1. Create `/api/v2/products` route (SPU list with variant ranges)
2. Create `/api/v2/products/[slug]` route (Single variant with SPU siblings)
3. Create `/api/v2/categories` route
4. Update product list component to read from new routes
5. Update product detail component with variant selector + spec table
6. Update navbar category navigation to use CategoryGroup

## Phase 4: Cleanup

**Goal**: Remove old code, verify everything works.

**Steps**:

1. Remove old `/api/products` route
2. Test navigation: browse all categories
3. Test search: by SKU, by name
4. Run `openspec sync` to establish baseline in `openspec/specs/`
5. Report results
