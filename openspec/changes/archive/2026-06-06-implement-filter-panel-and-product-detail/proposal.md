# Proposal: 实现多维筛选面板 & 产品详情页改造

## 来源方案文档

- `docs/solutions/multi-dimensional-filter-panel.md`
- `docs/solutions/product-detail-page-upgrade.md`

## What & Why

### 背景

104 条玻璃仪器数据已导入 Supabase，V3.2 API 路由已就绪。但前端页面仍运行在旧的 `prisma.product` 数据模型上，没有利用 V3.2 的结构化字段（容量、材质、磨口等）。

### 本次变更内容

**Feature 1：多维筛选面板**
- 在产品列表页左侧增加多维筛选面板
- 支持按容量、材质、壁厚、磨口类型、精度等级、价格区间筛选
- 筛选条件通过 URL params 持久化（`/products?volume=250,500&material=borosilicate`）
- 本地客户端筛选（全量 104 条加载到前端）
- 响应式：桌面侧边栏，移动端底部抽屉

**Feature 2：产品详情页改造**
- 详情页数据源切换到 `/api/v2/products/[slug]`
- 增加 Variant 选择器（容量按钮组，切换后跳转对应 slug）
- 增加 SpecTable 结构化规格展示
- 增加 StockBadge 双仓库存展示
- 增加兄弟变体导航
- 适配 AddToCart / AddToQuote 按钮到 V3.2 variantId

## Scope

### In Scope

- `components/store/filter-panel/` — 筛选面板组件集（4 个组件 + 1 hook）
- `components/store/product-detail/` — 详情页组件集（5 个组件）
- `app/(store)/products/page.tsx` — 集成筛选面板
- `app/(store)/products/[slug]/page.tsx` — 切换到 V3.2 API
- `app/(store)/categories/[slug]/page.tsx` — 分类页也适配筛选
- `hooks/use-product-filters.ts` — 筛选逻辑 hook

### Out of Scope

- 产品图片管理（V3.2 当前没有图片字段）
- 移动端筛选面板的体验优化
- 产品对比功能（后续 change）
- 结账流程改造
- 旧 `product-detail-client.tsx` 的清理

## Affected Modules

| 模块 | 影响 |
|------|------|
| `components/store/` | 新增 2 个组件目录（~10 个文件） |
| `app/(store)/products/page.tsx` | 集成筛选面板 |
| `app/(store)/products/[slug]/page.tsx` | 切换数据源 |
| `app/(store)/categories/[slug]/page.tsx` | 适配筛选 |
| `hooks/` | 新增 `use-product-filters` |
| `components/store/add-to-cart-button.tsx` | 适配 V3.2 |
| `components/store/add-to-quote-button.tsx` | 适配 V3.2 |

## Estimated Complexity

- **Filter Panel**: Medium（4 个 UI 组件 + 1 hook + 筛选逻辑）
- **Product Detail**: Medium（5 个组件 + API 对接）
- **Integration**: Small（页面集成）
- **Total**: Medium

## Open Questions

1. 筛选面板的初始状态——是否在未选择任何筛选条件时折叠显示？
2. Variant 选择器跳转时是否保留当前页面滚动位置？
