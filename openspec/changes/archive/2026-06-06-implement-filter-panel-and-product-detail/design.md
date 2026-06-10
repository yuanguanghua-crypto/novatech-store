# Design: 多维筛选面板 & 产品详情页改造

## 1. Filter Panel — 架构

### Component Tree

```
products/page.tsx (Server Component)
  └─ ProductsClient (Client Component)
       ├─ FilterPanel
       │   ├─ FilterSection (容量: 按钮组)
       │   ├─ FilterSection (材质: 复选框)
       │   ├─ FilterSection (壁厚: 复选框)
       │   ├─ FilterSection (精度等级: 复选框)
       │   ├─ FilterSection (磨口类型: 复选框)
       │   ├─ FilterSection (价格: 范围滑块)
       │   └─ FilterPills (已选条件标签)
       ├─ SortSelector
       └─ ProductGrid (筛选后数据)
```

### Data Flow

```
1. 初始加载:
   ProductsClient 在 mount 时 fetch /api/v2/products
   → 得到所有 SPU + 所有 variant 数据
   → 保存在客户端 state 中

2. URL 解析:
   useSearchParams() 读取 volume, material, wall 等参数
   → 构建筛选条件对象
   → 传入 useProductFilters hook

3. 筛选逻辑 (useProductFilters):
   const filtered = useMemo(() => {
     return allVariants.filter(v => {
       const volumeMatch = !selectedVolume || selectedVolume.includes(v.volumeMl)
       const materialMatch = !selectedMaterial || selectedMaterial.includes(v.materialFamily)
       // ... 其他维度
       return volumeMatch && materialMatch && ...
     })
   }, [allVariants, selectedVolume, selectedMaterial, ...])

4. 用户操作:
   FilterPanel 中的 onChange → router.push() 更新 URL
   → 触发 useSearchParams 更新
   → 触发 useMemo 重新计算
   → ProductGrid 重新渲染
```

### Filter API Route (读取所有 variant 用于筛选)

Since `/api/v2/products` returns SPU-aggregated data (not individual variants), we need a lightweight endpoint for filter data:

```typescript
// GET /api/v2/filters
// Returns all unique filter values grouped by dimension
{
  "volume": [50, 100, 250, 500, 1000, 2000, 5000],
  "materialFamily": ["Borosilicate"],
  "wallType": ["Normal Wall"],
  "accuracyClass": ["Class A", "Class B"],
  "jointType": ["24/40", "19/22", "14/20"],
  "jointSize": ["14", "19", "24", "29"],
  "priceRange": { "min": 4.9, "max": 179 }
}
```

Or simpler: return ALL variants with just the fields needed for filtering.

```typescript
// GET /api/v2/variants
// Returns flat list of variants with filter-relevant fields
```

### Filter State Management

```typescript
// hooks/use-product-filters.ts
interface FilterState {
  volume?: number[]
  material?: string[]
  wallType?: string[]
  accuracyClass?: string[]
  jointType?: string[]
  jointSize?: string[]
  priceRange?: { min: number; max: number }
}

function useProductFilters(allVariants: Variant[]) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse URL → FilterState
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  // Apply filters → filtered variants
  const filtered = useMemo(() => applyFilters(allVariants, filters), [allVariants, filters])

  // Update URL
  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return { filters, filtered, setFilter, clearFilters }
}
```

### 筛选面板 UI 布局

```
Desktop (≥768px):                          Mobile (<768px):
┌──────────────────────────────────┐       ┌──────────────────┐
│ Products        Sort ▼           │       │ [☰ Filters]  35 │
│ ┌──────┬────────────────┐       │       │ ┌────────────────┐│
│ │Filter│ Product Grid   │       │       │ │ Product Grid   ││
│ │Panel │ ┌──┬──┬──┐     │       │       │ │ ┌──┬──┬──┐     ││
│ │       │ │P1│P2│P3│     │       │       │ │ │P1│P2│P3│     ││
│ │Volume │ └──┴──┴──┘     │       │       │ │ └──┴──┴──┘     ││
│ │[50]   │                │       │       │ └────────────────┘│
│ │[100]  │                │       │       └──────────────────┘
│ │[250]  │                │       │
│ └──────┴────────────────┘       │
│ 共 35 个产品                       │          ↓ 点击筛选
└──────────────────────────────────┘       ┌─────────────┐
                                           │ 筛选        │
                                           │ Volume [50] │
                                           │ [100] [250] │
                                           │ Material    │
                                           │ ☑ Borosil.  │
                                           │ [应用 (35)] │
                                           └─────────────┘
```

## 2. Product Detail — 架构

### Component Tree

```
products/[slug]/page.tsx (Server Component)
  ├─ fetch /api/v2/products/[slug]
  ├─ generateMetadata (SEO)
  └─ ProductDetailClient (Client Component)
       ├─ Breadcrumb (分类路径)
       ├─ ProductInfo
       │   ├─ ProductName
       │   ├─ VariantSelector (容量按钮组)
       │   ├─ PriceDisplay
       │   └─ StockBadge
       ├─ SpecTable
       ├─ ActionButtons (AddToCart + AddToQuote)
       ├─ SiblingNav (同类产品)
       └─ ProductFAQ (SEO)
```

### Data Flow

```typescript
// page.tsx (Server Component)
async function ProductPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`https://.../api/v2/products/${params.slug}`)
  const data = await res.json()

  if (!data.variant) return notFound()

  return <ProductDetailClient data={data} />
}

// ProductDetailClient
function ProductDetailClient({ data }: { data: ProductDetailData }) {
  const [selectedVariant, setSelectedVariant] = useState(data.variant)

  // Navigate to sibling
  const handleVariantChange = (slug: string) => {
    router.push(`/products/${slug}`)
  }

  return (
    <>
      <VariantSelector
        variants={data.siblingVariants}
        current={data.variant}
        onChange={handleVariantChange}
      />
      <SpecTable specs={data.variant.specs} />
      <StockBadge houston={data.variant.stockHouston} china={data.variant.stockChina} />
    </>
  )
}
```

### Variant Selector Design

```
容量选择:
┌──────────────────────────────────────────────┐
│  [50ml]  [100ml]  [250ml]  [500ml]           │
│  [1000ml] [2000ml] [5000ml]                  │
│  当前: 250ml  ✓                               │
│  价格: $7.90                                   │
└──────────────────────────────────────────────┘
```

Implementation:
- `siblingVariants` grouped by `volumeMl`
- Current variant has highlighted/disabled button
- Clicking a different variant → `router.push(newSlug)`
- New page loads with the new variant data

### SpecTable Design

```typescript
// spec-table.tsx
// Receive: specs: { label: string, value: string }[]
// Render as two-column table
function SpecTable({ specs }: { specs: Spec[] }) {
  if (!specs.length) return null
  return (
    <table className="...">
      <tbody>
        {specs.map(s => (
          <tr key={s.label}>
            <td className="...">{s.label}</td>
            <td className="...">{s.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### 双仓库存显示

```typescript
function StockBadge({ houston, china }: { houston: number; china: number }) {
  const shipFrom = (houston > 0 && china > 0)
    ? 'Both'
    : houston > 0 ? 'Houston' : 'China'

  return (
    <div>
      <div>休斯顿: {houston > 0 ? '✓ 有货' : '缺货'}</div>
      <div>中国仓: {china > 0 ? '✓ 有货' : '缺货'}</div>
      {houston === 0 && china === 0 && <div>请联系客服确认交期</div>}
    </div>
  )
}
```

## 3. 新增 API 路由

### GET /api/v2/variants

Returns flat list of variant data for the filter panel:

```typescript
// Returns only filter-relevant fields for all active variants
[
  {
    "variantId": "GF-LF-50-NW-B33-CL",
    "spuId": "GF-LF",
    "volumeMl": 50,
    "materialFamily": "Borosilicate",
    "wallType": "Normal Wall",
    "accuracyClass": null,
    "jointType": null,
    "jointSize": null,
    "sellingPriceUsd": 4.90,
    "categorySlug": "beakers"
  }
  // ... 104 variants
]
```

## 4. Implementation Order

```
Phase 1: API + Data Layer
  ├─ Create /api/v2/variants route (flat data for filter)
  └─ Update ProductsClient to fetch V3.2 data

Phase 2: Filter Panel Components
  ├─ Create useProductFilters hook
  ├─ Create FilterSection component
  ├─ Create FilterPills component
  ├─ Create FilterPanel container
  └─ Integrate into ProductsClient

Phase 3: Product Detail Components
  ├─ Create VariantSelector
  ├─ Create SpecTable
  ├─ Create StockBadge
  ├─ Create SiblingNav
  ├─ Update ProductDetailClient
  └─ Update page.tsx to fetch V3.2

Phase 4: Adapt AddToCart/AddToQuote
  └─ Update button components for V3.2 IDs

Phase 5: Verify
  ├─ Test filter: volume+material+wall
  ├─ Test variant switching
  └─ Test edge cases (empty results, 404)
```

## 5. Rollback Plan

- **Filter Panel**: The ProductsClient can fall back to old behavior if the `/api/v2/variants` route fails
- **Product Detail**: Old `product-detail-client.tsx` is preserved until Phase 5
- **Data Layer**: `/api/v2/` routes exist alongside old routes - no breaking changes
