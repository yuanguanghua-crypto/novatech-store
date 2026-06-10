/**
 * Import v32_sku_104_fixed.xlsx into V3.2 PIM/MDM data model
 *
 * Usage:
 *   node scripts/import-v32-glassware.js                    # full import
 *   node scripts/import-v32-glassware.js --dry-run          # validate only
 *   node scripts/import-v32-glassware.js --file <path>      # custom file path
 *
 * Dependencies: xlsx, @prisma/client
 * Pre-requisites: npm run db:push (schema applied), npm run db:generate
 */

const XLSX = require('xlsx');
const path = require('path');
const slugify = require('slugify');
const { PrismaClient } = require('@prisma/client');

// ─── Config ──────────────────────────────────────────────────────────
const DEFAULT_FILE = path.resolve(__dirname, '..', 'v32_sku_104_fixed.xlsx');
const DEFAULT_FILE_ALT = '/Volumes/PC E/玻璃仪器数据/v32_sku_104_fixed.xlsx';
const BATCH_SIZE = 50;

const CATEGORY_MAP = new Map([
  ['Griffin Beaker',      { group: 'Beakers',              slug: 'beakers' }],
  ['Tall Beaker',         { group: 'Beakers',              slug: 'beakers' }],
  ['Erlenmeyer Flask',    { group: 'Flasks',               slug: 'flasks' }],
  ['Round Bottom Flask',  { group: 'Flasks',               slug: 'flasks' }],
  ['Volumetric Flask',    { group: 'Flasks',               slug: 'flasks' }],
  ['Filtering Flask',     { group: 'Flasks',               slug: 'flasks' }],
  ['Media Bottle',        { group: 'Bottles & Jars',       slug: 'bottles-jars' }],
  ['Graduated Cylinder',  { group: 'Cylinders',            slug: 'cylinders' }],
  ['Allihn Condenser',    { group: 'Condensers',           slug: 'condensers' }],
  ['Liebig Condenser',    { group: 'Condensers',           slug: 'condensers' }],
  ['Buchner Funnel',      { group: 'Funnels',              slug: 'funnels' }],
  ['Glass Funnel',        { group: 'Funnels',              slug: 'funnels' }],
  ['Adapter',             { group: 'Adapters & Connectors', slug: 'adapters-connectors' }],
  ['Burette',             { group: 'Analytical',           slug: 'analytical' }],
  ['Volumetric Pipette',  { group: 'Analytical',           slug: 'analytical' }],
  ['Distillation Kit',    { group: 'Distillation Kits',    slug: 'distillation-kits' }],
  ['Vacuum Filtration Kit',{ group: 'Filtration Kits',     slug: 'filtration-kits' }],
  ['Organic Synthesis Kit',{ group: 'Synthetic & Reaction',slug: 'synthetic-reaction' }],
]);

// ─── CLI Args ────────────────────────────────────────────────────────
const isDryRun = process.argv.includes('--dry-run');
const fileIdx = process.argv.indexOf('--file');
const filePath = fileIdx > -1 ? process.argv[fileIdx + 1] : null;

// ─── Read Excel ──────────────────────────────────────────────────────
function readExcel(file) {
  if (!file || !file.startsWith('/')) file = DEFAULT_FILE;
  if (!require('fs').existsSync(file)) {
    if (file === DEFAULT_FILE && require('fs').existsSync(DEFAULT_FILE_ALT)) {
      file = DEFAULT_FILE_ALT;
    } else {
      console.error(`File not found: ${file}`);
      console.error(`Tried: ${DEFAULT_FILE}`);
      console.error(`Alt:  ${DEFAULT_FILE_ALT}`);
      process.exit(1);
    }
  }

  const wb = XLSX.readFile(file);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

  console.log(`Read ${rows.length} rows from ${path.basename(file)}`);
  return rows;
}

// ─── Data Cleaning ───────────────────────────────────────────────────
function cleanRows(rows) {
  let noneCount = 0;
  let marginCount = 0;

  const cleaned = rows.map((r, idx) => {
    // "None" string → NULL
    ['Joint_Type', 'Joint_Size'].forEach(field => {
      if (r[field] === 'None') {
        r[field] = null;
        noneCount++;
      }
    });

    // Gross_Margin: ratio → percentage (0.62 → 62.00)
    if (typeof r.Gross_Margin === 'number') {
      r.Gross_Margin = Math.round(r.Gross_Margin * 10000) / 100;
      marginCount++;
    }

    return r;
  });

  console.log(`Cleaned: ${noneCount} "None" values → NULL, ${marginCount} margin values ×100`);
  return cleaned;
}

// ─── Group by SPU_ID ────────────────────────────────────────────────
function groupBySPU(rows) {
  const spuMap = new Map();
  for (const row of rows) {
    const spuId = row.SPU_ID;
    if (!spuMap.has(spuId)) {
      spuMap.set(spuId, {
        spuId,
        productFamilyName: row.Product_Family,
        categoryL1: CATEGORY_MAP.get(row.Product_Family)?.group || 'Other',
        categorySlug: CATEGORY_MAP.get(row.Product_Family)?.slug || 'other',
        seoTitle: row.SEO_Product_Name,
        variants: [],
      });
    }
    spuMap.get(spuId).variants.push(row);
  }
  return [...spuMap.values()];
}

// ─── Generate slug ───────────────────────────────────────────────────
function makeSlug(text) {
  return slugify(text, { lower: true, strict: true });
}

// ─── Main Import ─────────────────────────────────────────────────────
async function main() {
  const file = filePath || DEFAULT_FILE;
  const raw = readExcel(file);
  const rows = cleanRows(raw);
  const spuGroups = groupBySPU(rows);

  console.log(`Grouped into ${spuGroups.length} SPUs, ${rows.length} variants total`);
  console.log(`Import mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`);

  if (isDryRun) {
    console.log('\n[DRY-RUN] Summary:');
    console.log(`  SupplierMaster:  1 (ENB)`);
    console.log(`  CategoryGroups:  ${new Set(spuGroups.map(s => s.categorySlug)).size}`);
    console.log(`  SPUs:            ${spuGroups.length}`);
    console.log(`  ProductVariants: ${rows.length}`);
    console.log(`  ERPSKUs:         ${rows.length}`);
    console.log(`  VariantSupplierMap: ${rows.length}`);
    console.log('\n  No errors found — ready for import.');
    process.exit(0);
  }

  // ── Live import ──
  const prisma = new PrismaClient();

  try {
    // 1. Create default SupplierMaster
    const supplier = await prisma.supplierMaster.upsert({
      where: { supplierId: 'ENB' },
      update: {},
      create: {
        supplierId: 'ENB',
        supplierName: 'ENB',
        country: 'CN',
        leadTimeDays: 30,
        rating: 0.0,
      },
    });
    console.log(`  ✓ SupplierMaster: ENB`);

    // 2. Create CategoryGroup records
    const catSlugs = [...new Set(spuGroups.map(s => s.categorySlug))];
    const catNames = [...new Set(spuGroups.map(s => s.categoryL1))];
    const catMap = new Map();

    for (let i = 0; i < catSlugs.length; i++) {
      const cg = await prisma.categoryGroup.upsert({
        where: { slug: catSlugs[i] },
        update: {},
        create: { name: catNames[i], slug: catSlugs[i], sortOrder: i },
      });
      catMap.set(cg.slug, cg.id);
    }
    console.log(`  ✓ CategoryGroups: ${catSlugs.length}`);

    // 3. Create SPU records
    for (const spu of spuGroups) {
      const slug = spu.spuId.toLowerCase().replace(/[^a-z0-9-]/g, '');
      await prisma.sPU.upsert({
        where: { spuId: spu.spuId },
        update: {
          productFamilyName: spu.productFamilyName,
          categoryL1: spu.categoryL1,
          categoryGroupId: catMap.get(spu.categorySlug) || null,
          seoTitle: spu.seoTitle,
        },
        create: {
          spuId: spu.spuId,
          productFamilyName: spu.productFamilyName,
          categoryL1: spu.categoryL1,
          categoryGroupId: catMap.get(spu.categorySlug) || null,
          seoTitle: spu.seoTitle,
          slug,
        },
      });
    }
    console.log(`  ✓ SPUs: ${spuGroups.length}`);

    // 4. Create ProductVariant + ERPSKU records
    let variantCount = 0;
    let skuCount = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      for (const row of batch) {
        const variantSlug = makeSlug(`${row.Product_Family}-${row.Volume_ml || ''}ml`);
        
        await prisma.productVariant.upsert({
          where: { variantId: row.Variant_ID },
          update: {
            variantName: row.SEO_Product_Name.substring(0, 200),
            volumeMl: row.Volume_ml || null,
            lengthMm: row.Length_mm || null,
            jointType: row.Joint_Type || null,
            jointSize: row.Joint_Size || null,
            wallType: row.Wall_Type || null,
            materialFamily: row.Material_Family || null,
            color: row.Color || null,
            accuracyClass: row.Accuracy_Class || null,
            sellingPriceUsd: row.Selling_Price_USD,
            costPriceUsd: row.Cost_Price_USD,
            grossMarginPct: row.Gross_Margin || null,
          },
          create: {
            variantId: row.Variant_ID,
            spuId: row.SPU_ID,
            variantName: row.SEO_Product_Name.substring(0, 200),
            volumeMl: row.Volume_ml || null,
            lengthMm: row.Length_mm || null,
            jointType: row.Joint_Type || null,
            jointSize: row.Joint_Size || null,
            wallType: row.Wall_Type || null,
            materialFamily: row.Material_Family || null,
            color: row.Color || null,
            accuracyClass: row.Accuracy_Class || null,
            sellingPriceUsd: row.Selling_Price_USD,
            costPriceUsd: row.Cost_Price_USD,
            grossMarginPct: row.Gross_Margin || null,
            slug: variantSlug,
          },
        });
        variantCount++;

        await prisma.eRPSKU.upsert({
          where: { erpSku: row.ERP_SKU },
          update: {
            businessSku: row.Business_SKU,
            initialStockQty: row.Initial_Stock || 0,
            lowStockAlertQty: row.Low_Stock_Alert || 0,
            stockHouston: 500,
            stockChina: 500,
          },
          create: {
            erpSku: row.ERP_SKU,
            variantId: row.Variant_ID,
            businessSku: row.Business_SKU,
            initialStockQty: row.Initial_Stock || 0,
            lowStockAlertQty: row.Low_Stock_Alert || 0,
            stockHouston: 500,
            stockChina: 500,
          },
        });
        skuCount++;

        // Create VariantSupplierMap
        await prisma.variantSupplierMap.upsert({
          where: { variantId_supplierId: { variantId: row.Variant_ID, supplierId: 'ENB' } },
          update: {},
          create: {
            variantId: row.Variant_ID,
            supplierId: 'ENB',
            unitCostUsd: row.Cost_Price_USD,
            moq: 100,
            leadTimeDays: 25,
            isPreferred: true,
          },
        });
      }
    }

    console.log(`  ✓ ProductVariants: ${variantCount}`);
    console.log(`  ✓ ERPSKUs: ${skuCount}`);
    console.log(`  ✓ VariantSupplierMaps: ${skuCount}`);

    console.log('\n✓ Import complete!');
    console.log(`  Summary: 1 SupplierMaster, ${catSlugs.length} Categories, ${spuGroups.length} SPUs, ${variantCount} Variants, ${skuCount} SKUs`);

  } catch (error) {
    console.error('\n✗ Import failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
