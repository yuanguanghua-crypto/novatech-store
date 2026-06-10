# CODEX — Novatech Labware Store 项目指令文件

> 此文件是 Codex 在开发本项目时必须遵守的规则和约定。
> 所有代码变更、架构决策、数据操作应在执行前参考此文件。

---

## 项目身份

- **项目名称**：Novatech Labware Store（内部代号：labpro-store）
- **业务定位**：面向美国生化实验室的玻璃仪器跨境电商平台
- **核心产品**：实验室玻璃器皿（烧杯、烧瓶、冷凝管、量筒、漏斗、适配器、蒸馏/过滤套件等）
- **目标用户**：实验室科研人员、采购专员、机构采购
- **供应模式**：中国 OEM 生产 → 美国休斯顿仓 + 中国仓双仓发货
- **数据源**：V3.2 玻璃仪器产品数据（当前 18 个产品族，104 个 SKU），逐步扩展

---

## 技术栈（强制）

| 层 | 技术 | 说明 |
|---|---|---|
| 框架 | Next.js 14 (App Router) + TypeScript | 严格模式 |
| 样式 | Tailwind CSS + Radix UI / shadcn/ui | 使用 `lab-` 和 `brand-` 设计令牌 |
| 数据库 | PostgreSQL + Prisma ORM | 仅使用 V3.2 模型 |
| 认证 | NextAuth.js | Google OAuth + Email/Password |
| 状态管理 | Zustand + persist | 购物车、询价单 |
| 支付 | Stripe | 信用卡支付 |
| 动画 | Framer Motion | 页面过渡、微交互 |
| 国际化 | lib/i18n/ | 7 种语言（en/zh/es/ja/hi/ar/pt） |
| 图标 | Lucide React | 统一图标库 |
| 测试 | Playwright | E2E 测试 |
| 部署 | AWS ECS Fargate + RDS + S3 + CloudFront | CI/CD via GitHub Actions |

---

## 数据模型规则

### 核心架构：V3.2 PIM/MDM 四层

项目使用 V3.2 数据架构作为唯一产品数据模型：

```
SupplierMaster (L0) → SPU (L1) → ProductVariant (L2) → ERPSKU (L3)
```

### 禁止使用的旧模型

**❌ `prisma.product`** — 旧 Novatech 导入数据已不再使用。所有新功能禁止读写此表。
**✅ `prisma.spu`** — 产品族，前端列表页按 SPU 聚合展示。
**✅ `prisma.productVariant`** — 核心规格实体，包含容量/材质/壁厚/磨口等结构化字段。
**✅ `prisma.eRPSKU`** — SKU 映射，含库存、业务编码。
**✅ `prisma.supplierMaster`** — 中国 OEM 供应商主表。

### 双仓库存

`ERPSKU` 表需要包含以下字段：
- `stockHouston Int @default(0)` — 休斯顿仓库存
- `stockChina Int @default(0)` — 中国仓库存
- `lowStockAlertHouston Int @default(0)` — 休斯顿低库存预警
- `lowStockAlertChina Int @default(0)` — 中国仓低库存预警

### 产品查询原则

1. 前端产品列表 → 查 `SPU`，展示产品族信息
2. 前端产品详情 → 查 `ProductVariant` + `SPU` join，展示规格
3. 前端规格筛选（容量/材质/磨口等） → 基于 `ProductVariant` 字段过滤
4. SKU 搜索 → 查 `ERPSKU.erpSku` 或 `ERPSKU.businessSku`
5. 分类导航 → 基于 `SPU.categoryL1`（产品类型维度）

---

## 业务规则

### 定价逻辑

| 场景 | 处理方式 |
|---|---|
| 小额订单（≤5 件、美国地址） | 自动计算基础价格 + 运费 + 包装 → 直接下单 |
| 大额订单（≥6 件或国际地址） | 走 Quote 流程 → 人工核算运费/包装 → 最终报价 |
| 批量定价 | 按数量段阶梯定价（1-5 / 6-20 / 21-100 / 100+） |
| 货币 | 统一以 USD 计价，中国采购价记录 RMB 汇率 |

### 发货规则

- 美国地址 → 休斯顿仓发货
- 非美国地址 → 中国仓发货
- 系统自动根据客户收货地址判断发货仓
- 运费模板按重量 / 体积 / 目的地计算

### 库存管理

- 休斯顿库存低于预警值 → 自动触发从中国仓补货提醒
- 产品页面展示发货仓信息（"Ships from Houston" / "Ships from China"）
- 库存不足时引导用户进入 Quote 流程

---

## 前端规则

### 产品展示模式

```
列表页：按 SPU 聚合展示（一个产品族显示为一个条目）
        ↓ 点击进入
详情页：SPU 描述 + Variant 规格选择器（容量/材质等）
        ↓ 选择具体规格
显示：选中的 Variant 价格 + 双仓库存 + 加入购物车/询价
```

### 分类结构（三维交叉导航）

玻璃仪器按产品类型分类，不使用旧分类体系。当前产品族覆盖的分类：

```
Beakers / Flasks / Condensers / Cylinders / Funnels /
Adapters & Connectors / Bottles & Jars / Distillation Kits /
Filtration Kits / Accessories
```
### 多维交叉导航

借鉴自 Laboy Glass：产品类型、磨口规格、材质 三维交叉导航。

除了按产品类型的标准分类导航外，增加两个交叉导航维度：

| 维度 | 导航路径 | 示例 |
|------|----------|------|
| **磨口规格**（Joint Size） | navbar → Shop by Joint | 24/40、19/22、14/20 → /products?jointSize=24-40 |
| **材质**（Material） | navbar → Shop by Material | Borosilicate、PTFE → /products?material=borosilicate |

实现方式：下拉菜单跳转到产品列表页 URL（带筛选参数），复用已有 FilterPanel 和 useProductFilters hook。
不新增路由，不改数据库。

### 每个分类/产品页必须包含

1. 多维筛选面板（容量、材质、壁厚、磨口、精度等级）
2. 分类级别的介绍文字（非模板化，含实验场景说明）
3. FAQ（分类页底部，用 `FAQPage` schema 标记）
4. 结构化数据（JSON-LD Product schema）
5. 产品对比入口（可选 2-4 个 Variant 并排对比）

### 设计令牌（Design Tokens）

颜色在 `tailwind.config.ts` 中统一配置，组件中不直接写十六进制色值：

```tsx
// ✅ 正确
className="text-brand-600 bg-surface-50"

// ❌ 禁止
style={{ color: '#0F4C81', backgroundColor: '#FAFBFC' }}
```

### 国际化

所有面向用户可见的文本通过 `useI18n()` 获取，禁止硬编码英文文案。

### UI 组件规范

- 优先使用 Radix UI 原子组件组合，不重复造轮子
- 使用 Lucide icons，不自创 SVG 图标
- 数字显示带千分位分隔符（`1,000`），货币带美元符号（`$4.90`）
- 玻璃仪器专用组件：`SpecTable`、`VariantSelector`、`ComparePanel`、`FilterPanel`、`StockBadge`、`ShippingEstimator`

---

## 代码规范

### Git 提交规范

使用 Conventional Commits：

```
feat:     新增功能
fix:      修复 bug
refactor: 重构，不改功能
perf:     性能优化
docs:     文档/知识库
data:     产品数据导入/更新
style:    UI 样式变更
chore:    构建/配置/deps 变更
test:     测试相关
```

每次提交应含义明确、范围单一。一个功能模块完成后立即提交，不攒批。

### 文件组织

```
app/
  (store)/         → 前台页面，按路由分组
  admin/           → 后台管理
  api/             → API 路由
components/
  store/           → 前台组件
  admin/           → 后台组件
lib/               → 工具函数、数据库客户端、i18n
hooks/             → Zustand stores、React hooks
prisma/            → Schema + 种子数据
scripts/           → 数据导入/维护脚本
docs/              → 文档 + 架构决策记录（ADRs）
```

### API 路由

- RESTful 风格，按资源组织
- `/api/products` — 不查询旧 Product 表，改查 SPU + ProductVariant
- `/api/quotes` — 保持现有 Quote 流程
- `/api/admin/*` — 后台管理 API，需角色鉴权

---

## 关键禁止事项（DO NOT）

1. ❌ **禁止写入 `prisma.product` 表** — 旧数据模型已废弃
2. ❌ **禁止在前端硬编码颜色值** — 使用 Tailwind 设计令牌
3. ❌ **禁止在组件中硬编码用户可见文本** — 使用 i18n
4. ❌ **禁止直接使用 HTML `<img>` 标签** — 使用 Next.js `Image` 组件
5. ❌ **禁止删除或修改未在本次任务范围内的已有代码** — 除非明确说明
6. ❌ **禁止在未记录决策的情况下修改数据库 schema** — 需先在 `docs/decisions/` 记录 ADR
7. ❌ **禁止将 JSON 字段作为前端搜索/筛选依据** — 结构化字段必须在数据库列级别定义
8. ❌ **禁止提交未经简单验证的 API 变更** — 尤其是影响报价/订单的流程

---

## 开始开发

```bash
# Node.js 环境（本地安装）
export PATH="$HOME/.local/node/bin:$PATH"

npm run dev          # 启动开发服务器（需先设置 PATH）
npm run dev:3001     # 或 npm run dev -- -p 3001（3000 被占用时）
npm run build        # 构建验证
npm run lint         # ESLint 检查
npm run db:push      # 推送 Schema 变更到数据库
npm run db:generate  # 重新生成 Prisma Client
```

## 项目文件索引

| 文件 | 说明 |
|---|---|
| `CODEX.md` | **本文件** — Codex 项目指令 |
| `docs/decisions/` | 架构决策记录（ADRs） |
| `CHANGELOG.md` | 版本变更记录 |
| `README.md` | 项目通用 README |
| `prisma/schema.prisma` | 数据库 Schema |
| `tailwind.config.ts` | 设计令牌配置 |
| `lib/i18n/` | 国际化翻译文件 |

---

## 开发工作流：OpenSpec + Superpowers

本项目使用 **OpenSpec OPSX 工作流**（expanded profile）配合 **Superpowers** 增强插件进行规范驱动的开发。

### 目录结构

```
openspec/
├── config.yaml              # 项目上下文配置（每次 propose 时 AI 自动读取）
├── specs/                   # 主规范（从已完成变更中累积）
│   └── beakers/             # 按域（domain）组织，非文件目录
│   └── flasks/
│   └── ...
├── changes/                 # 进行中的变更
│   ├── <change-name>/
│   │   ├── .openspec.yaml   # 变更元数据
│   │   ├── proposal.md      # 做什么、为什么
│   │   ├── specs/           # 增量规范（Given/When/Then）
│   │   ├── design.md        # 怎么做
│   │   ├── review.md        # 实现就绪评审
│   │   ├── tasks.md         # 任务清单
│   │   ├── plan.md          # 执行计划（Superpowers）
│   │   └── verification.md  # 验证证据（可选）
│   └── archive/             # 已归档变更
│       └── <date>-<name>/
docs/
└── solutions/               # 方案文档（复杂变更先出方案）
    └── <topic>.md
```

### 命令速查

| 命令 | 阶段 | 用途 | Profile |
|------|------|------|---------|
| `/opsx:explore` | 探索 | 读代码、问问题、理清思路 | core |
| `/opsx:propose` | 规划 | 一次产出所有 artifact（快捷方式） | core |
| `/opsx:new` | 规划 | 建变更目录脚手架，不产生 artifact | expanded |
| `/opsx:continue` | 规划 | 按依赖顺序逐个创建 artifact | expanded |
| `/opsx:ff` | 规划 | 一次产出所有 planning artifact | expanded |
| `/opsx:apply` | 实现 | 执行 tasks.md 中的任务 | core |
| `/opsx:verify` | 验证 | 检查实现是否符合 spec | expanded |
| `/opsx:sync` | 同步 | 将 delta 规范同步到主规范 | core |
| `/opsx:archive` | 归档 | 变更完成，归档到 archive 目录 | core |
| `/opsx:bulk-archive` | 归档 | 批量归档多个变更 | expanded |
| `/opsx:onboard` | 引导 | 端到端工作流引导 | expanded |

### 选择哪个流程

```
变更复杂度高 / 涉及新业务逻辑 / 跨模块
    │
    ├─ 思路不清晰 → /opsx:explore
    │
    ├─ 需求明确 → /opsx:propose（小变更）或 /opsx:new + /opsx:continue（大变更分步走）
    │
    ├─ 需要先出方案文档 → docs/solutions/*.md（Superpowers 增强）
    │                     → 确认后 /opsx:new + /opsx:continue
    │
    └─ 方案确认后 → /opsx:apply（如果 Superpowers 已生成 plan.md，按 plan 执行）
                 → /opsx:verify（需要时）
                 → /opsx:archive
```

### 使用原则

1. **老项目场景优先 `new + continue`**：按依赖顺序逐个生成 artifact，每步 review，避免一次性全量生成偏离方向
2. **不可变约束写在 `openspec/config.yaml` 的 `context:` 中**：哪些接口不能动、哪些模块不能改
3. **复杂变更走 Superpowers 方案先行**：先写 `docs/solutions/*.md`，确认后再进入 OpenSpec change
4. **跨域改动 delta 放行为发生变化的那个域**：一个 change 同时改 A 和 B 的对外行为，拆成两个 change
5. **review 通过才能 apply**：`review.md` 是实现就绪的门禁

---

## 项目文件索引（完整版）

| 文件 | 说明 |
|---|---|
| `CODEX.md` | 本文件 — Codex 项目指令 |
| `openspec/config.yaml` | OpenSpec 项目上下文配置 |
| `openspec/specs/` | 规范基线（按域组织） |
| `openspec/changes/` | 进行中 / 已归档的变更 |
| `docs/decisions/` | 架构决策记录（ADRs） |
| `docs/solutions/` | Superpowers 方案文档 |
| `CHANGELOG.md` | 版本变更记录 |
| `.codex/skills/novatech-labware-store/` | Codex 项目技能（自动加载） |
| `.codex/skills/superpowers-openspec/` | Superpowers 增强技能 |
| `.codex/skills/openspec-*/` | OpenSpec 工作流技能 |
| `~/.codex/prompts/opsx-*.md` | OpenSpec 命令提示（全局安装） |
