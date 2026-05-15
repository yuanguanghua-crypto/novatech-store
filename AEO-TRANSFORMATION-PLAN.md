# LABPRO 网站 AEO 改造方案

> 制定时间：2026-04-28
> 网站地址：https://novatech-store-inky.vercel.app
> 代码仓库：E:\novatech-store

---

## 一、改造背景与目标

**什么是 AEO？**
AEO（Answer Engine Optimization，答案引擎优化）是 SEO 的进化形态。传统 SEO 优化 Google/百度排名，AEO 优化 AI 引用率——让 AI（如 ChatGPT、Perplexity、豆包）在回答用户问题时直接引用你的产品/内容作为可信来源。

**核心指标变化：**
| 指标 | 改造前 | 改造后（预期） |
|------|--------|----------------|
| FAQ Schema 覆盖率 | 0% | 100% 产品页 |
| AI 引用率 | 极低 | +60% |
| 知识页数量 | 0 | 10+ |
| 结构化数据完善度 | 仅基础 sitemap | 完整 Product+FAQ Schema |

---

## 二、现有结构分析

```
当前网站结构：
├── /products              ← 纯产品列表，无解释层
├── /products/[slug]       ← 无 FAQ、无 Schema
├── /categories            ← 列表页，无语义内容
├── /brands                ← 列表页，无品牌解释
├── /quote                 ← 纯表单，无知识内容
├── /sitemap.xml           ← 已有，优先权待优化
└── Schema                 ← 仅有基础 sitemap，无 JSON-LD
```

---

## 三、改造方案（分优先级）

### 🔴 P0 - 必须完成（否则 AEO 无效）

#### 1. /products 增加"解释层"

**现状：** 只是产品列表，AI 无法理解这是什么类型的网站。

**改造方案：**
在产品列表页上方增加 H1/H2 语义区块：

```tsx
// app/(store)/products/page.tsx 改造
export default async function ProductsPage() {
  return (
    <>
      {/* AEO 解释层 - 让 AI 理解网站定位 */}
      <section className="container py-12 bg-white border-b">
        <h1 className="text-3xl font-bold mb-6">
          工业检测与实验室设备产品中心
        </h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">我们提供哪些设备？</h2>
            <p className="text-gray-600">
              LABPRO 提供超过 15,000 种工业检测与实验室仪器，
              涵盖 pH 计、电导率仪、计量泵、浊度仪等，应用于水处理、
              制药、环保、食品饮料等领域。
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">如何选择合适的检测仪器？</h2>
            <p className="text-gray-600">
              根据测量参数（pH/ORP/电导率）、精度要求、接口类型
              和安装方式筛选。我们提供 LMI、Pulsafeeder、
              Lovibond 等全球知名品牌，规格透明，报价快速响应。
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">不同品牌差异说明</h2>
            <p className="text-gray-600">
              LMI 以计量泵闻名，Pulsafeeder 专注工业隔膜泵，
              Lovibond 提供专业水质分析。我们的品牌组合覆盖从
              基础实验到工业级全场景。
            </p>
          </div>
        </div>
      </section>
      {/* 原有产品列表 */}
      <ProductsClient ... />
    </>
  )
}
```

---

#### 2. 产品页 FAQ 组件（核心！）

**现状：** 产品页只有规格和图片，无问答结构。

**改造方案：**
创建 `components/store/product-faq.tsx`，基于产品分类/品牌自动生成 FAQ：

```tsx
// 产品 FAQ 模板（按品牌/分类动态生成）
const generateProductFAQs = (product: Product) => {
  const category = product.category?.name || ''
  const brand = product.brand?.name || ''
  const name = product.name || ''
  const specs = product.specs as Record<string, string> || {}

  return [
    {
      question: `${name} 主要用于什么应用场景？`,
      answer: `${name} 是 ${brand || 'LABPRO'} 品牌的 ${category}，
        广泛应用于工业水处理、实验室分析、环境监测等领域。
        具体参数：${Object.entries(specs).slice(0,3).map(([k,v])=>`${k}: ${v}`).join('；')}`
    },
    {
      question: `${name} 的测量精度是多少？`,
      answer: specs['Accuracy'] || specs['精度'] || specs['Range'] ||
        '请参考规格表中的详细参数。如需高精度型号对比，请联系我们的技术支持团队。'
    },
    {
      question: `${name} 是否支持工业环境使用？`,
      answer: `${brand || 'LABPRO'} 设备支持工业级应用，
        典型防护等级 IP65 及以上，工作温度范围 -10°C 至 60°C。
        详细环境参数请见规格表。`
    },
    {
      question: `${name} 与同品牌其他型号有什么区别？`,
      answer: `${name} 的核心差异在于 ${Object.keys(specs).slice(0,2).join('和')}。
        如需完整选型对比，请浏览我们的 ${category} 分类页面或联系销售团队。`
    },
    {
      question: `${name} 的交货周期和保修政策是什么？`,
      answer: '标准产品通常有现货，交付周期 3-7 个工作日。
        定制或大额订单可能需要 2-4 周。所有设备享有标准保修期，
        详情请查看我们的保修政策或咨询客服。'
    }
  ]
}
```

---

#### 3. Product + FAQ JSON-LD Schema（必须！）

**现状：** 无任何结构化数据。

**改造方案：** 在 `app/(store)/products/[slug]/page.tsx` 增加：

```tsx
// app/(store)/products/[slug]/page.tsx
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  if (!product) notFound()
  const related = await getRelatedProducts(product.categoryId, product.id)

  // 生成 JSON-LD Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'LABPRO'
    },
    image: product.images[0]?.url,
    offers: {
      '@type': 'Offer',
      price: product.ourPrice,
      priceCurrency: 'USD',
      availability: product.availability === 'in_stock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '126'
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: generateProductFAQs(product).map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  )
}
```

---

### 🟠 P1 - 显著提升 AI 引用率

#### 4. 新增 3 类 AI 高引用知识页

基于 LABPRO 的行业特性（工业检测/实验室设备），创建：

**类型 A - /what-is-[category] "是什么"页**
```
/what-is-ph-meter
/what-is-dosing-pump
/what-is-tds-meter
/what-is-conductivity-meter
```
结构：定义 → 工作原理 → 应用场景 → 选型要点 → 相关产品

**类型 B - /how-to-choose-[category] "如何选"页**
```
/how-to-choose-dosing-pump
/how-to-choose-ph-sensor
/how-to-calibrate-conductivity-meter
```
结构：选型 5 步法 → 关键参数 → 品牌对比 → FAQ

**类型 C - /[a]-vs-[b] "对比"页**
```
/ph-meter-vs-orp-meter
/digital-vs-analog-ph-meter
/pulsafeeder-vs-lmi-pump
```
结构：共同点 → 差异对比表 → 选型建议 → FAQ

**技术实现：**
```tsx
// app/(store)/knowledge/[type]/[slug]/page.tsx
// 使用 generateStaticParams 预生成关键页
// 动态内容基于数据库中的 category/brand 数据
```

---

#### 5. /brands 语义增强

**现状：** 品牌列表，无品牌故事。

**改造方案：** 每个品牌增加：
- 品牌历史与成立时间
- 核心产品线
- 技术优势
- 典型应用场景

```tsx
// 品牌语义增强示例 - app/components/store/brands-client.tsx
const brandProfiles = {
  'lmi': {
    founded: '1979年成立于美国',
    specialty: '电磁计量泵与附件',
    advantage: '高精度、低维护、工业级耐用性',
    applications: '水处理、废水管理、化学品投加',
    heroProduct: 'LMI B395SI-3 电磁计量泵'
  },
  'pulsafeeder': {
    founded: '1946年成立于美国',
    specialty: '隔膜泵、齿轮泵、螺杆泵',
    advantage: '高压能力、多材质选择、FDA认证型号',
    applications: '石油化工、制药、食品饮料',
    heroProduct: 'Pulsafeeder ID 系列隔膜泵'
  },
  // ... 其他品牌
}
```

---

#### 6. /categories 语义增强

**现状：** 分类列表，无应用说明。

**改造方案：** 每个分类增加：
- 分类定义与用途
- 选型关键参数
- 典型用户行业
- 热门品牌

```tsx
const categoryProfiles = {
  'ph-controllers': {
    definition: 'pH控制器用于工业水处理中的酸碱度自动调节',
    keyParams: ['测量范围', '控制精度', '输出类型', '防护等级'],
    industries: ['水处理厂', '制药', '食品饮料', '化工'],
    topBrands: ['LMI', 'Pulsafeeder', 'GF+'],
    selectionTip: '根据控制精度要求（±0.01pH vs ±0.1pH）选择型号'
  },
  // ... 其他分类
}
```

---

### 🟡 P2 - 增强 AI 权重信号

#### 7. /quote 页面知识化升级

**现状：** 纯询价表单，缺少信任内容和流程说明。

**改造方案：**
```tsx
// app/(store)/quote/page.tsx 增加以下区块
<section className="mb-12">
  <h2 className="text-2xl font-bold mb-4">什么情况下需要报价？</h2>
  <ul>
    <li>批量采购（10台以上）享受批量折扣</li>
    <li>工业级项目配套需要规格确认</li>
    <li>需要定制接口或参数的特殊配置</li>
    <li>跨境采购需要出口文件和货运报价</li>
  </ul>
</section>

<section className="mb-12">
  <h2 className="text-2xl font-bold mb-4">报价流程</h2>
  <ol>
    <li>提交询价表单（选择产品、填写数量）</li>
    <li>我们的销售团队将在 24 小时内回复</li>
    <li>确认规格和价格后出具正式报价单</li>
    <li>报价单有效期 30 天</li>
  </ol>
</section>

<section className="mb-12">
  <h2 className="text-2xl font-bold mb-4">交付周期参考</h2>
  <table>
    <tr><td>标准产品（库存）</td><td>3-7 个工作日</td></tr>
    <tr><td>品牌产品（需调货）</td><td>1-3 周</td></tr>
    <tr><td>大额/定制订单</td><td>2-4 周</td></tr>
  </table>
</section>
```

---

## 四、Schema 优先级与实现顺序

```
优先级 1: FAQPage Schema
  ↓ 每个产品页必须，AI 引用最核心的结构
优先级 2: Product Schema
  ↓ 完整的产品信息结构化
优先级 3: BreadcrumbList Schema
  ↓ 增强内容层级理解
优先级 4: Organization Schema
  ↓ 公司信任背书
优先级 5: HowTo Schema (知识页)
  ↓ 选型指南页面专用
```

---

## 五、Sitemap 更新计划

改造后 sitemap.xml 需要更新：

```ts
// app/sitemap.ts 增加知识页
{
  url: `${BASE_URL}/what-is-ph-meter`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.7,
},
{
  url: `${BASE_URL}/how-to-choose-dosing-pump`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.7,
},
// ... 所有知识页
```

---

## 六、实施步骤

### Step 1：P0 核心层（第 1-2 周）
- [ ] 1.1 修改 `/products/page.tsx`，增加 H1/H2 解释层
- [ ] 1.2 创建 `components/store/product-faq.tsx` FAQ 组件
- [ ] 1.3 创建 `components/store/product-schema.tsx` Schema 生成器
- [ ] 1.4 修改 `app/(store)/products/[slug]/page.tsx`，集成 FAQ + Schema
- [ ] 1.5 在 7 语言翻译文件中添加 FAQ 相关翻译键
- [ ] 1.6 测试验证：使用 Google Rich Results Test 检查 Schema

### Step 2：P1 知识层（第 3-4 周）
- [ ] 2.1 创建知识页基础组件 `app/(store)/knowledge/[type]/[slug]/page.tsx`
- [ ] 2.2 为主要分类（LMI/Pulsafeeder/pH计/计量泵）生成 What-is 页面
- [ ] 2.3 为主要分类生成 How-to-choose 页面
- [ ] 2.4 创建 3-5 个 Compare 页面
- [ ] 2.5 增强 `brands-client.tsx` 添加品牌语义内容
- [ ] 2.6 增强 `categories-client.tsx` 添加分类语义内容
- [ ] 2.7 更新 sitemap.ts 收录所有知识页

### Step 3：P2 信任层（第 5 周）
- [ ] 3.1 重构 `/quote/page.tsx`，增加知识内容区块
- [ ] 3.2 完善 /support 和 /about 页面（公司信任背书）
- [ ] 3.3 添加 Organization Schema
- [ ] 3.4 添加 BreadcrumbList Schema 到产品页
- [ ] 3.5 验证测试

### Step 4：验证与上线（第 6 周）
- [ ] 4.1 Google Rich Results Test 验证所有产品页 Schema
- [ ] 4.2 Schema 验证工具检查 FAQPage、Product Schema
- [ ] 4.3 AI 引用测试：测试 Perplexity/ChatGPT 引用情况
- [ ] 4.4 提交 GitHub → Vercel 自动部署
- [ ] 4.5 提交 Google Search Console 更新

---

## 七、关键技术细节

### FAQ Schema 结构
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "这个设备用于什么？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "..."
    }
  }]
}
```

### Product Schema 结构
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "LMI LE-368NI...",
  "sku": "LE368NI",
  "brand": { "@type": "Brand", "name": "LMI" },
  "offers": {
    "@type": "Offer",
    "price": "650.00",
    "priceCurrency": "USD"
  }
}
```

### 多语言支持
所有 AI 生成内容需要支持 7 种语言：
- 英文 (en) - 基础语言
- 中文 (zh) - 主要目标市场
- 西班牙语 (es) - 南美市场
- 日语 (ja) - 日本市场
- 印地语 (hi) - 印度市场
- 阿拉伯语 (ar) - 中东市场
- 葡萄牙语 (pt) - 巴西市场

---

## 八、风险与注意事项

1. **Schema 冲突**：避免在同一页面重复输出相同的 JSON-LD 类型
2. **内容质量**：AI 生成的 FAQ 内容需要人工审核，确保准确
3. **性能影响**：JSON-LD 脚本应放在 `<head>` 或组件顶部，不影响 LCP
4. **维护成本**：知识页内容需要随产品更新而同步维护
5. **版权风险**：品牌对比内容需客观，避免贬低竞争品牌

---

## 九、改造清单（快速执行版）

### 必做（1天内完成 P0）
1. `products/page.tsx` 加解释层 H1/H2
2. `components/store/product-faq.tsx` 新建 FAQ 组件
3. `products/[slug]/page.tsx` 加 JSON-LD Schema
4. 更新 7 语言翻译文件

### 建议做（3-5天完成 P1）
5. 创建 10+ 知识页
6. 品牌/分类语义增强
7. sitemap 更新

### 可选（P2，1周）
8. /quote 知识化
9. 信任背书内容
10. 深度测试验证
