# 0001: Discard Old Novatech Product Data

**Date**: 2026-06-05

**Status**: Accepted

## Context

The repository contains a 20MB JSON file (novatech_nova_products.json) with ~15,259 products imported from the Novatech USA catalog. These products cover a broad range of lab supplies, only a subset of which is laboratory glassware. The business has pivoted to focus exclusively on lab glassware, sourced through direct OEM relationships with Chinese factories.

## Decision

The old Novatech product data and its associated `Product` table are discarded. They will not be used in any new development.

- The `novatech_nova_products.json` file may remain in the repo as a historical artifact but serves no functional purpose
- The `prisma.product` model is deprecated for all new code
- All data import effort focuses on the V3.2 Excel data (104 SKUs, 18 product families)

## Rationale

- The old data covers product categories no longer in scope
- Pricing, inventory, and supplier relationships do not apply to the new OEM model
- Keeping two parallel product models creates confusion and maintenance burden
- The V3.2 schema is purpose-built for glassware and incompatible with the old flat Product schema

## Consequences

- Old API routes referencing `prisma.product` must be migrated to V3.2 tables
- The `Product` table can be left in the schema but will not be populated for new products
- Documentation and code comments should reference only the V3.2 model
