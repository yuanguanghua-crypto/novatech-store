# Tasks: 多维筛选面板 & 产品详情页改造

## Phase 1: API + Data Layer

- [x] T1.1 Create `app/api/v2/variants/route.ts` — flat variant list with filter fields
- [ ] T1.2 Update `ProductsClient` to fetch from `/api/v2/variants` for filtering

## Phase 2: Filter Panel

- [x] T2.1 Create `hooks/use-product-filters.ts` — URL-based filter state management
- [x] T2.2 Create `components/store/filter-panel/index.tsx` — main panel container
- [x] T2.3 Create `components/store/filter-panel/filter-section.tsx` — reusable filter section
- [x] T2.4 Create `components/store/filter-panel/filter-pills.tsx` — selected filters display
- [ ] T2.5 Integrate FilterPanel into `ProductsClient`
- [ ] T2.6 Mobile responsive: filter drawer

## Phase 3: Product Detail

- [ ] T3.1 Create `components/store/product-detail/variant-selector.tsx`
- [ ] T3.2 Create `components/store/product-detail/spec-table.tsx`
- [ ] T3.3 Create `components/store/product-detail/stock-badge.tsx`
- [ ] T3.4 Create `components/store/product-detail/sibling-nav.tsx`
- [ ] T3.5 Update `products/[slug]/page.tsx` — server component fetching V3.2 API
- [ ] T3.6 Update `product-detail-client.tsx` — integrate new components
- [ ] T3.7 Add SEO: generateMetadata with variant name, specs, price

## Phase 4: Adapt Cart/Quote

- [ ] T4.1 Update `add-to-cart-button.tsx` — use V3.2 variantId + erpSku
- [ ] T4.2 Update `add-to-quote-button.tsx` — use V3.2 variantId + erpSku

## Phase 5: Verify

- [ ] T5.1 Verify filter: volume + material + wall type combination
- [ ] T5.2 Verify filter: empty results + clear filters
- [ ] T5.3 Verify product detail: variant switching
- [ ] T5.4 Verify product detail: SpecTable rendering
- [ ] T5.5 Verify product detail: StockBadge with dual warehouse
- [ ] T5.6 Verify mobile responsive: filter drawer + product grid
