# Proposal: Import Glassware Data & Scaffold Data Model

## What & Why

### 背景

项目从旧的 Novatech 通用产品目录转型为自营实验室玻璃仪器，数据源已切换为 104 条 OEM 玻璃仪器数据（18 个产品族），旧的 `prisma.product` 模型已废弃。但目前的数据库里还没有这 104 条数据，前端也仍跑在旧模型上。

### 目标

1. 把 104 条玻璃仪器数据完整导入 V3.2 的四层数据模型
2. 同时落地两个附件文件中建议的「与数据导入直接相关」的部分——主要是 Schema 调整、分类结构更新、产品展示模式切换

### 涉及的范围

**本次包含：**

- Schema 变更：`ERPSKU` 表增加双仓库存字段（`stockHouston`, `stockChina`, `lowStockAlertHouston`, `lowStockAlertChina`）
- 数据清洗：Excel 中的 "None" 字符串→NULL、`Gross_Margin` 比值→百分比转换
- 数据导入：从 Excel 到 `SupplierMaster` → `SPU` → `ProductVariant` → `ERPSKU` 四层
- 分类结构调整：从旧 6 个分类（Basic Glassware/Analytical/...）改为产品类型分类
- 旧数据库记录清理：清除旧的 Product 表数据（或标记废弃）
- 产品列表页/详情页：切换数据源到 V3.2 表，按 SPU 聚合展示
- 详情页展示规格字段：volume_ml, material_family, wall_type, joint_type, accuracy_class 等
- 导入脚本：可复用的 `scripts/import-v32-glassware.js`
- `openspec/specs/` 初始基线：建立第一个域（beakers）的基线规范

**本次不包含（后续 change）：**

- 多维筛选面板（FilterPanel 组件）
- 产品对比（ComparePanel）
- 双仓前端展示（StockBadge、地址感知）
- 结账流程改造（Stripe / PO）
- 后台 SPU/Variant 管理界面
- SEO 结构化数据增强
- 知识库文章

## Scope

### In Scope

- Prisma schema 修改（ERPSKU 加字段，SPU/ProductVariant 微调）
- 数据清洗脚本（Python 或 Node.js）
- 数据导入脚本（Node.js）
- 种子数据：默认 SupplierMaster 记录
- 新分类体系（产品类型维度）落地
- 前端：产品详情页读取 V3.2 表，展示规格字段
- 前端：产品列表页按 SPU 聚合
- 旧数据清理

### Out of Scope

- 前端筛选面板
- 产品对比
- 结账流程
- 后台管理界面
- 多语言翻译更新
- Docker/AWS 部署配置

## Affected Modules

| 模块 | 影响 |
|------|------|
| `prisma/schema.prisma` | ERPSKU 加仓库字段 |
| `scripts/` | 新增 `import-v32-glassware.js` |
| `app/api/products/route.ts` | 切换数据源到 V3.2 表 |
| `app/(store)/products/[slug]/page.tsx` | 读取 SPU + ProductVariant |
| `components/store/product-detail-client.tsx` | 展示规格字段 |
| `components/store/product-grid.tsx` | 按 SPU 聚合 |
| `app/(store)/categories/` | 新分类体系 |
| `lib/catalog-filters.ts` | 适配 V3.2 字段 |
| `openspec/specs/` | 建立初始基线 |

## Estimated Complexity

- **Schema**: Small（加 4 个字段）
- **Data cleaning + import**: Medium（104 条，清洗逻辑清晰）
- **Frontend migration**: Medium（切换查询，不涉及新 UI 组件）
- **Category restructure**: Small
- **Total**: Medium

## Open Questions

1. 默认 SupplierMaster 名称用什么？（"Novatech Labware"？你的品牌名？）
2. 旧 Product 表的数据是删表还是标记 isActive=false？
3. 休斯顿仓和中国仓的初始库存数各是多少？
