---
name: novatech-labware-store
description: Project rules for Novatech Labware Store — lab glassware e-commerce built with Next.js 14 + V3.2 PIM/MDM data model.
metadata:
  short-description: Work on the Novatech Labware Store project
---

# Novatech Labware Store

This skill is loaded automatically when working on the `novatech-store` project.

## First: Read CODEX.md

The project's full instruction file is at the repository root. Read `CODEX.md` before any development work if you haven't already.

## Project Identity

Lab glassware e-commerce targeting US biochemistry labs. Products are lab glassware only (beakers, flasks, condensers, cylinders, funnels, adapters, kits). Source from Chinese OEM factories, dual warehouse (Houston + China).

## Critical Rules (short form)

**Data:**
- V3.2 is the ONLY data model: SupplierMaster → SPU → ProductVariant → ERPSKU
- Do NOT read/write `prisma.product` — old model is deprecated
- ERPSKU has dual-warehouse stock: `stockHouston` and `stockChina`
- Product queries: list by SPU, detail by ProductVariant join SPU

**Business:**
- US address = ship from Houston; non-US = ship from China
- ≤5 items + US address → auto checkout (Stripe); else → Quote flow
- All prices in USD

**Frontend:**
- Colors from tailwind.config.ts tokens, never hardcoded hex
- Text from `useI18n()`, never hardcoded English
- Product list = SPU-aggregated; detail page = SPU info + Variant selector
- Category: product-type based (beakers/flasks/condensers/...)

**Quality:**
- Conventional Commits: feat/fix/chore/refactor/docs/data/style/perf/test
- Schema changes require an ADR in `docs/decisions/`
- No JSON field as search/filter criteria — use structured columns

## File Index

| File | Purpose |
|---|---|
| `CODEX.md` | Full project instructions |
| `CHANGELOG.md` | Version changelog |
| `docs/decisions/` | Architecture decisions |
| `tailwind.config.ts` | Design tokens |
| `prisma/schema.prisma` | Database schema |
| `lib/i18n/` | Multi-language translations |

## OpenSpec Workflow

This project uses OpenSpec OPSX (expanded profile) + Superpowers for spec-driven development.

### Before writing code, check:
1. Is there an ongoing change in `openspec/changes/`?
2. Read `openspec/config.yaml` for project context
3. Follow the appropriate workflow:

### Quick Workflow Selection

| If you want to... | Run |
|-------------------|-----|
| explore / think through an idea | `/opsx:explore` |
| create a full proposal fast | `/opsx:propose <name>` |
| scaffold + build artifacts one by one | `/opsx:new` then `/opsx:continue` |
| generate all artifacts at once | `/opsx:ff <name>` |
| implement from tasks | `/opsx:apply` |
| verify implementation | `/opsx:verify` |
| archive when done | `/opsx:archive` |

### For complex changes (Superpowers):
1. Write `docs/solutions/<topic>.md` first
2. Get user confirmation
3. Then enter OpenSpec workflow: `/opsx:new` → `/opsx:continue` → `/opsx:apply`
4. Review gate: `review.md` must pass before `/opsx:apply`

### Key constraint references:
- `openspec/config.yaml` → project context + immutable constraints
- `CODEX.md` → full project rules
- `docs/decisions/` → architecture decisions (ADRs)

## Navigation Model (Laboy Glass inspired)
- Primary: product-type categories (beakers/flasks/condensers/...)
- Cross-dimension 1: Joint Size (24/40, 19/22, 14/20 → /products?jointSize=24-40)
- Cross-dimension 2: Material (borosilicate, ptfe → /products?material=borosilicate)
- Quick View: hover-triggered modal with specs + price on product cards
- Compare: floating bar for 2-4 products, side-by-side spec comparison
- These navigations reuse existing FilterPanel + useProductFilters hook — no new API routes needed
