# Execution Plan: 多维筛选面板 & 产品详情页改造

## Execution Strategy

Phase-based, strictly sequential. Each phase builds on the previous.

```
Phase 1 (API) → Phase 2 (Filter) → Phase 3 (Detail) → Phase 4 (Cart) → Phase 5 (Verify)
```

## Phase 1: API + Data Layer

**Goal**: Create the variants API that the filter panel needs.

**Steps**:
1. Create `/api/v2/variants/route.ts` — returns flat list of all active variants with filter-relevant fields
2. Includes: variantId, spuId, volumeMl, materialFamily, wallType, jointType, jointSize, accuracyClass, sellingPriceUsd, slug

**Dependencies**: None (V3.2 API already exists)

## Phase 2: Filter Panel

**Goal**: Build the multi-dimensional filter panel component.

**Steps**:
1. Create `useProductFilters` hook — URL ↔ filter state sync
2. Create `FilterSection` — reusable component for any filter dimension
3. Create `FilterPills` — shows active filters with remove button
4. Create `FilterPanel` — container that combines all sections
5. Integrate into ProductsClient
6. Add mobile responsive behavior

**Key decisions**:
- All 104 variants loaded client-side
- URL params are the single source of truth
- Filter dimensions: volume, material, wall, joint type, joint size, accuracy class, price

## Phase 3: Product Detail

**Goal**: Rebuild product detail page on V3.2 data.

**Steps**:
1. Create `VariantSelector` — receives siblingVariants, shows volume/size buttons
2. Create `SpecTable` — renders specs array as two-column table
3. Create `StockBadge` — dual warehouse display
4. Create `SiblingNav` — links to other variants in same SPU
5. Update page.tsx to fetch from /api/v2
6. Integrate components into ProductDetailClient
7. Add SEO metadata

**Key decisions**:
- Variant change → URL navigation (not state switching)
- Empty specs hidden (field exists but null)
- Old components preserved until Phase 5

## Phase 4: Cart/Quote Adaptation

**Goal**: Ensure cart and quote work with V3.2 IDs.

**Steps**:
1. Update AddToCartButton to pass variantId + erpSku
2. Update AddToQuoteButton similarly

## Phase 5: Verification

**Goal**: Test all scenarios from specs.

**Steps**:
1. Filter combination tests
2. Edge cases (empty results, no filters selected)
3. Variant switching end-to-end
4. Mobile responsiveness
