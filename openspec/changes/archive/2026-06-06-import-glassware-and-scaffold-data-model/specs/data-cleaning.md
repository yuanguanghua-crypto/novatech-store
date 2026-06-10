# Data Cleaning Specifications

## Scope

Clean the v32_sku_104_fixed.xlsx data before import into V3.2 tables.

## Scenarios

### SC-1: "None" string → NULL

**Given** the Excel file contains literal string "None" in `Joint_Type` (1 row) and `Joint_Size` (52 rows)
**When** the import script processes these fields
**Then** the string "None" is replaced with actual NULL/empty value
**And** no other string values are affected

### SC-2: Gross_Margin ratio → percentage

**Given** the Excel file stores `Gross_Margin` as decimal ratio (e.g. 0.62 = 62%)
**When** the import script writes to `ProductVariant.grossMarginPct`
**Then** the value is multiplied by 100 and stored as integer percentage (e.g. 62.00)
**And** the column type `Decimal(5,2)` is respected (max 999.99)

### SC-3: Variant name generation

**Given** the Excel has no direct `variant_name` column
**When** creating `ProductVariant` records
**Then** `variantName` is derived from `SEO_Product_Name` (first 200 characters)
**And** slug is auto-generated from `variantName` using the existing slugify utility

### SC-4: Empty optional fields preserved

**Given** `Length_mm` is empty for 96/104 rows and `Accuracy_Class` is empty for 77/104 rows
**When** these fields are imported
**Then** they remain NULL in the database
**And** no default values are assigned

---

## Data Model Specifications

### DM-1: ERPSKU stock fields

**Given** the warehouse model requires tracking stock per location
**When** the Prisma schema is updated
**Then** `ERPSKU` table adds:
- `stockHouston Int @default(0)` — Houston warehouse
- `stockChina Int @default(0)` — China warehouse
- `lowStockAlertHouston Int @default(0)` — Houston low stock alert threshold
- `lowStockAlertChina Int @default(0)` — China low stock alert threshold

### DM-2: Default SupplierMaster

**Given** V3.2 architecture requires a SupplierMaster record for every ProductVariant
**When** initial data is imported
**Then** a default `SupplierMaster` record is created:
- `supplierId`: "ENB"
- `supplierName`: "ENB"
- `country`: "CN"
- `leadTimeDays`: 30

### DM-3: Initial stock allocation

**Given** the dual-warehouse model
**When** each ERPSKU record is created
**Then** `stockHouston = 500` and `stockChina = 500` as initial baselines
**And** both values can be adjusted later via admin tools (out of scope for this change)

### DM-4: Old Product table cleanup

**Given** the old `Product` model is deprecated and contains 15,259 obsolete records
**When** migration runs
**Then** the `Product` table and related tables (`ProductImage`, `ProductSupplier`, `OrderItem`, `QuoteItem`) that reference old products are cleaned
**And** the `Product`, `ProductImage`, `ProductSupplier` models are removed from `schema.prisma`

---

## Import Specifications

### IM-1: SupplierMaster import

**Given** the SupplierMaster table
**When** importing
**Then** one default record is created (supplierId="ENB", supplierName="ENB")
**And** this record is linked to all ProductVariant records via VariantSupplierMap

### IM-2: SPU import (18 product families → 19 SPUs)

**Given** the Excel file contains rows grouped by SPU_ID (19 unique SPU IDs)
**When** importing
**Then** each unique SPU_ID becomes one SPU record:
- `spuId` → from Excel SPU_ID
- `productFamilyName` → from Excel Product_Family
- `categoryL1` → mapped to new product-type classification (beakers, flasks, condensers, ...)
- `seoTitle` → derived from the first row's SEO_Product_Name

### IM-3: ProductVariant import (104 variants)

**Given** each Excel row is one variant
**When** importing
**Then** each row becomes one ProductVariant record with:
- `variantId` → from Excel Variant_ID
- `spuId` → from Excel SPU_ID
- `variantName` → from SEO_Product_Name (truncated to 200)
- `volumeMl` → from Volume_ml (nullable)
- `lengthMm` → from Length_mm (nullable)
- `jointType` → from Joint_Type ("None"→NULL)
- `jointSize` → from Joint_Size ("None"→NULL)
- `wallType` → from Wall_Type
- `materialFamily` → from Material_Family
- `color` → from Color
- `accuracyClass` → from Accuracy_Class
- `sellingPriceUsd` → from Selling_Price_USD
- `costPriceUsd` → from Cost_Price_USD
- `grossMarginPct` → from Gross_Margin × 100
- `slug` → auto-generated from variantName

### IM-4: ERPSKU import (104 SKUs)

**Given** each Excel row also maps to an ERPSKU
**When** importing
**Then** each row becomes one ERPSKU record with:
- `erpSku` → from Excel ERP_SKU
- `variantId` → from Excel Variant_ID
- `businessSku` → from Excel Business_SKU
- `initialStockQty` → from Initial_Stock
- `lowStockAlertQty` → from Low_Stock_Alert
- `stockHouston` → 500 (initial default)
- `stockChina` → 500 (initial default)

---

## Classification Specifications

### CL-1: New product-type categories

**Given** the existing 6 old categories are being replaced
**When** the import runs
**Then** the 18 product families are mapped to 10 product-type categories:

| New Category | Product Families |
|---|---|
| Beakers | Griffin Beaker, Tall Beaker |
| Flasks | Erlenmeyer Flask, Round Bottom Flask, Volumetric Flask, Filtering Flask |
| Condensers | Allihn Condenser, Liebig Condenser |
| Cylinders | Graduated Cylinder |
| Funnels | Buchner Funnel, Glass Funnel |
| Adapters & Connectors | Adapter |
| Bottles & Jars | Media Bottle |
| Distillation Kits | Distillation Kit |
| Filtration Kits | Vacuum Filtration Kit |
| Synthetic & Reaction | Organic Synthesis Kit |

### CL-2: SPU.categoryL1 updated

**Given** `SPU.categoryL1` currently stores "Basic Glassware", "Analytical Glassware", etc.
**When** importing
**Then** `categoryL1` is updated to the new product-type name (e.g. "Beakers", "Flasks")
**And** a new `Category` model or mapping table may be created if needed for the frontend navigation
