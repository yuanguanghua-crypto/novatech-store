# 产品详情页改造方案

## 背景与目标

产品详情页目前基于旧的 `prisma.product` 模型，展示的是扁平的商品信息。新的 V3.2 数据模型采用 SPU → ProductVariant 两层结构，一个产品族（如 Griffin Beaker）下有多个规格变体（50ml、100ml、250ml...）。

当前问题：
1. 详情页直接读取 `prisma.product`（旧模型已废弃）
2. 没有 Variant 选择器，无法切换规格
3. 技术规格字段（容量、材质、磨口等）没有以结构化方式展示
4. 没有双仓库存信息
5. 没有兄弟变体导航

目标：
1. 切换到 V3.2 数据（SPU + ProductVariant）
2. 增加 Variant 选择器（按容量、材质等切换）
3. 结构化规格展示（SpecTable 组件）
4. 双仓库存展示（Houston / China）
5. 兄弟变体导航（同 SPU 下的其他规格）
6. 询价/加购按钮适配新模型

## 可选方案

### 方案 A：直接使用 `/api/v2/products/[slug]`（推荐）

利用已存在的 V2 API 路由，前端组件直接对接新 API。

**优点**：
- API 已存在，零后端改动
- 返回的数据已经包含了兄弟变体、规格字段、库存信息
- 切换成本最低

**缺点**：
- API 返回格式固定，前端需要适配
- 如果后续需要调整接口格式，需要改 API

### 方案 B：重写旧 API 路由

把旧的 `/api/products/[slug]` 改为查询 V3.2 表。

**优点**：
- 前端代码改动最小（接口路径不变）
- 旧的前端组件可以复用

**缺点**：
- 需要修改后端代码
- 旧的 API 路由引用旧模型，改起来牵涉面广
- 不如直接废弃旧路由，用新路由

### 方案 C：新建 GraphQL 端点

为详情页建立灵活的 GraphQL 查询端点。

**优点**：
- 前端可自定义返回字段
- 扩展性好

**缺点**：
- 需要引入 GraphQL 依赖和运行时
- 104 条产品的场景过度设计
- 学习成本高

## 推荐方案

**选择方案 A**，理由：

1. **零后端改动**：`/api/v2/products/[slug]` 已返回完整数据
2. **风险最低**：不需要改 schema、API、数据库
3. **渐进式替换**：新详情页和旧详情页可以共存，逐个切换
4. **数据对齐**：现有 API 返回的字段已经包含了详情页需要的所有信息

## 技术方案

### 组件结构

```
components/store/
├── product-detail/
│   ├── index.tsx             # 主容器（SPU 信息 + Variant 选择 + 规格展示）
│   ├── variant-selector.tsx   # 规格选择器（容量按钮组）
│   ├── spec-table.tsx         # 技术规格表格
│   ├── stock-badge.tsx        # 双仓库存徽标
│   ├── sibling-nav.tsx        # 兄弟变体导航
│   └── price-display.tsx      # 价格展示（含批量提示）
```

### 数据流

```
用户访问 /products/<slug>
        │
        ▼
ProductDetailPage（Server Component）
        │  fetch /api/v2/products/[slug]
        ▼
返回数据：
├─ variant: 当前变体详情（含 specs[], stockHouston, stockChina）
├─ spu: 产品族信息（名称、分类）
└─ siblingVariants: 同 SPU 的其他变体
        │
        ▼
Client Components：
├─ variant-selector（从 siblingVariants 生成按钮组）
├─ spec-table（从 variant.specs 生成表格）
├─ stock-badge（从 variant.stockHouston/stockChina 生成）
└─ price-display（显示当前选中变体的价格）
```

### 页面布局

```
┌──────────────────────────────────────────────────┐
│  Griffin Beaker (SPU 名称)                        │
│  Borosilicate 3.3 | Normal Wall                  │
│                                                  │
│  ┌─────────────┐   容量选择：[50ml] [100] [250]   │
│  │  产品图片    │   [500] [1000] [2000] [5000]    │
│  │             │                                  │
│  │             │   价格: $7.90                     │
│  └─────────────└  库存: Houston ✓ (1200)          │
│                         China ✓ (3000)            │
│                                                  │
│  技术规格                                          │
│  ├ 容量        250ml                              │
│  ├ 材质        Borosilicate 3.3                  │
│  ├ 壁厚        Normal Wall                        │
│  ├ 颜色        Clear                              │
│  ├ 高度        125 mm                             │
│  └ 标准        ASTM E438                          │
│                                                  │
│  同类产品                                          │
│  [50ml] [100ml] [250ml] [500ml] [1000ml] ...      │
│                                                  │
│  [加入购物车]  [询价]                              │
└──────────────────────────────────────────────────┘
```

### Variant 选择逻辑

```typescript
// 从 siblingVariants 中提取可选的容量
const volumeOptions = siblingVariants
  .filter(v => v.volumeMl)
  .map(v => ({ volume: v.volumeMl, slug: v.slug }))
  .sort((a, b) => a.volume - b.volume)

// 用户选择容量 → 跳转到对应的 variant slug
// router.push(`/products/${selectedSlug}`)
```

## 影响范围

| 模块 | 影响 |
|------|------|
| `app/(store)/products/[slug]/page.tsx` | 改为读取 `/api/v2/products/[slug]` |
| `components/store/product-detail-client.tsx` | 重构，集成新组件 |
| `components/store/` | 新增 `product-detail/` 目录（5 个组件） |
| `components/store/add-to-cart-button.tsx` | 适配 V3.2 的 variantId |
| `components/store/add-to-quote-button.tsx` | 适配 V3.2 的 variantId |
| `app/(store)/products/page.tsx` | 无改动 |
| `app/api/v2/products/[slug]/route.ts` | 无改动（API 已就绪） |

## 开放问题

1. Variant 选择后直接跳转新 URL 还是用状态切换？跳转 URL 更符合 Next.js 路由设计，也支持 SEO
2. 旧详情页的 `product-detail-client.tsx` 是否保留给旧路由用？建议保留，直到旧数据彻底清理
3. 产品图片如何处理？当前 V3.2 数据没有图片字段，详情页需要占位
