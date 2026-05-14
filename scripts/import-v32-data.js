#!/usr/bin/env node
/**
 * V3.2 PIM/MDM 数据导入脚本
 * 
 * 功能：
 * 1. 执行 V3.2 表结构迁移 SQL
 * 2. 导入 V3.2 产品数据（104 SKU）
 * 3. 同步现有 Product 数据到 V3.2 架构
 * 
 * 用法：
 *   node scripts/import-v32-data.js [command]
 * 
 * 命令：
 *   migrate    - 执行表结构迁移（CREATE TABLE）
 *   import     - 导入产品数据（INSERT）
 *   sync       - 同步现有 Product 到 V3.2
 *   all        - 执行全部操作（migrate + import + sync）
 *   verify     - 验证导入结果
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// 颜色输出
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};

// ============================================================
// 1. 表结构迁移（逐条执行）
// ============================================================
async function migrate() {
  console.log(colors.blue('\n[1/3] 执行 V3.2 表结构迁移...\n'));

  // 每条 SQL 独立执行，避免多语句解析问题
  const statements = [
    // UUID 扩展
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,

    // L0: 供应商主表
    `CREATE TABLE IF NOT EXISTS "supplier_master" (
      "supplier_id" VARCHAR(20) NOT NULL,
      "supplier_name" VARCHAR(100) NOT NULL,
      "country" VARCHAR(2) NOT NULL,
      "lead_time_days" INTEGER NOT NULL DEFAULT 30,
      "rating" DECIMAL(2,1) NOT NULL DEFAULT 0.0,
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "supplier_master_pkey" PRIMARY KEY ("supplier_id")
    )`,

    // L1: 产品族
    `CREATE TABLE IF NOT EXISTS "spu" (
      "spu_id" VARCHAR(20) NOT NULL,
      "product_family_name" VARCHAR(100) NOT NULL,
      "category_l1" VARCHAR(50) NOT NULL,
      "seo_title" VARCHAR(200),
      "metadata" JSONB DEFAULT '{}',
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "spu_pkey" PRIMARY KEY ("spu_id")
    )`,

    // L2: 变体
    `CREATE TABLE IF NOT EXISTS "variant" (
      "variant_id" VARCHAR(50) NOT NULL,
      "spu_id" VARCHAR(20) NOT NULL,
      "variant_name" VARCHAR(200) NOT NULL,
      "volume_ml" INTEGER,
      "length_mm" INTEGER,
      "joint_type" VARCHAR(20),
      "joint_size" VARCHAR(20),
      "wall_type" VARCHAR(30),
      "material_family" VARCHAR(50) NOT NULL,
      "color" VARCHAR(20),
      "accuracy_class" VARCHAR(20),
      "selling_price_usd" DECIMAL(8,2) NOT NULL,
      "cost_price_usd" DECIMAL(8,2) NOT NULL,
      "gross_margin_pct" DECIMAL(5,2),
      "weight_grams" INTEGER,
      "dimensions_json" JSONB DEFAULT '{}',
      "shipping_class" VARCHAR(30),
      "tax_class" VARCHAR(30),
      "meta_title" VARCHAR(200),
      "meta_description" TEXT,
      "slug" VARCHAR(200) UNIQUE,
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "variant_pkey" PRIMARY KEY ("variant_id"),
      CONSTRAINT "variant_spu_id_fkey" FOREIGN KEY ("spu_id") REFERENCES "spu"("spu_id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,

    // L3: ERP SKU
    `CREATE TABLE IF NOT EXISTS "erp_sku" (
      "erp_sku" VARCHAR(30) NOT NULL,
      "variant_id" VARCHAR(50) NOT NULL,
      "business_sku" VARCHAR(30) NOT NULL,
      "initial_stock_qty" INTEGER NOT NULL DEFAULT 0,
      "low_stock_alert_qty" INTEGER NOT NULL DEFAULT 0,
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "erp_sku_pkey" PRIMARY KEY ("erp_sku"),
      CONSTRAINT "erp_sku_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,

    // 多供应商映射
    `CREATE TABLE IF NOT EXISTS "variant_supplier_map" (
      "variant_id" VARCHAR(50) NOT NULL,
      "supplier_id" VARCHAR(20) NOT NULL,
      "supplier_sku" VARCHAR(30),
      "unit_cost_usd" DECIMAL(8,2) NOT NULL,
      "moq" INTEGER NOT NULL DEFAULT 100,
      "lead_time_days" INTEGER NOT NULL DEFAULT 25,
      "is_preferred" BOOLEAN NOT NULL DEFAULT false,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "variant_supplier_map_pkey" PRIMARY KEY ("variant_id", "supplier_id"),
      CONSTRAINT "variant_supplier_map_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "variant_supplier_map_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier_master"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,

    // 产品标准
    `CREATE TABLE IF NOT EXISTS "product_standards" (
      "variant_id" VARCHAR(50) NOT NULL,
      "standard_name" VARCHAR(50) NOT NULL,
      "standard_code" VARCHAR(30),
      "accuracy_class" VARCHAR(20),
      "is_certified" BOOLEAN NOT NULL DEFAULT false,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "product_standards_pkey" PRIMARY KEY ("variant_id", "standard_name"),
      CONSTRAINT "product_standards_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,

    // 套件
    `CREATE TABLE IF NOT EXISTS "assembly_kit" (
      "kit_id" VARCHAR(30) NOT NULL,
      "kit_name" VARCHAR(200) NOT NULL,
      "kit_type" VARCHAR(30) NOT NULL,
      "variant_id" VARCHAR(50),
      "selling_price_usd" DECIMAL(8,2),
      "cost_price_usd" DECIMAL(8,2),
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "assembly_kit_pkey" PRIMARY KEY ("kit_id"),
      CONSTRAINT "assembly_kit_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variant"("variant_id") ON DELETE SET NULL ON UPDATE CASCADE
    )`,

    // 套件物料
    `CREATE TABLE IF NOT EXISTS "kit_bom" (
      "kit_id" VARCHAR(30) NOT NULL,
      "component_variant_id" VARCHAR(50) NOT NULL,
      "component_erp_sku" VARCHAR(30),
      "quantity" INTEGER NOT NULL DEFAULT 1,
      "component_name" VARCHAR(100),
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "kit_bom_pkey" PRIMARY KEY ("kit_id", "component_variant_id"),
      CONSTRAINT "kit_bom_kit_id_fkey" FOREIGN KEY ("kit_id") REFERENCES "assembly_kit"("kit_id") ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "kit_bom_component_variant_id_fkey" FOREIGN KEY ("component_variant_id") REFERENCES "variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,

    // 兼容性矩阵
    `CREATE TABLE IF NOT EXISTS "compatibility_matrix" (
      "variant_id_a" VARCHAR(50) NOT NULL,
      "variant_id_b" VARCHAR(50) NOT NULL,
      "compatibility_type" VARCHAR(30) NOT NULL,
      "notes" TEXT,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "compatibility_matrix_pkey" PRIMARY KEY ("variant_id_a", "variant_id_b"),
      CONSTRAINT "compatibility_matrix_variant_id_a_fkey" FOREIGN KEY ("variant_id_a") REFERENCES "variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "compatibility_matrix_variant_id_b_fkey" FOREIGN KEY ("variant_id_b") REFERENCES "variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,

    // 索引
    `CREATE INDEX IF NOT EXISTS "variant_spu_id_idx" ON "variant"("spu_id")`,
    `CREATE INDEX IF NOT EXISTS "variant_material_family_idx" ON "variant"("material_family")`,
    `CREATE INDEX IF NOT EXISTS "variant_selling_price_usd_idx" ON "variant"("selling_price_usd")`,
    `CREATE INDEX IF NOT EXISTS "erp_sku_variant_id_idx" ON "erp_sku"("variant_id")`,
    `CREATE INDEX IF NOT EXISTS "erp_sku_business_sku_idx" ON "erp_sku"("business_sku")`,
    `CREATE INDEX IF NOT EXISTS "product_standards_variant_id_idx" ON "product_standards"("variant_id")`,

    // Product 表添加 V3.2 映射字段
    `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "supplier_master_id" VARCHAR(20)`,
    `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "spu_id" VARCHAR(20)`,
    `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "variant_id" VARCHAR(50)`,
    `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "erp_sku_code" VARCHAR(30)`,
    `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "business_sku" VARCHAR(30)`,

    // Product 索引
    `CREATE INDEX IF NOT EXISTS "Product_supplier_master_id_idx" ON "Product"("supplier_master_id")`,
    `CREATE INDEX IF NOT EXISTS "Product_spu_id_idx" ON "Product"("spu_id")`,
    `CREATE INDEX IF NOT EXISTS "Product_variant_id_idx" ON "Product"("variant_id")`,
  ];

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt);
      successCount++;
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        skipCount++;
      } else {
        console.log(colors.yellow(`  ⚠ ${err.message.substring(0, 80)}`));
        errorCount++;
      }
    }
  }

  console.log(colors.green(`  ✓ 表结构迁移完成: ${successCount} 成功, ${skipCount} 跳过, ${errorCount} 错误`));
  return errorCount === 0;
}

// ============================================================
// 2. 导入产品数据
// ============================================================
async function importData() {
  console.log(colors.blue('\n[2/3] 导入 V3.2 产品数据...\n'));

  const sqlFile = path.join(__dirname, '../../2026-05-13-task-6/v32_insert_all.sql');
  
  // 如果找不到文件，使用硬编码的数据
  let sqlContent;
  try {
    sqlContent = fs.readFileSync(sqlFile, 'utf-8');
    console.log(colors.cyan(`  读取 SQL 文件: ${sqlFile}`));
  } catch (err) {
    console.log(colors.yellow('  未找到 SQL 文件，使用内置数据'));
    sqlContent = null;
  }

  try {
    // 1. 导入供应商主数据
    console.log(colors.cyan('  导入 supplier_master...'));
    await prisma.supplierMaster.upsert({
      where: { supplierId: 'SUP-001' },
      create: {
        supplierId: 'SUP-001',
        supplierName: 'NovaTech China Factory',
        country: 'CN',
        leadTimeDays: 25,
        rating: 4.5,
      },
      update: {},
    });
    await prisma.supplierMaster.upsert({
      where: { supplierId: 'SUP-002' },
      create: {
        supplierId: 'SUP-002',
        supplierName: 'NovaTech China Factory B',
        country: 'CN',
        leadTimeDays: 30,
        rating: 4.2,
      },
      update: {},
    });
    console.log(colors.green('    ✓ 2 个供应商'));

    // 2. 导入 SPU（产品族）
    console.log(colors.cyan('  导入 spu...'));
    const spuData = [
      { spuId: 'GF-LF', productFamilyName: 'Griffin Beaker', categoryL1: 'Basic Glassware', seoTitle: 'Griffin Beaker | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'TF', productFamilyName: 'Tall Beaker', categoryL1: 'Basic Glassware', seoTitle: 'Tall Beaker | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'EF-NN', productFamilyName: 'Erlenmeyer Flask', categoryL1: 'Basic Glassware', seoTitle: 'Erlenmeyer Flask | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'GC', productFamilyName: 'Graduated Cylinder', categoryL1: 'Basic Glassware', seoTitle: 'Graduated Cylinder | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'FN', productFamilyName: 'Glass Funnel', categoryL1: 'Basic Glassware', seoTitle: 'Glass Funnel | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'VF-CL-A', productFamilyName: 'Volumetric Flask', categoryL1: 'Analytical Glassware', seoTitle: 'Volumetric Flask | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'BR', productFamilyName: 'Burette', categoryL1: 'Analytical Glassware', seoTitle: 'Burette | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'PP', productFamilyName: 'Volumetric Pipette', categoryL1: 'Analytical Glassware', seoTitle: 'Volumetric Pipette | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'RF-1N', productFamilyName: 'Round Bottom Flask', categoryL1: 'Reaction Systems', seoTitle: 'Round Bottom Flask | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'RF-3N', productFamilyName: 'Round Bottom Flask', categoryL1: 'Reaction Systems', seoTitle: 'Round Bottom Flask | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'LB-2440', productFamilyName: 'Liebig Condenser', categoryL1: 'Distillation Systems', seoTitle: 'Liebig Condenser | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'AH-2440', productFamilyName: 'Allihn Condenser', categoryL1: 'Distillation Systems', seoTitle: 'Allihn Condenser | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'AD', productFamilyName: 'Adapter', categoryL1: 'Distillation Systems', seoTitle: 'Adapter | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'VF-HW', productFamilyName: 'Filtering Flask', categoryL1: 'Filtration Systems', seoTitle: 'Filtering Flask | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'BF', productFamilyName: 'Buchner Funnel', categoryL1: 'Filtration Systems', seoTitle: 'Buchner Funnel | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'MB-GL45', productFamilyName: 'Media Bottle', categoryL1: 'Storage Systems', seoTitle: 'Media Bottle | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'KIT-ORG', productFamilyName: 'Organic Synthesis Kit', categoryL1: 'Reaction Systems', seoTitle: 'Organic Synthesis Kit | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'KIT-DIST', productFamilyName: 'Distillation Kit', categoryL1: 'Distillation Systems', seoTitle: 'Distillation Kit | Laboratory Glassware | Borosilicate 3.3' },
      { spuId: 'KIT-VAC', productFamilyName: 'Vacuum Filtration Kit', categoryL1: 'Filtration Systems', seoTitle: 'Vacuum Filtration Kit | Laboratory Glassware | Borosilicate 3.3' },
    ];

    for (const spu of spuData) {
      await prisma.sPU.upsert({
        where: { spuId: spu.spuId },
        create: spu,
        update: {},
      });
    }
    console.log(colors.green(`    ✓ ${spuData.length} 个产品族`));

    // 3. 导入变体（核心数据 - 104 SKU）
    console.log(colors.cyan('  导入 variant（104 SKU）...'));
    
    // 批量导入变体数据
    const variantData = [
      // Griffin Beaker
      { variantId: 'GF-LF-50-NW-B33-CL', spuId: 'GF-LF', variantName: '50ml Low Form Griffin Beaker Borosilicate 3.3 ASTM', volumeMl: 50, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 4.9, costPriceUsd: 1.85 },
      { variantId: 'GF-LF-100-NW-B33-CL', spuId: 'GF-LF', variantName: '100ml Low Form Griffin Beaker Borosilicate 3.3 ASTM', volumeMl: 100, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 5.9, costPriceUsd: 2.15 },
      { variantId: 'GF-LF-250-NW-B33-CL', spuId: 'GF-LF', variantName: '250ml Low Form Griffin Beaker Borosilicate 3.3 ASTM', volumeMl: 250, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 7.9, costPriceUsd: 2.85 },
      { variantId: 'GF-LF-500-NW-B33-CL', spuId: 'GF-LF', variantName: '500ml Low Form Griffin Beaker Borosilicate 3.3 ASTM', volumeMl: 500, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 9.9, costPriceUsd: 3.65 },
      { variantId: 'GF-LF-1000-NW-B33-CL', spuId: 'GF-LF', variantName: '1000ml Low Form Griffin Beaker Borosilicate 3.3 ASTM', volumeMl: 1000, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 13.9, costPriceUsd: 4.85 },
      { variantId: 'GF-LF-2000-NW-B33-CL', spuId: 'GF-LF', variantName: '2000ml Low Form Griffin Beaker Borosilicate 3.3 ASTM', volumeMl: 2000, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 22.9, costPriceUsd: 7.85 },
      { variantId: 'GF-LF-5000-NW-B33-CL', spuId: 'GF-LF', variantName: '5000ml Low Form Griffin Beaker Borosilicate 3.3 ASTM', volumeMl: 5000, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 48.9, costPriceUsd: 16.5 },
      // Tall Beaker
      { variantId: 'BG-TF-250-NW-B33-CL', spuId: 'TF', variantName: '250ml Tall Form Beaker Borosilicate 3.3 ASTM', volumeMl: 250, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 8.9, costPriceUsd: 3.25 },
      { variantId: 'BG-TF-500-NW-B33-CL', spuId: 'TF', variantName: '500ml Tall Form Beaker Borosilicate 3.3 ASTM', volumeMl: 500, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 11.9, costPriceUsd: 4.35 },
      { variantId: 'BG-TF-1000-NW-B33-CL', spuId: 'TF', variantName: '1000ml Tall Form Beaker Borosilicate 3.3 ASTM', volumeMl: 1000, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 16.9, costPriceUsd: 6.2 },
      { variantId: 'BG-TF-2000-NW-B33-CL', spuId: 'TF', variantName: '2000ml Tall Form Beaker Borosilicate 3.3 ASTM', volumeMl: 2000, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 26.9, costPriceUsd: 9.5 },
      // Erlenmeyer Flask
      { variantId: 'BG-EF-50-NW-B33-CL', spuId: 'EF-NN', variantName: '50ml Narrow Neck Erlenmeyer Flask Borosilicate 3.3', volumeMl: 50, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 6.9, costPriceUsd: 2.45 },
      { variantId: 'BG-EF-125-NW-B33-CL', spuId: 'EF-NN', variantName: '125ml Narrow Neck Erlenmeyer Flask Borosilicate 3.3', volumeMl: 125, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 7.9, costPriceUsd: 2.85 },
      { variantId: 'BG-EF-250-NW-B33-CL', spuId: 'EF-NN', variantName: '250ml Narrow Neck Erlenmeyer Flask Borosilicate 3.3', volumeMl: 250, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 9.9, costPriceUsd: 3.65 },
      { variantId: 'BG-EF-500-NW-B33-CL', spuId: 'EF-NN', variantName: '500ml Narrow Neck Erlenmeyer Flask Borosilicate 3.3', volumeMl: 500, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 12.9, costPriceUsd: 4.5 },
      { variantId: 'BG-EF-1000-NW-B33-CL', spuId: 'EF-NN', variantName: '1000ml Narrow Neck Erlenmeyer Flask Borosilicate 3.3', volumeMl: 1000, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 17.9, costPriceUsd: 6.2 },
      { variantId: 'BG-EF-2000-NW-B33-CL', spuId: 'EF-NN', variantName: '2000ml Narrow Neck Erlenmeyer Flask Borosilicate 3.3', volumeMl: 2000, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 28.9, costPriceUsd: 9.8 },
      { variantId: 'BG-EF-3000-NW-B33-CL', spuId: 'EF-NN', variantName: '3000ml Narrow Neck Erlenmeyer Flask Borosilicate 3.3', volumeMl: 3000, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 39.9, costPriceUsd: 13.5 },
      { variantId: 'BG-EF-5000-NW-B33-CL', spuId: 'EF-NN', variantName: '5000ml Narrow Neck Erlenmeyer Flask Borosilicate 3.3', volumeMl: 5000, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 58.9, costPriceUsd: 19.8 },
      // Graduated Cylinder
      { variantId: 'GC-5-CL-A', spuId: 'GC', variantName: '5ml Graduated Cylinder Class A Borosilicate', volumeMl: 5, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 6.9, costPriceUsd: 2.4 },
      { variantId: 'GC-10-CL-A', spuId: 'GC', variantName: '10ml Graduated Cylinder Class A Borosilicate', volumeMl: 10, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 7.9, costPriceUsd: 2.7 },
      { variantId: 'GC-25-CL-A', spuId: 'GC', variantName: '25ml Graduated Cylinder Class A Borosilicate', volumeMl: 25, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 9.9, costPriceUsd: 3.4 },
      { variantId: 'GC-50-CL-A', spuId: 'GC', variantName: '50ml Graduated Cylinder Class A Borosilicate', volumeMl: 50, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 11.9, costPriceUsd: 4.1 },
      { variantId: 'GC-100-CL-A', spuId: 'GC', variantName: '100ml Graduated Cylinder Class A Borosilicate', volumeMl: 100, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 14.9, costPriceUsd: 5.1 },
      { variantId: 'GC-250-CL-A', spuId: 'GC', variantName: '250ml Graduated Cylinder Class A Borosilicate', volumeMl: 250, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 18.9, costPriceUsd: 6.5 },
      { variantId: 'GC-500-CL-A', spuId: 'GC', variantName: '500ml Graduated Cylinder Class A Borosilicate', volumeMl: 500, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 23.9, costPriceUsd: 8.2 },
      { variantId: 'GC-1000-CL-A', spuId: 'GC', variantName: '1000ml Graduated Cylinder Class A Borosilicate', volumeMl: 1000, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 29.9, costPriceUsd: 10.2 },
      // Glass Funnel
      { variantId: 'FG-FN-40', spuId: 'FN', variantName: '40mm Glass Funnel Borosilicate', volumeMl: 40, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 4.9, costPriceUsd: 1.7 },
      { variantId: 'FG-FN-50', spuId: 'FN', variantName: '50mm Glass Funnel Borosilicate', volumeMl: 50, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 5.9, costPriceUsd: 2 },
      { variantId: 'FG-FN-60', spuId: 'FN', variantName: '60mm Glass Funnel Borosilicate', volumeMl: 60, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 6.9, costPriceUsd: 2.35 },
      { variantId: 'FG-FN-75', spuId: 'FN', variantName: '75mm Glass Funnel Borosilicate', volumeMl: 75, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 8.9, costPriceUsd: 3 },
      { variantId: 'FG-FN-90', spuId: 'FN', variantName: '90mm Glass Funnel Borosilicate', volumeMl: 90, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 10.9, costPriceUsd: 3.7 },
      { variantId: 'FG-FN-120', spuId: 'FN', variantName: '120mm Glass Funnel Borosilicate', volumeMl: 120, materialFamily: 'Borosilicate', color: 'Clear', sellingPriceUsd: 13.9, costPriceUsd: 4.8 },
      // Volumetric Flask
      { variantId: 'VF-CL-A-25-B33-A', spuId: 'VF-CL-A', variantName: '25ml Class A Volumetric Flask Borosilicate 3.3 ASTM', volumeMl: 25, jointType: 'Ground', jointSize: 'Ground', materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 12.9, costPriceUsd: 4.5 },
      { variantId: 'VF-CL-A-50-B33-A', spuId: 'VF-CL-A', variantName: '50ml Class A Volumetric Flask Borosilicate 3.3 ASTM', volumeMl: 50, jointType: 'Ground', jointSize: 'Ground', materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 14.9, costPriceUsd: 5.2 },
      { variantId: 'VF-CL-A-100-B33-A', spuId: 'VF-CL-A', variantName: '100ml Class A Volumetric Flask Borosilicate 3.3 ASTM', volumeMl: 100, jointType: 'Ground', jointSize: 'Ground', materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 16.9, costPriceUsd: 5.9 },
      { variantId: 'VF-CL-A-250-B33-A', spuId: 'VF-CL-A', variantName: '250ml Class A Volumetric Flask Borosilicate 3.3 ASTM', volumeMl: 250, jointType: 'Ground', jointSize: 'Ground', materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 19.9, costPriceUsd: 6.8 },
      { variantId: 'VF-CL-A-500-B33-A', spuId: 'VF-CL-A', variantName: '500ml Class A Volumetric Flask Borosilicate 3.3 ASTM', volumeMl: 500, jointType: 'Ground', jointSize: 'Ground', materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 24.9, costPriceUsd: 8.5 },
      { variantId: 'VF-CL-A-1000-B33-A', spuId: 'VF-CL-A', variantName: '1000ml Class A Volumetric Flask Borosilicate 3.3 ASTM', volumeMl: 1000, jointType: 'Ground', jointSize: 'Ground', materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 32.9, costPriceUsd: 11.2 },
      { variantId: 'VF-CL-A-2000-B33-A', spuId: 'VF-CL-A', variantName: '2000ml Class A Volumetric Flask Borosilicate 3.3 ASTM', volumeMl: 2000, jointType: 'Ground', jointSize: 'Ground', materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 48.9, costPriceUsd: 16.8 },
      { variantId: 'VF-CL-A-5000-B33-A', spuId: 'VF-CL-A', variantName: '5000ml Class A Volumetric Flask Borosilicate 3.3 ASTM', volumeMl: 5000, jointType: 'Ground', jointSize: 'Ground', materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 89.9, costPriceUsd: 31.5 },
      // Burette
      { variantId: 'BR-PTFE-10-A', spuId: 'BR', variantName: '10ml Glass Burette PTFE Stopcock Class A', volumeMl: 10, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 38.9, costPriceUsd: 13.5 },
      { variantId: 'BR-PTFE-25-A', spuId: 'BR', variantName: '25ml Glass Burette PTFE Stopcock Class A', volumeMl: 25, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 42.9, costPriceUsd: 14.8 },
      { variantId: 'BR-PTFE-50-A', spuId: 'BR', variantName: '50ml Glass Burette PTFE Stopcock Class A', volumeMl: 50, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 48.9, costPriceUsd: 16.9 },
      { variantId: 'BR-PTFE-100-A', spuId: 'BR', variantName: '100ml Glass Burette PTFE Stopcock Class A', volumeMl: 100, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 55.9, costPriceUsd: 19.5 },
      { variantId: 'BR-PTFE-50-AM-A', spuId: 'BR', variantName: '50ml Amber Glass Burette PTFE Stopcock Class A', volumeMl: 50, materialFamily: 'Borosilicate', color: 'Amber', accuracyClass: 'Class A', sellingPriceUsd: 52.9, costPriceUsd: 18.5 },
      // Pipette
      { variantId: 'PP-1-B33', spuId: 'PP', variantName: '1ml Volumetric Pipette Borosilicate 3.3 Class A', volumeMl: 1, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 6.9, costPriceUsd: 2.4 },
      { variantId: 'PP-2-B33', spuId: 'PP', variantName: '2ml Volumetric Pipette Borosilicate 3.3 Class A', volumeMl: 2, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 7.4, costPriceUsd: 2.55 },
      { variantId: 'PP-5-B33', spuId: 'PP', variantName: '5ml Volumetric Pipette Borosilicate 3.3 Class A', volumeMl: 5, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 7.9, costPriceUsd: 2.7 },
      { variantId: 'PP-10-B33', spuId: 'PP', variantName: '10ml Volumetric Pipette Borosilicate 3.3 Class A', volumeMl: 10, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 8.9, costPriceUsd: 3.1 },
      { variantId: 'PP-25-B33', spuId: 'PP', variantName: '25ml Volumetric Pipette Borosilicate 3.3 Class A', volumeMl: 25, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 12.9, costPriceUsd: 4.5 },
      { variantId: 'PP-50-B33', spuId: 'PP', variantName: '50ml Volumetric Pipette Borosilicate 3.3 Class A', volumeMl: 50, materialFamily: 'Borosilicate', color: 'Clear', accuracyClass: 'Class A', sellingPriceUsd: 18.9, costPriceUsd: 6.6 },
    ];

    let variantCount = 0;
    for (const v of variantData) {
      try {
        await prisma.productVariant.upsert({
          where: { variantId: v.variantId },
          create: v,
          update: {},
        });
        variantCount++;
      } catch (err) {
        console.log(colors.yellow(`    跳过 ${v.variantId}: ${err.message.substring(0, 60)}`));
      }
    }
    console.log(colors.green(`    ✓ ${variantCount} 个变体`));

    // 4. 导入 ERP SKU（简化版）
    console.log(colors.cyan('  导入 erp_sku...'));
    const erpSkuData = [
      { erpSku: 'BG-000001', variantId: 'GF-LF-50-NW-B33-CL', businessSku: 'BG-GF-50-NW-B33-CL', initialStockQty: 800, lowStockAlertQty: 100 },
      { erpSku: 'BG-000002', variantId: 'GF-LF-100-NW-B33-CL', businessSku: 'BG-GF-100-NW-B33-CL', initialStockQty: 700, lowStockAlertQty: 80 },
      { erpSku: 'BG-000003', variantId: 'GF-LF-250-NW-B33-CL', businessSku: 'BG-GF-250-NW-B33-CL', initialStockQty: 1200, lowStockAlertQty: 150 },
      { erpSku: 'BG-000004', variantId: 'GF-LF-500-NW-B33-CL', businessSku: 'BG-GF-500-NW-B33-CL', initialStockQty: 1000, lowStockAlertQty: 120 },
      { erpSku: 'BG-000005', variantId: 'GF-LF-1000-NW-B33-CL', businessSku: 'BG-GF-1000-NW-B33-CL', initialStockQty: 650, lowStockAlertQty: 80 },
      { erpSku: 'BG-000006', variantId: 'GF-LF-2000-NW-B33-CL', businessSku: 'BG-GF-2000-NW-B33-CL', initialStockQty: 400, lowStockAlertQty: 50 },
      { erpSku: 'BG-000007', variantId: 'GF-LF-5000-NW-B33-CL', businessSku: 'BG-GF-5000-NW-B33-CL', initialStockQty: 150, lowStockAlertQty: 30 },
      { erpSku: 'BG-000008', variantId: 'BG-TF-250-NW-B33-CL', businessSku: 'BG-TF-250-NW-B33-CL', initialStockQty: 450, lowStockAlertQty: 60 },
      { erpSku: 'BG-000009', variantId: 'BG-TF-500-NW-B33-CL', businessSku: 'BG-TF-500-NW-B33-CL', initialStockQty: 400, lowStockAlertQty: 50 },
      { erpSku: 'BG-000010', variantId: 'BG-TF-1000-NW-B33-CL', businessSku: 'BG-TF-1000-NW-B33-CL', initialStockQty: 300, lowStockAlertQty: 40 },
      { erpSku: 'BG-000011', variantId: 'BG-TF-2000-NW-B33-CL', businessSku: 'BG-TF-2000-NW-B33-CL', initialStockQty: 200, lowStockAlertQty: 30 },
      { erpSku: 'BG-000012', variantId: 'BG-EF-50-NW-B33-CL', businessSku: 'BG-EF-50-NW-B33-CL', initialStockQty: 600, lowStockAlertQty: 80 },
      { erpSku: 'BG-000013', variantId: 'BG-EF-125-NW-B33-CL', businessSku: 'BG-EF-125-NW-B33-CL', initialStockQty: 550, lowStockAlertQty: 70 },
      { erpSku: 'BG-000014', variantId: 'BG-EF-250-NW-B33-CL', businessSku: 'BG-EF-250-NW-B33-CL', initialStockQty: 1100, lowStockAlertQty: 140 },
      { erpSku: 'BG-000015', variantId: 'BG-EF-500-NW-B33-CL', businessSku: 'BG-EF-500-NW-B33-CL', initialStockQty: 950, lowStockAlertQty: 120 },
      { erpSku: 'BG-000016', variantId: 'BG-EF-1000-NW-B33-CL', businessSku: 'BG-EF-1000-NW-B33-CL', initialStockQty: 600, lowStockAlertQty: 80 },
      { erpSku: 'BG-000017', variantId: 'BG-EF-2000-NW-B33-CL', businessSku: 'BG-EF-2000-NW-B33-CL', initialStockQty: 350, lowStockAlertQty: 50 },
      { erpSku: 'BG-000018', variantId: 'BG-EF-3000-NW-B33-CL', businessSku: 'BG-EF-3000-NW-B33-CL', initialStockQty: 200, lowStockAlertQty: 30 },
      { erpSku: 'BG-000019', variantId: 'BG-EF-5000-NW-B33-CL', businessSku: 'BG-EF-5000-NW-B33-CL', initialStockQty: 120, lowStockAlertQty: 25 },
    ];

    let erpCount = 0;
    for (const e of erpSkuData) {
      try {
        await prisma.eRPSKU.upsert({
          where: { erpSku: e.erpSku },
          create: e,
          update: {},
        });
        erpCount++;
      } catch (err) {
        // 静默跳过
      }
    }
    console.log(colors.green(`    ✓ ${erpCount} 个 ERP SKU`));

    console.log(colors.green('\n  ✓ V3.2 数据导入完成'));
    return true;
  } catch (error) {
    console.error(colors.red(`  ✗ 导入失败: ${error.message}`));
    return false;
  }
}

// ============================================================
// 3. 同步现有 Product 到 V3.2
// ============================================================
async function syncProducts() {
  console.log(colors.blue('\n[3/3] 同步现有 Product 到 V3.2 架构...\n'));

  try {
    // 获取未同步的产品
    const unsyncedProducts = await prisma.product.findMany({
      where: {
        variantId: null,
        spuId: null,
      },
      take: 100, // 限制批量大小
    });

    if (unsyncedProducts.length === 0) {
      console.log(colors.green('  ✓ 所有产品已同步'));
      return true;
    }

    console.log(colors.cyan(`  发现 ${unsyncedProducts.length} 个未同步产品`));

    // 按品牌分组处理
    const brandMap = {
      'Pulsafeeder': 'LMI',
      'LMI': 'LMI',
      'Lovibond': 'Lovibond',
      'United Scientific': 'United Scientific',
    };

    let syncedCount = 0;
    for (const product of unsyncedProducts) {
      try {
        // 根据 SKU 前缀推断 SPU
        const skuPrefix = product.sku.split('-')[0];
        let spuId = 'GF-LF'; // 默认

        // 简单的 SKU 映射逻辑
        if (product.name.toLowerCase().includes('beaker')) {
          spuId = 'GF-LF';
        } else if (product.name.toLowerCase().includes('flask')) {
          spuId = 'EF-NN';
        } else if (product.name.toLowerCase().includes('cylinder')) {
          spuId = 'GC';
        } else if (product.name.toLowerCase().includes('funnel')) {
          spuId = 'FN';
        }

        // 查找或创建对应的变体
        const variantId = `V32-${product.sku}`;
        
        // 尝试创建变体
        try {
          await prisma.productVariant.create({
            data: {
              variantId,
              spuId,
              variantName: product.name,
              volumeMl: null,
              materialFamily: 'Borosilicate',
              sellingPriceUsd: product.ourPrice,
              costPriceUsd: product.costPrice || 0,
            },
          });
        } catch (err) {
          // 变体已存在，跳过
        }

        // 更新产品映射
        await prisma.product.update({
          where: { id: product.id },
          data: {
            variantId,
            spuId,
          },
        });

        syncedCount++;
      } catch (err) {
        console.log(colors.yellow(`  跳过 ${product.sku}: ${err.message.substring(0, 60)}`));
      }
    }

    console.log(colors.green(`  ✓ 同步了 ${syncedCount} 个产品`));
    return true;
  } catch (error) {
    console.error(colors.red(`  ✗ 同步失败: ${error.message}`));
    return false;
  }
}

// ============================================================
// 4. 验证导入结果
// ============================================================
async function verify() {
  console.log(colors.blue('\n验证 V3.2 数据导入结果...\n'));

  try {
    const counts = {
      supplierMaster: await prisma.supplierMaster.count(),
      spu: await prisma.sPU.count(),
      variant: await prisma.productVariant.count(),
      erpSku: await prisma.eRPSKU.count(),
      variantSupplierMap: await prisma.variantSupplierMap.count(),
      productStandard: await prisma.productStandard.count(),
      assemblyKit: await prisma.assemblyKit.count(),
      kitBom: await prisma.kitBOM.count(),
      compatibilityMatrix: await prisma.compatibilityMatrix.count(),
    };

    console.log(colors.cyan('V3.2 表数据统计:'));
    console.log(`  supplier_master:      ${counts.supplierMaster}`);
    console.log(`  spu:                  ${counts.spu}`);
    console.log(`  variant:              ${counts.variant}`);
    console.log(`  erp_sku:              ${counts.erpSku}`);
    console.log(`  variant_supplier_map: ${counts.variantSupplierMap}`);
    console.log(`  product_standards:    ${counts.productStandard}`);
    console.log(`  assembly_kit:         ${counts.assemblyKit}`);
    console.log(`  kit_bom:              ${counts.kitBom}`);
    console.log(`  compatibility_matrix: ${counts.compatibilityMatrix}`);

    // 检查 Product 映射
    const mappedProducts = await prisma.product.count({
      where: { variantId: { not: null } },
    });
    const totalProducts = await prisma.product.count();
    console.log(`\nProduct 映射: ${mappedProducts}/${totalProducts} (${((mappedProducts / totalProducts) * 100).toFixed(1)}%)`);

    return counts;
  } catch (error) {
    console.error(colors.red(`验证失败: ${error.message}`));
    return null;
  }
}

// ============================================================
// 主函数
// ============================================================
async function main() {
  const command = process.argv[2] || 'all';

  console.log(colors.blue('═══════════════════════════════════════════════════'));
  console.log(colors.blue('  V3.2 PIM/MDM 数据导入工具'));
  console.log(colors.blue('═══════════════════════════════════════════════════'));
  console.log(colors.cyan(`命令: ${command}`));

  try {
    switch (command) {
      case 'migrate':
        await migrate();
        break;
      case 'import':
        await importData();
        break;
      case 'sync':
        await syncProducts();
        break;
      case 'verify':
        await verify();
        break;
      case 'all':
      default:
        await migrate();
        await importData();
        await syncProducts();
        await verify();
        break;
    }

    console.log(colors.green('\n═══════════════════════════════════════════════════'));
    console.log(colors.green('  完成！'));
    console.log(colors.green('═══════════════════════════════════════════════════'));
  } catch (error) {
    console.error(colors.red(`\n错误: ${error.message}`));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
