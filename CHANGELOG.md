# Changelog

All notable changes to the Novatech Labware Store project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
with commit messages following [Conventional Commits](https://www.conventionalcommits.org/).

---

## [Unreleased]

### Added

- CODEX.md — project-wide instruction file for Codex development agent
- docs/decisions/ — Architecture Decision Records (ADRs) directory
  - ADR-0000: Adopt V3.2 PIM/MDM as Primary Data Model
  - ADR-0001: Discard Old Novatech Product Data
  - ADR-0002: Dual-Warehouse Inventory Model
  - ADR-0003: Dual-Path Checkout — Auto Order + Quote
- CHANGELOG.md — version changelog

### Changed

N/A — initial project setup

### Deprecated

- `prisma.product` — old Novatech USA import data model (replaced by V3.2)

---

## [0.0.1] — 2026-06-05 — Project Foundation

### Added

- Next.js 14 App Router project scaffold with TypeScript
- PostgreSQL database with Prisma ORM (V3.2 PIM/MDM schema)
- Multi-language internationalization (en/zh/es/ja/hi/ar/pt)
- Product catalog from V3.2 Excel data (18 product families, 104 SKUs)
- Frontend homepage with professional lab glassware theme
- Product listing, detail, search, and category pages
- Shopping cart (Zustand with localStorage persistence)
- B2B quote system with FAQ, knowledge section, and PO acceptance
- User authentication with NextAuth.js (Google OAuth + email/password)
- Admin panel (dashboard, products, orders, quotes, suppliers, customers)
- Knowledge base articles (product guides, comparison pages)
- Structured data markup (JSON-LD) for SEO
- Tailwind CSS design tokens (brand color system)
- Docker Compose for local development (PostgreSQL + Redis)
- AWS deployment configuration (ECS Fargate + RDS + S3 + CloudFront)

### Notes

- Initial project was forked from a broader lab supplies e-commerce template
- All Novatech USA catalog data (15,259 SKUs) is deprecated in favor of the V3.2 glassware data
- This version captures the starting state before custom glassware-focused development begins

---

[Unreleased]: https://github.com/YOUR_USER/novatech-store/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/YOUR_USER/novatech-store/releases/tag/v0.0.1

## [0.1.0] — 2026-06-06

### Added (feat)

- Import 104 glassware SKUs into V3.2 PIM/MDM data model
- Dual-warehouse stock fields on ERPSKU (stockHouston, stockChina)
- CategoryGroup model for product-type classification (10 categories)
- Import script at `scripts/import-v32-glassware.js`
- V2 API routes: `/api/v2/products`, `/api/v2/products/[slug]`, `/api/v2/categories`
- SPU.slug field for SEO-friendly product family URLs

### Changed (refactor)

- Removed old Product / ProductImage / ProductSupplier models and all references
- OrderItem.productId → OrderItem.erpSkuId (references ERPSKU)
- QuoteItem.productId → QuoteItem.erpSkuId (references ERPSKU)

### Data (data)

- Default SupplierMaster "ENB" (China, 30-day lead time)
- Initial stock: 500 each (Houston / China)
- Data cleaning: "None"→NULL, Gross_Margin ratio→percentage

### Docs

- OpenSpec expanded profile (11 commands)
- Superpowers integration skill
- ADRs: V3.2 data model, dual warehouse, dual-path checkout
- CODEX.md updated with workflow documentation


## [0.2.0] — 2026-06-06

### Added (feat)

- Multi-dimensional filter panel for product list (volume, material, wall type, joint type, accuracy class, price range)
- Client-side + URL-based filter state management via `useProductFilters` hook
- Desktop sidebar + mobile drawer responsive filter UI
- New `FilterSection` and `FilterPills` reusable components
- `/api/v2/variants` route returning flat variant data with pre-computed filter options
- V3.2-powered product detail page with `VariantSelector`, `SpecTable`, `StockBadge`, `SiblingNav` components
- SEO metadata generation from variant spec fields
- Breadcrumb navigation for product detail pages

### Docs (docs)

- Solution documents in `docs/solutions/`: filter panel spec, product detail upgrade spec
- Superpowers skill references: solution template, intent mapping


## [0.2.1] — 2026-06-07 — Build Fix & Verification

### Fixed (fix)

- TypeScript build errors across 14+ files referencing removed Product/Category models
- Runtime errors in sitemap.ts and admin dashboard (prisma.product → productVariant)
- Set iteration error (downlevelIteration) in `/api/v2/variants` route
- OrderItem/QuoteItem product include reference (→ erpSku)
- Supplier count query using removed `products` relation
- Categories listing/detail pages migrated to CategoryGroup
- Homepage migrated to ProductVariant + CategoryGroup

### Chores (chore)

- Node.js standalone installation at `~/.local/node/bin/` (v24.14.0)
- Batch build check script: `scripts/batch-build-check.sh`
- `verification.md` — comprehensive build verification document

### Notes

- Old admin pages and API routes marked with `@ts-nocheck` — need gradual migration to V3.2
- 14 files with old Product/Category references remain, suppressed for now
- 42/42 static pages generated successfully
