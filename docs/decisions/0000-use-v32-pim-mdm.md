# 0000: Adopt V3.2 PIM/MDM as Primary Data Model

**Date**: 2026-06-05

**Status**: Accepted

## Context

The project previously used a generic e-commerce `Product` model (from the Novatech USA catalog import) with flat fields. The new product domain—laboratory glassware—requires structured specification fields: volume, joint type, wall type, material family, accuracy class, color. These are fundamental to how customers search, filter, and compare products, and storing them in a generic JSON `specs` field or a flat schema makes filtering and querying impractical.

## Decision

Adopt the four-layer V3.2 PIM/MDM architecture as the sole product data model:

```
SupplierMaster (L0) → SPU (L1) → ProductVariant (L2) → ERPSKU (L3)
```

- SupplierMaster: Chinese OEM factory records
- SPU: Product family (e.g. "Griffin Beaker")
- ProductVariant: Specific configuration (e.g. "250ml Normal Wall Borosilicate Clear")
- ERPSKU: SKU-level inventory and business codes

## Rationale

- Glassware products are naturally hierarchical: one product-family (SPU) shares description, images, and category, while individual variants differ by quantitative specs
- Structured columns (volume_ml, joint_type, material_family) enable direct database filtering without JSON parsing
- This model matches how lab supply websites like Chemglass and Stonylab organize their products
- Aligns with the data structure already defined in the V3.2 import Excel

## Consequences

- All new development reads from V3.2 tables; old `Product` table is deprecated
- Frontend product listing aggregates by SPU, detail page shows variant selector
- Product filtering queries `ProductVariant` columns directly
- Import scripts must transform flat Excel rows into the four-layer model
