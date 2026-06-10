# Product Detail Page Specifications

## PD-1: 数据源切换

**Given** 用户访问 `/products/<slug>`（其中 slug 对应 V3.2 数据）
**When** 页面加载
**Then** 数据从 `/api/v2/products/[slug]` 获取
**And** 页面展示对应的 ProductVariant 信息
**And** 不读取旧的 `prisma.product` 表

## PD-2: SPU 信息展示

**Given** 用户在产品详情页
**When** 页面加载完成
**Then** 页头显示 SPU（产品族）名称
**And** 显示 SPU 的 category（如 "Beakers > Griffin Beaker"）
**And** 显示当前变体的完整名称（variantName）

## PD-3: Variant 选择器（容量切换）

**Given** 用户在产品详情页，当前显示 250ml Griffin Beaker
**When** 用户看到容量选择器
**Then** 选择器显示该 SPU 下所有可用容量：50ml / 100ml / 250ml / 500ml
**And** 当前容量（250ml）标记为选中状态
**When** 用户点击"500ml"
**Then** 页面跳转到 `/products/<500ml-variant-slug>`

## PD-4: SpecTable 规格展示

**Given** 用户在产品详情页
**When** 页面加载完成
**Then** 显示技术规格表格，包含所有非空字段：

| 规格 | 值 |
|------|-----|
| 容量 | 250 ml |
| 材质 | Borosilicate 3.3 |
| 壁厚 | Normal Wall |
| 颜色 | Clear |
| 磨口类型 | (如果有) |
| 精度等级 | (如果有) |

**And** 空字段不显示在表格中

## PD-5: 双仓库存展示

**Given** 用户在产品详情页
**When** 页面加载完成
**Then** 显示：

```
库存状态：
  Houston: ✓ 库（500 件）
  China:   ✓ 库（500 件）
```

**And** 如果 Houston 库存 = 0，显示"休斯顿缺货，预计从中国发货"
**And** 如果两个仓库都缺货，显示"请联系客服确认交期"

## PD-6: 兄弟变体导航

**Given** 用户在产品详情页
**When** 页面加载完成
**Then** 显示"同类产品"区域，列出同 SPU 下的其他变体
**And** 每个兄弟变体显示：容量、价格
**And** 当前变体标记为"当前规格"
**When** 用户点击兄弟变体
**Then** 跳转到对应变体的详情页

## PD-7: 价格展示

**Given** 用户在产品详情页
**When** 页面加载完成
**Then** 显示当前选中变体的价格（`variant.sellingPriceUsd`）
**And** 如果购买了超过 5 件，提示"批量采购请联系客服获取报价"

## PD-8: AddToCart / AddToQuote 适配

**Given** 用户在产品详情页选中了一个变体
**When** 用户点击"加入购物车"
**Then** 购物车记录使用 V3.2 的 `variantId` 和 `erpSku`
**And** 购物车项包含：名称、SKU、价格、数量
**When** 用户点击"询价"
**Then** 询价单使用同样的 V3.2 标识

## PD-9: 深度链接

**Given** 搜索引擎或外部链接指向 `/products/<slug>`
**When** 页面加载
**Then** 使用 slug 找到对应的 ProductVariant
**And** 如果 slug 不存在，返回 404 页面
