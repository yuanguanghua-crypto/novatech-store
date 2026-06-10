# 多维筛选面板方案

## 背景与目标

产品列表页目前只有基础搜索和分类过滤。实验室玻璃仪器需要按多个技术维度筛选：容量、材质、壁厚、磨口类型、精度等级。当前筛选无法满足用户快速定位产品的需求。

目标：
1. 在产品列表页增加多维筛选面板
2. 筛选维度覆盖 V3.2 中所有结构化字段
3. 筛选条件通过 URL params 持久化，支持分享和 SEO
4. 响应式设计，桌面侧边栏/移动端底部抽屉

## 可选方案

### 方案 A：纯服务端筛选（URL params → API → SSR）

每次筛选条件变更时，通过 URL params 传到后端，后端构建 Prisma query，返回过滤后的结果。

**优点**：
- 天然支持 SEO（Google 索引带参数的 URL）
- 后端能利用数据库索引，大数据量性能好
- 与现有 `/api/v2/products` 架构一致

**缺点**：
- 每次筛选需要完整往返，交互卡顿
- 多个筛选条件快速切换时体验差
- 服务端渲染压力大

### 方案 B：客户端+URL 混合（推荐）

筛选数据在客户端本地过滤，同时通过 URL params 持久化状态。初始加载时走服务端，后续筛选在客户端完成。

**优点**：
- 交互流畅，实时响应
- URL params 支持分享和浏览器前进/后退
- 不增加服务端负担
- 筛选面板组件可独立开发和测试

**缺点**：
- 需要首次全量加载产品数据（104 条不算多，可行）
- 筛选逻辑在前端和维护两份

### 方案 C：服务端+客户端双层

首次加载走服务端渲染，后续筛选走客户端。筛选维度从数据库动态读取（容量范围、材质种类等）。

**优点**：
- 筛选选项动态生成（支持添加新 SKU 后自动出现新选项）
- 结合了 A 和 B 的优点

**缺点**：
- 实现复杂，需要维护两套筛选逻辑
- 104 条产品的规模下过度设计

## 推荐方案

**选择方案 B**，理由：

1. **数据量小**：当前 104 个变体，全量加载到客户端毫无压力
2. **交互优先**：实验室采购人员需要快速切换筛选条件对比产品，流畅的客户端交互比 SEO 更重要
3. **渐进升级**：方案 B 可以平滑升级到方案 C
4. **URL 持久化**：筛选条件通过 `useSearchParams` 同步到 URL，不影响分享

## 技术方案

### 筛选维度

| 维度 | 字段 | UI 组件 |
|------|------|---------|
| 容量 | `volume_ml` | 滑块 / 按钮组（50, 100, 250, 500, 1000, 2000, 5000） |
| 材质 | `material_family` | 复选框（Borosilicate, Soda-lime） |
| 壁厚 | `wall_type` | 复选框（Normal Wall, Heavy Wall） |
| 磨口类型 | `joint_type` | 复选框（24/40, 19/22, 14/20 等） |
| 磨口尺寸 | `joint_size` | 复选框（14, 19, 24, 29 等） |
| 精度等级 | `accuracy_class` | 复选框（Class A, Class B） |
| 价格区间 | `selling_price_usd` | 范围滑块 |

### 组件结构

```
components/store/
├── filter-panel/
│   ├── index.tsx            # 主面板（桌面 sidebar / 移动端 drawer）
│   ├── filter-checkbox.tsx   # 复选框筛选组
│   ├── filter-range.tsx      # 范围筛选（容量、价格）
│   ├── filter-pills.tsx      # 已选条件标签
│   └── use-product-filters.ts  # 筛选逻辑 hook
```

### 数据流

```
/products?volume=250,500&material=borosilicate
        │
        ▼
ProductsClient（读取 URL params）
        │
        ▼
useProductFilters（筛选逻辑）
  ├─ 全量 variant 数据（从 /api/v2/products 获取）
  ├─ 解析 URL params → 筛选条件
  ├─ 筛选 → 匹配结果
  └─ 用户操作 → 更新 URL params（触发重新筛选）
        │
        ▼
ProductGrid（渲染筛选结果）
```

### URL 格式

```
/products                           → 全部产品
/products?volume=250,500            → 250ml 或 500ml
/products?material=borosilicate     → 硼硅玻璃
/products?volume=250,500&material=borosilicate&wall=normal
```

## 影响范围

| 模块 | 影响 |
|------|------|
| `components/store/products-client.tsx` | 集成筛选面板 |
| `components/store/product-grid.tsx` | 接收筛选后的数据 |
| `components/store/` | 新增 filter-panel/ 目录 |
| `app/(store)/products/page.tsx` | 可能需要调整布局 |
| `app/api/v2/products/route.ts` | 无改动（全量加载） |

## 开放问题

1. 容量选择用滑块还是按钮组？滑块适合连续范围，按钮组适合离散值。实验室规格是离散的（50/100/250/500...），建议按钮组
2. 初始加载时是否全量加载所有 variant 数据？104 条可以，如果扩展到数千条需要分页
3. 移动端筛选面板用底部抽屉还是侧边栏覆盖？
