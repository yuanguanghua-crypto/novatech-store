#!/usr/bin/env node
/**
 * V3.2 → Product 同步脚本
 *
 * 功能：从 V3.2 四层架构（variant/SPU/supplier/ERP SKU）生成 Product 记录
 * 前置：V3.2 表已导入数据（2 suppliers, 19 SPUs, 67 variants, 19 ERP SKUs）
 *
 * 用法：node scripts/sync-v32-to-product.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const colors = {
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  red: (t) => `\x1b[31m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  cyan: (t) => `\x1b[36m${t}\x1b[0m`,
  blue: (t) => `\x1b[34m${t}\x1b[0m`,
};

// ── Brand 定义 ──────────────────────────────────────────────
const BRANDS = [
  {
    name: 'NovaTech',
    slug: 'novatech',
    description: 'NovaTech laboratory glassware manufacturer — borosilicate 3.3 precision instruments',
    website: 'https://novatech-usa.com',
    country: 'CN',
  },
];

// ── Category 定义（基于 V3.2 SPU 的 categoryL1）────────────
const CATEGORIES = [
  { name: 'Basic Glassware', slug: 'basic-glassware', description: 'Beakers, flasks, cylinders, funnels — everyday lab essentials' },
  { name: 'Analytical Glassware', slug: 'analytical-glassware', description: 'Volumetric flasks, burettes, pipettes — precision measurement instruments' },
  { name: 'Reaction Systems', slug: 'reaction-systems', description: 'Round bottom flasks and organic synthesis kits' },
  { name: 'Distillation Systems', slug: 'distillation-systems', description: 'Condensers, adapters, and distillation kits' },
  { name: 'Filtration Systems', slug: 'filtration-systems', description: 'Filtering flasks, Buchner funnels, vacuum filtration kits' },
  { name: 'Storage Systems', slug: 'storage-systems', description: 'Media bottles and storage containers' },
];

// ── SPU → Category 映射 ─────────────────────────────────────
const SPU_CATEGORY_MAP = {
  'GF-LF': 'Basic Glassware',
  'TF': 'Basic Glassware',
  'EF-NN': 'Basic Glassware',
  'GC': 'Basic Glassware',
  'FN': 'Basic Glassware',
  'VF-CL-A': 'Analytical Glassware',
  'BR': 'Analytical Glassware',
  'PP': 'Analytical Glassware',
  'RF-1N': 'Reaction Systems',
  'RF-3N': 'Reaction Systems',
  'LB-2440': 'Distillation Systems',
  'AH-2440': 'Distillation Systems',
  'AD': 'Distillation Systems',
  'VF-HW': 'Filtration Systems',
  'BF': 'Filtration Systems',
  'MB-GL45': 'Storage Systems',
  'KIT-ORG': 'Reaction Systems',
  'KIT-DIST': 'Distillation Systems',
  'KIT-VAC': 'Filtration Systems',
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log(colors.blue('═══════════════════════════════════════════════════'));
  console.log(colors.blue('  V3.2 → Product 同步工具'));
  console.log(colors.blue('═══════════════════════════════════════════════════'));

  try {
    // ── 1. 确保 Brand 存在 ──────────────────────────────────
    console.log(colors.cyan('\n[1/4] 同步 Brand...'));
    const brandRecords = {};
    for (const b of BRANDS) {
      const record = await prisma.brand.upsert({
        where: { slug: b.slug },
        create: b,
        update: { description: b.description },
      });
      brandRecords[b.name] = record.id;
      console.log(colors.green(`  ✓ ${b.name} (${record.id})`));
    }

    // ── 2. 确保 Category 存在 ───────────────────────────────
    console.log(colors.cyan('\n[2/4] 同步 Category...'));
    const categoryRecords = {};
    for (const c of CATEGORIES) {
      const record = await prisma.category.upsert({
        where: { slug: c.slug },
        create: c,
        update: { description: c.description },
      });
      categoryRecords[c.name] = record.id;
      console.log(colors.green(`  ✓ ${c.name} (${record.id})`));
    }

    // ── 3. 获取所有 V3.2 变体 + 关联 ERP SKU ───────────────
    console.log(colors.cyan('\n[3/4] 从 V3.2 变体生成 Product...'));

    const variants = await prisma.productVariant.findMany({
      where: { isActive: true },
      include: {
        spu: true,
        erpSkus: true,
      },
    });

    console.log(colors.cyan(`  找到 ${variants.length} 个活跃变体`));

    const brandId = brandRecords['NovaTech'];
    let createdCount = 0;
    let updatedCount = 0;
    let skipCount = 0;

    for (const v of variants) {
      // 确定分类
      const categoryName = SPU_CATEGORY_MAP[v.spuId] || 'Basic Glassware';
      const categoryId = categoryRecords[categoryName];

      if (!categoryId) {
        console.log(colors.yellow(`  ⚠ 分类不存在: ${categoryName}，跳过 ${v.variantId}`));
        skipCount++;
        continue;
      }

      // SKU: 优先用 businessSku，否则用 variantId
      const primaryErpSku = v.erpSkus[0];
      const sku = primaryErpSku ? primaryErpSku.businessSku : v.variantId;

      // slug: 用变体的 slug 字段，如果没有则从 variantName 生成
      const slug = v.slug || slugify(`${v.spu.productFamilyName}-${v.variantName}`);

      // 规格参数 JSON
      const specs = {};
      if (v.volumeMl) specs['Volume'] = `${v.volumeMl} ml`;
      if (v.lengthMm) specs['Length'] = `${v.lengthMm} mm`;
      if (v.materialFamily) specs['Material'] = v.materialFamily;
      if (v.color) specs['Color'] = v.color;
      if (v.accuracyClass) specs['Accuracy'] = v.accuracyClass;
      if (v.jointType) specs['Joint Type'] = v.jointType;
      if (v.jointSize) specs['Joint Size'] = v.jointSize;
      specs['Product Family'] = v.spu.productFamilyName;
      specs['Category'] = v.spu.categoryL1;

      // specsFlat 用于搜索
      const specsFlat = Object.values(specs).join(' | ');

      // 库存
      const stockQty = primaryErpSku ? primaryErpSku.initialStockQty : 0;
      const availability = stockQty > 0 ? 'in_stock' : 'lead_time';

      // 重量：从 weight_grams 转换为 lbs
      const weightLbs = v.weightGrams ? (v.weightGrams / 453.592) : null;

      // 维度
      let dimension = null;
      if (v.dimensionsJson && Object.keys(v.dimensionsJson).length > 0) {
        const d = v.dimensionsJson;
        dimension = `${d.length || '?'}x${d.width || '?'}x${d.height || '?'} mm`;
      }

      const productData = {
        sku,
        name: v.variantName,
        slug,
        description: `${v.spu.productFamilyName} — ${v.variantName}. Material: ${v.materialFamily}${v.color ? `, Color: ${v.color}` : ''}${v.accuracyClass ? `, ${v.accuracyClass}` : ''}.`,
        categoryId,
        brandId,
        ourPrice: v.sellingPriceUsd,
        listPrice: v.sellingPriceUsd,
        costPrice: v.costPriceUsd,
        currency: 'USD',
        availability,
        stockQty,
        leadTimeDays: 25,
        weight: weightLbs,
        weightUnit: 'lbs',
        dimension,
        specs,
        specsFlat,
        metaTitle: v.metaTitle || v.variantName,
        metaDesc: v.metaDescription || `${v.variantName} — NovaTech Laboratory Glassware`,
        isActive: v.isActive,
        isFeatured: v.spuId === 'GF-LF' && v.volumeMl === 500, // 选一个主推款
        supplierMasterId: 'SUP-001',
        spuId: v.spuId,
        variantId: v.variantId,
        erpSkuCode: primaryErpSku ? primaryErpSku.erpSku : null,
        businessSku: primaryErpSku ? primaryErpSku.businessSku : null,
      };

      try {
        const existing = await prisma.product.findUnique({ where: { sku } });
        if (existing) {
          await prisma.product.update({ where: { sku }, data: productData });
          updatedCount++;
        } else {
          await prisma.product.create({ data: productData });
          createdCount++;
        }
      } catch (err) {
        console.log(colors.yellow(`  ⚠ ${v.variantId}: ${err.message.substring(0, 80)}`));
        skipCount++;
      }
    }

    console.log(colors.green(`  ✓ 创建: ${createdCount}, 更新: ${updatedCount}, 跳过: ${skipCount}`));

    // ── 4. 验证结果 ────────────────────────────────────────
    console.log(colors.cyan('\n[4/4] 验证结果...'));
    const finalCounts = {
      brands: await prisma.brand.count(),
      categories: await prisma.category.count(),
      products: await prisma.product.count(),
      activeProducts: await prisma.product.count({ where: { isActive: true } }),
      variants: await prisma.productVariant.count(),
      spus: await prisma.sPU.count(),
      erpSkus: await prisma.eRPSKU.count(),
    };

    console.log(colors.cyan('\n最终数据统计:'));
    console.log(`  Brand:            ${finalCounts.brands}`);
    console.log(`  Category:         ${finalCounts.categories}`);
    console.log(`  Product:          ${finalCounts.products} (${finalCounts.activeProducts} 活跃)`);
    console.log(`  V3.2 Variant:     ${finalCounts.variants}`);
    console.log(`  V3.2 SPU:         ${finalCounts.spus}`);
    console.log(`  V3.2 ERP SKU:     ${finalCounts.erpSkus}`);

    console.log(colors.green('\n═══════════════════════════════════════════════════'));
    console.log(colors.green('  同步完成！'));
    console.log(colors.green('═══════════════════════════════════════════════════'));

  } catch (error) {
    console.error(colors.red(`\n错误: ${error.message}`));
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
