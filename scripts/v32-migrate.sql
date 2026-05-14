-- ============================================================
-- V3.2 PIM/MDM 四层产品架构 - 数据库迁移脚本
-- 生成时间: 2026-05-14
-- 用途: 创建 V3.2 新表结构
-- ============================================================

-- 确保 UUID 扩展已启用
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- L0: 供应商主表 (SupplierMaster)
-- ============================================================
CREATE TABLE IF NOT EXISTS "supplier_master" (
  "supplier_id" VARCHAR(20) NOT NULL,
  "supplier_name" VARCHAR(100) NOT NULL,
  "country" VARCHAR(2) NOT NULL,
  "lead_time_days" INTEGER NOT NULL DEFAULT 30,
  "rating" DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "supplier_master_pkey" PRIMARY KEY ("supplier_id")
);

-- ============================================================
-- L1: 产品族 (SPU - Standard Product Unit)
-- ============================================================
CREATE TABLE IF NOT EXISTS "spu" (
  "spu_id" VARCHAR(20) NOT NULL,
  "product_family_name" VARCHAR(100) NOT NULL,
  "category_l1" VARCHAR(50) NOT NULL,
  "seo_title" VARCHAR(200),
  "metadata" JSONB DEFAULT '{}',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "spu_pkey" PRIMARY KEY ("spu_id")
);

-- ============================================================
-- L2: 变体 (ProductVariant) - 核心规格实体
-- ============================================================
CREATE TABLE IF NOT EXISTS "variant" (
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
);

-- ============================================================
-- L3: ERP SKU 映射 (ERPSKU)
-- ============================================================
CREATE TABLE IF NOT EXISTS "erp_sku" (
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
);

-- ============================================================
-- 多供应商映射 (VariantSupplierMap)
-- ============================================================
CREATE TABLE IF NOT EXISTS "variant_supplier_map" (
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
);

-- ============================================================
-- 产品标准/认证 (ProductStandard)
-- ============================================================
CREATE TABLE IF NOT EXISTS "product_standards" (
  "variant_id" VARCHAR(50) NOT NULL,
  "standard_name" VARCHAR(50) NOT NULL,
  "standard_code" VARCHAR(30),
  "accuracy_class" VARCHAR(20),
  "is_certified" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "product_standards_pkey" PRIMARY KEY ("variant_id", "standard_name"),
  CONSTRAINT "product_standards_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================================
-- 套件产品 (AssemblyKit)
-- ============================================================
CREATE TABLE IF NOT EXISTS "assembly_kit" (
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
);

-- ============================================================
-- 套件物料清单 (KitBOM)
-- ============================================================
CREATE TABLE IF NOT EXISTS "kit_bom" (
  "kit_id" VARCHAR(30) NOT NULL,
  "component_variant_id" VARCHAR(50) NOT NULL,
  "component_erp_sku" VARCHAR(30),
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "component_name" VARCHAR(100),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "kit_bom_pkey" PRIMARY KEY ("kit_id", "component_variant_id"),
  CONSTRAINT "kit_bom_kit_id_fkey" FOREIGN KEY ("kit_id") REFERENCES "assembly_kit"("kit_id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "kit_bom_component_variant_id_fkey" FOREIGN KEY ("component_variant_id") REFERENCES "variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================================
-- 兼容性矩阵 (CompatibilityMatrix)
-- ============================================================
CREATE TABLE IF NOT EXISTS "compatibility_matrix" (
  "variant_id_a" VARCHAR(50) NOT NULL,
  "variant_id_b" VARCHAR(50) NOT NULL,
  "compatibility_type" VARCHAR(30) NOT NULL,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "compatibility_matrix_pkey" PRIMARY KEY ("variant_id_a", "variant_id_b"),
  CONSTRAINT "compatibility_matrix_variant_id_a_fkey" FOREIGN KEY ("variant_id_a") REFERENCES "variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "compatibility_matrix_variant_id_b_fkey" FOREIGN KEY ("variant_id_b") REFERENCES "variant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================================
-- 索引
-- ============================================================
CREATE INDEX IF NOT EXISTS "variant_spu_id_idx" ON "variant"("spu_id");
CREATE INDEX IF NOT EXISTS "variant_material_family_idx" ON "variant"("material_family");
CREATE INDEX IF NOT EXISTS "variant_selling_price_usd_idx" ON "variant"("selling_price_usd");
CREATE INDEX IF NOT EXISTS "erp_sku_variant_id_idx" ON "erp_sku"("variant_id");
CREATE INDEX IF NOT EXISTS "erp_sku_business_sku_idx" ON "erp_sku"("business_sku");
CREATE INDEX IF NOT EXISTS "product_standards_variant_id_idx" ON "product_standards"("variant_id");

-- ============================================================
-- Product 表添加 V3.2 映射字段
-- ============================================================
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "supplier_master_id" VARCHAR(20);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "spu_id" VARCHAR(20);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "variant_id" VARCHAR(50);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "erp_sku_code" VARCHAR(30);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "business_sku" VARCHAR(30);

-- 添加外键约束
DO $$
BEGIN
  -- supplier_master 外键
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Product_supplier_master_id_fkey'
  ) THEN
    ALTER TABLE "Product" ADD CONSTRAINT "Product_supplier_master_id_fkey"
      FOREIGN KEY ("supplier_master_id") REFERENCES "supplier_master"("supplier_id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  -- spu 外键
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Product_spu_id_fkey'
  ) THEN
    ALTER TABLE "Product" ADD CONSTRAINT "Product_spu_id_fkey"
      FOREIGN KEY ("spu_id") REFERENCES "spu"("spu_id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  -- variant 外键
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Product_variant_id_fkey'
  ) THEN
    ALTER TABLE "Product" ADD CONSTRAINT "Product_variant_id_fkey"
      FOREIGN KEY ("variant_id") REFERENCES "variant"("variant_id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- 添加索引
CREATE INDEX IF NOT EXISTS "Product_supplier_master_id_idx" ON "Product"("supplier_master_id");
CREATE INDEX IF NOT EXISTS "Product_spu_id_idx" ON "Product"("spu_id");
CREATE INDEX IF NOT EXISTS "Product_variant_id_idx" ON "Product"("variant_id");

-- ============================================================
-- 完成
-- ============================================================
SELECT 'V3.2 表结构迁移完成' AS status;
