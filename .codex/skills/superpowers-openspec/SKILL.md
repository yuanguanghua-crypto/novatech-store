---
name: superpowers-openspec
description: Superpowers 增强工作流 — 在 OpenSpec 规范基础上增加方案文档先行、评审门禁和验证闭环
metadata:
  short-description: 方案文档先行 → 评审门禁 → 执行计划 → 验证闭环
  author: adapted from tielei60/superpowers-openspec
---

# Superpowers OpenSpec 增强工作流

本 skill 在 OpenSpec 标准 OPSX 工作流之上增加三层增强：
1. **方案文档先行** — 复杂变更先写方案文档，确认后再生成 OpenSpec change
2. **评审门禁** — `review.md` 作为实现就绪门禁
3. **执行计划 + 验证闭环** — `plan.md` 驱动执行，`verification.md` 留存证据

## 核心原则

```text
方案先确认 → 规范再承接 → 计划再落地
```

## 触发条件

### 使用本 skill（满足任一即可）

- 需求零散，需要先探索分析
- 涉及业务规则、流程、接口、数据结构、状态流转或模块边界变化
- 用户把"设计/方案/计划"和"实现/开发/落地"写在同一句里
- 任务涉及新功能、跨模块改造、流程优化或重构

### 不强制使用

- 纯 bug 修复，不涉及新规则或接口
- 纯文案、样式、配置值调整
- 单点技术修复，影响范围明确

## 增强产物集

在 OpenSpec 标准产物上增加以下文件：

| 文件 | 阶段 | 说明 |
|------|------|------|
| `docs/solutions/<主题>.md` | 方案阶段 | 完整方案文档，先于 OpenSpec change 存在 |
| `review.md` | 评审门禁 | 实现就绪评审，确认设计/规范/方案是否通过 |
| `plan.md` | 执行驱动 | 实现阶段的详细执行计划，分步驱动 apply |
| `brainstorm.md` | 探索阶段（可选） | 思路发散记录 |
| `verification.md` | 验证阶段（可选） | 验证结果留存 |

## 意图到命令的映射

| 用户表达 | 处理方式 |
|----------|----------|
| "先沟通需求，再把功能做出来" | 先 `/opsx:explore` |
| "先把方案和开发计划定下来" | 优先规范阶段，再决定用 `/opsx:propose` 或 `/opsx:new`+`/opsx:continue` |
| "先帮我写完整方案文档，确认后再生成 change" | 先 `docs/solutions/*.md`，确认后再进入 `/opsx:*` |
| "规划好了，开始实现" | `/opsx:apply`（已生成 plan.md 时按 plan 执行） |
| "检查实现有没有偏离 spec" | `/opsx:verify` |
| "把做好的变更归档" | `/opsx:archive` |

## 方案文档规范

当用户要求先出方案文档时：

1. 在 `docs/solutions/<kebab-case-topic>.md` 创建方案文档
2. 文档必须包含：
   - 背景与目标
   - 方案对比（至少 2 种可选方案）
   - 推荐方案及理由
   - 影响范围（模块/数据/接口）
   - 开放问题
3. 用户确认后，方案文档内容作为提案依据进入 OpenSpec change
4. `proposal.md` 中必须注明"来源方案文档：`docs/solutions/<file>.md`"

## 评审门禁 (review.md)

`review.md` 位于 `openspec/changes/<name>/review.md`，内容：

```markdown
## Review Checklist

- [ ] Proposal 明确且完整
- [ ] Specs 覆盖所有场景（含边界情况）
- [ ] Design 可行且与 V3.2 架构一致
- [ ] 双仓/国际物流影响已评估（如适用）
- [ ] 定价/报价影响已评估（如适用）
- [ ] 迁移/兼容性方案已明确（如适用）

## Review Result

**Status**: Pending / Approved / Changes Required

**Reviewer Notes**:
```

在 `/opsx:apply` 之前必须先完成 review。

## 方案文档模板

参见 `references/solution-template.md`

## 本地化说明

- 方案文档优先使用中文
- 架构/流程/状态/时序等复杂关系优先 Mermaid 图
- 页面/表单/列表等结构说明优先 ASCII 文本布局图
- 术语首次出现需解释
- 对比/枚举/状态映射优先表格

## 测试与验证闭环

在 `/opsx:apply` 完成后，进入验证阶段：

### 验证类型

| 类型 | 触发条件 | 验证方法 |
|------|----------|----------|
| **编译验证** | 每次代码变更后 | 运行 `npm run build` 或 `npm run lint` |
| **API 验证** | API 路由新增/修改 | 调用 API 端点，验证返回格式和状态码 |
| **UI 验证** | 前端组件变更 | 在浏览器中人工确认或使用 Playwright 截图对比 |
| **数据验证** | 数据模型变更 | 查询数据库，验证数据完整性和字段映射 |

### 验证记录

验证结果记录在 `openspec/changes/<name>/verification.md`：

```markdown
## Verification Results

### Compile Check
- [ ] `npm run build` 通过
- [ ] `npm run lint` 无错误

### API Check (if applicable)
- [ ] 端点返回 200
- [ ] 响应格式符合设计
- [ ] 边界情况处理正确

### Manual UI Check (if applicable)
- [ ] 页面渲染正常
- [ ] 交互行为正确
- [ ] 移动端适配

### Data Check (if applicable)
- [ ] 数据写入正确
- [ ] 现有数据兼容

**Status**: Pending / Passed / Failed
```

### 测试驱动开发（TDD）

当变更涉及核心业务逻辑时：

1. 先在 `specs/` 中定义 Given/When/Then 场景
2. 编写对应的测试用例
3. 实现功能代码
4. 验证测试通过
5. 将测试文件提交到 `tests/` 目录

## 全生命周期流程图

```
用户表达需求
  │
  ├─ 需求零散 → /opsx:explore（探索）
  │
  ├─ 需求清晰 → docs/solutions/<主题>.md（方案文档）
  │                │
  │            ┌────┴────┐
  │            │ 用户确认 │ ← 关键门禁
  │            └────┬────┘
  │                 │
  │            /opsx:new + /opsx:continue
  │                 │
  │            ┌────┴────┐
  │            │ 评审门禁  │ ← review.md
  │            └────┬────┘
  │                 │
  │            /opsx:apply（按 plan.md 执行）
  │                 │
  │            ┌────┴────┐
  │            │ 验证闭环  │ ← verification.md
  │            └────┬────┘
  │                 │
  │            /opsx:verify（可选）
  │                 │
  │            /opsx:archive
```

## 停止条件

以下情况应暂停流程并请求用户指示：

1. 方案文档中开放问题超过 3 个未解决
2. review 未通过（状态为 "Changes Required"）
3. 验证未通过（verification.md 状态为 "Failed"）
4. 变更范围超出原始 proposal 的 scope
5. 涉及不可变约束（CODEX.md 中标记的 DO NOT 项）
