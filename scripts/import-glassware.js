/**
 * Import 104 glassware products from Excel into LABPRO Store database.
 *
 * Steps:
 * 1. Delete existing products (old LABPRO products)
 * 2. Read Excel file
 * 3. Map categories (Kit products → Kit Products category)
 * 4. Create 104 products with LABPRO brand
 *
 * Usage: node scripts/import-glassware.js
 */

const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

const EXCEL_PATH = 'E:\\玻璃仪器数据\\v32_sku_104_fixed.xlsx';

// Category mapping: Excel Category_L1 → DB category slug
const CATEGORY_MAP = {
  'Basic Glassware': 'basic-glassware',
  'Analytical Glassware': 'analytical-glassware',
  'Reaction Systems': 'reaction-systems',
  'Distillation Systems': 'distillation-systems',
  'Filtration Systems': 'filtration-systems',
  'Storage Systems': 'storage-systems',
  // Kit products will be remapped to 'kit-products'
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 120);
}

function buildSpecs(row) {
  const specs = {};
  if (row.Volume_ml) specs['Volume'] = `${row.Volume_ml} mL`;
  if (row.Length_mm) specs['Length'] = `${row.Length_mm} mm`;
  if (row.Joint_Type && row.Joint_Type !== 'None') specs['Joint Type'] = row.Joint_Type;
  if (row.Joint_Size && row.Joint_Size !== 'None') specs['Joint Size'] = row.Joint_Size;
  if (row.Wall_Type) specs['Wall Type'] = row.Wall_Type;
  if (row.Material_Family) specs['Material'] = row.Material_Family;
  if (row.Color) specs['Color'] = row.Color;
  if (row.Accuracy_Class) specs['Accuracy Class'] = row.Accuracy_Class;
  if (row.Product_Family) specs['Product Family'] = row.Product_Family;
  return specs;
}

function buildSpecsFlat(row) {
  const parts = [];
  if (row.Product_Family) parts.push(row.Product_Family);
  if (row.Volume_ml) parts.push(`${row.Volume_ml}ml`);
  if (row.Material_Family) parts.push(row.Material_Family);
  if (row.Color) parts.push(row.Color);
  if (row.Joint_Size && row.Joint_Size !== 'None') parts.push(`Joint ${row.Joint_Size}`);
  if (row.Wall_Type) parts.push(row.Wall_Type);
  return parts.join(' ');
}

async function main() {
  console.log('=== LABPRO Glassware Import ===\n');

  // 1. Read Excel
  console.log(`Reading Excel: ${EXCEL_PATH}`);
  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);
  console.log(`Found ${rows.length} rows in Excel\n`);

  // 2. Get category IDs from DB
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });
  const catMap = {};
  for (const cat of categories) {
    catMap[cat.slug] = cat.id;
  }
  console.log('Category IDs:', Object.entries(catMap).map(([k, v]) => `${k}: ${v.substring(0, 12)}...`).join(', '));

  // Get LABPRO brand ID
  const brand = await prisma.brand.findFirst({ where: { slug: 'labpro' } });
  if (!brand) throw new Error('LABPRO brand not found. Run seed-categories.js first.');
  console.log(`LABPRO brand ID: ${brand.id.substring(0, 12)}...\n`);

  // 3. Delete existing products (order matters for FK constraints)
  const existingCount = await prisma.product.count();
  console.log(`Deleting ${existingCount} existing products...`);
  await prisma.productImage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.productSupplier.deleteMany();
  // Clear FK references before deleting variants
  await prisma.product.updateMany({ data: { variantId: null, spuId: null, supplierMasterId: null } });
  // Delete ERPSKU first (references ProductVariant)
  try { await prisma.eRPSKU.deleteMany(); } catch (e) { console.log('  (no ERPSKU table or empty)'); }
  try { await prisma.productVariant.deleteMany(); } catch (e) { console.log('  (no ProductVariant table or empty)'); }
  await prisma.product.deleteMany();
  console.log('All existing products deleted.\n');

  // 4. Import products
  let created = 0;
  let skipped = 0;
  const categoryCounts = {};

  for (const row of rows) {
    try {
      // Determine category
      let catSlug = CATEGORY_MAP[row.Category_L1];
      if (!catSlug) {
        console.log(`  SKIP: Unknown category "${row.Category_L1}" for ${row.ERP_SKU}`);
        skipped++;
        continue;
      }

      // Remap Kit products
      const isKit = row.Product_Family && row.Product_Family.toLowerCase().includes('kit');
      if (isKit) {
        catSlug = 'kit-products';
      }

      const categoryId = catMap[catSlug];
      if (!categoryId) {
        console.log(`  SKIP: Category "${catSlug}" not in DB for ${row.ERP_SKU}`);
        skipped++;
        continue;
      }

      categoryCounts[catSlug] = (categoryCounts[catSlug] || 0) + 1;

      // Build product
      const slug = slugify(row.SEO_Product_Name || row.ERP_SKU);
      const specs = buildSpecs(row);
      const specsFlat = buildSpecsFlat(row);

      await prisma.product.create({
        data: {
          sku: row.ERP_SKU,
          internalId: row.Business_SKU || null,
          name: row.SEO_Product_Name,
          slug,
          description: row.SEO_Product_Name,
          categoryId,
          brandId: brand.id,
          ourPrice: row.Selling_Price_USD,
          listPrice: row.Selling_Price_USD,
          costPrice: row.Cost_Price_USD || null,
          currency: 'USD',
          availability: 'in_stock',
          stockQty: row.Initial_Stock || 0,
          specs,
          specsFlat,
          isActive: true,
          isFeatured: isKit, // Kits are featured
          isNew: false,
          // V3.2 mapping
          erpSkuCode: row.ERP_SKU,
          businessSku: row.Business_SKU || null,
          variantId: row.Variant_ID || null,
          spuId: row.SPU_ID || null,
        },
      });

      created++;
    } catch (err) {
      console.error(`  ERROR: ${row.ERP_SKU} - ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n=== Import Complete ===`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`\nCategory breakdown:`);
  for (const [slug, count] of Object.entries(categoryCounts)) {
    console.log(`  ${slug}: ${count}`);
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Fatal error:', err);
  prisma.$disconnect();
  process.exit(1);
});
