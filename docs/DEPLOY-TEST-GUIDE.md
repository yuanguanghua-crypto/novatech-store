# LabProGlobal 测试环境部署指南

本文档说明如何快速将 LabProGlobal 部署为可分享的测试链接。

---

## 方案概览

| 组件 | 方案 | 费用 | 备注 |
|------|------|------|------|
| 数据库 | Supabase PostgreSQL | 免费 | 500MB 存储，够用 |
| 前端部署 | Vercel | 免费 | 无需配置服务器 |
| 测试数据 | 15,259 个产品 | — | 从 novatech_nova_products.json 导入 |
| 测试账号 | 预生成 | — | admin + 2 个测试客户 |

---

## 第一步：创建 Supabase 数据库（5 分钟）

### 1.1 注册 Supabase
1. 访问 https://supabase.com
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 填写：
   - **Organization**: 选择个人或创建新组织
   - **Name**: `labproglobal-test`
   - **Database Password**: 记录下来（很重要！）
   - **Region**: 选择 `East Asia (Tokyo)` 或 `Singapore`（延迟最低）
5. 点击 "Create new project"
6. **等待 2 分钟**，项目创建完成

### 1.2 获取连接信息
1. 进入项目 → **Settings** → **Database**
2. 找到 **Connection string** 部分
3. 选择 **URI** 标签
4. 复制连接字符串，格式如下：
   ```
   postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. 记录下来，后面会用到

### 1.3 配置 IP 白名单
1. 在 Supabase Dashboard → **Database** → **Connection Pooling**
2. 找到 **Allowed IPs** 设置
3. 添加 `0.0.0.0/0`（允许所有 IP 访问，生产环境请限制）
4. 保存

---

## 第二步：推送数据库 Schema

### 2.1 安装 Supabase CLI（可选，也可用 GUI）
```bash
npm install -g supabase
```

### 2.2 推送 Prisma Schema
在项目根目录执行：

```bash
# 设置数据库连接
set DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"

# 推送 Schema（创建表结构）
npx prisma db push

# 生成 Prisma Client
npx prisma generate
```

### 2.3 导入产品数据
```bash
# 运行导入脚本（需指定 Supabase 连接）
node scripts/import-products.js --source ../novatech_nova_products.json --db "%DATABASE_URL%"
```

> 如果导入脚本不支持参数，请手动修改脚本中的数据库连接。

### 2.4 创建测试账号
```bash
# 运行 seed 脚本
node scripts/seed.js
```

这会创建：
- **管理员账号**: admin@labpro.com / admin123
- **测试客户账号**: customer@test.com / test123

---

## 第三步：部署到 Vercel

### 3.1 准备 GitHub 仓库
1. 在 GitHub 创建新仓库：`labproglobal-test`
2. 将本地代码推送上去：
   ```bash
   cd E:/novatech-store
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/labproglobal-test.git
   git push -u origin main
   ```

### 3.2 创建 Vercel 项目
1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. 点击 "Add New" → "Project"
4. 找到你的 `labproglobal-test` 仓库，点击 "Import"
5. 在 **Framework Preset** 选择 `Next.js`（自动识别）
6. 在 **Environment Variables** 添加以下变量：

   | 变量名 | 值（示例） |
   |--------|-----------|
   | `DATABASE_URL` | Supabase 连接字符串 |
   | `NEXTAUTH_URL` | `https://labproglobal-test.vercel.app` |
   | `NEXTAUTH_SECRET` | 随机字符串（用 `openssl rand -base64 32` 生成） |
   | `NEXT_PUBLIC_APP_URL` | `https://labproglobal-test.vercel.app` |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...`（Stripe 测试密钥） |
   | `STRIPE_SECRET_KEY` | `sk_test_...`（Stripe 测试密钥） |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...`（Stripe Webhook 密钥） |

7. 点击 "Deploy"

### 3.3 等待部署完成
- 通常需要 **2-3 分钟**
- 部署完成后，你会得到一个链接，如：
  ```
  https://labproglobal-test.vercel.app
  ```

---

## 第四步：验证部署

### 4.1 验证前台商城
- 🏠 **首页**: https://labproglobal-test.vercel.app
- 📦 **产品列表**: https://labproglobal-test.vercel.app/products
- 🔍 **搜索**: https://labproglobal-test.vercel.app/search?q=pump
- 🏷️ **品牌页**: https://labproglobal-test.vercel.app/brands

### 4.2 验证后台管理
- 🔐 **管理后台**: https://labproglobal-test.vercel.app/admin
- 登录账号: `admin@labpro.com` / `admin123`

### 4.3 验证功能清单

| 功能 | 验证方法 |
|------|---------|
| 产品浏览 | 打开 /products，检查产品列表是否正常显示 |
| 分类筛选 | 点击某个分类，检查产品是否正确过滤 |
| 品牌筛选 | 点击某个品牌，检查品牌产品是否正确 |
| 搜索功能 | 在 /search 搜索关键词，检查结果 |
| 加入购物车 | 点击产品 → 加入购物车 → 检查 /cart |
| 发起询价 | 点击产品 → 发起询价 → 检查询价车 |
| 登录注册 | 测试账号登录、注册功能 |
| 后台产品管理 | /admin/products 检查产品列表 |
| 后台订单管理 | /admin/orders 检查订单管理 |
| 后台询价管理 | /admin/quotes 检查询价单管理 |

---

## 第五步：生成测试报告模板

### 5.1 创建验证清单
让测试人员按以下清单验证功能：

```
# LabProGlobal 测试验证清单

## 一、前台商城测试

### 1.1 首页功能
- [ ] 首页正常加载，无报错
- [ ] 分类网格正常显示
- [ ] 精选产品正常显示
- [ ] 导航栏链接正常

### 1.2 产品浏览
- [ ] 产品列表页正常加载
- [ ] 产品卡片显示图片、名称、价格
- [ ] 分页功能正常
- [ ] 排序功能正常

### 1.3 产品详情
- [ ] 产品详情页正常加载
- [ ] 图片画廊正常显示
- [ ] 规格参数正常显示
- [ ] 加入购物车功能正常
- [ ] 发起询价功能正常

### 1.4 搜索与筛选
- [ ] 关键词搜索正常
- [ ] 分类筛选正常
- [ ] 品牌筛选正常

### 1.5 购物车与结算
- [ ] 购物车功能正常
- [ ] 结算流程正常（可跳过支付测试）

### 1.6 询价功能
- [ ] 询价车功能正常
- [ ] 提交询价成功
- [ ] 收到询价确认

### 1.7 用户认证
- [ ] 注册功能正常
- [ ] 登录功能正常
- [ ] 账户中心正常访问

## 二、后台管理测试

### 2.1 登录与权限
- [ ] 管理员登录成功
- [ ] 非 admin 用户无法访问 /admin

### 2.2 产品管理
- [ ] 产品列表正常显示
- [ ] 搜索产品功能正常
- [ ] 创建产品功能正常
- [ ] 编辑产品功能正常
- [ ] 删除产品功能正常

### 2.3 订单管理
- [ ] 订单列表正常显示
- [ ] 查看订单详情正常
- [ ] 更新订单状态正常

### 2.4 询价单管理
- [ ] 询价单列表正常显示
- [ ] 查看询价单详情正常
- [ ] 回复询价功能正常
- [ ] 状态流转正常

### 2.5 供应商管理
- [ ] 供应商列表正常显示
- [ ] 创建供应商功能正常
- [ ] 编辑/删除供应商正常

## 三、问题记录

| 编号 | 模块 | 问题描述 | 严重程度 | 截图 |
|------|------|---------|---------|------|
| 1 | | | 高/中/低 | |
| 2 | | | 高/中/低 | |
| 3 | | | 高/中/低 | |

## 四、总体评价
- 功能完整性: ⭐⭐⭐⭐⭐
- 界面美观度: ⭐⭐⭐⭐⭐
- 易用性: ⭐⭐⭐⭐⭐
- 性能速度: ⭐⭐⭐⭐⭐
- 总体评分: ⭐⭐⭐⭐⭐
```

---

## 第六步：分享给测试人员

### 6.1 发送测试邀请邮件模板

```
主题：LabProGlobal 测试验证邀请

你好，

感谢你帮忙测试 LabProGlobal B2B 电商平台！

📌 访问地址：
- 前台商城：https://labproglobal-test.vercel.app
- 管理后台：https://labproglobal-test.vercel.app/admin

🔑 测试账号：
- 管理员：admin@labpro.com / admin123
- 测试客户：customer@test.com / test123

📋 测试任务：
请按照附件中的《测试验证清单》进行功能验证，
重点关注：
1. 前台产品浏览和搜索体验
2. 购物车和询价功能
3. 后台管理操作的流畅度
4. 页面加载速度和响应性

⏰ 截止时间：收到邮件后 3 天内

📝 请将测试结果和发现的问题回复此邮件。

谢谢！
```

### 6.2 创建 Trello/飞书表格收集反馈
- 创建"待验证"、"验证中"、"已发现问题"、"已修复"四列
- 分享链接给测试人员协作

---

## 附录：快速命令汇总

```bash
# 1. 推送数据库
npx prisma db push

# 2. 导入产品数据
node scripts/import-products.js --source ./novatech_nova_products.json

# 3. 创建测试账号
node scripts/seed.js

# 4. 本地开发
npm run dev

# 5. 生产构建
npm run build && npm start
```

---

## 常见问题

### Q1: 部署后页面空白或报错？
**A**: 检查 Vercel 环境变量是否正确配置，特别是 `DATABASE_URL` 和 `NEXTAUTH_URL`。

### Q2: 产品图片不显示？
**A**: 检查 `AWS_S3_*` 环境变量配置，或确认图片已上传到 S3。

### Q3: 支付功能测试？
**A**: 使用 Stripe 测试模式，测试卡号：`4242 4242 4242 4242`，任意未来日期和 CVC。

### Q4: 如何重置测试数据？
**A**: 在 Supabase Dashboard → SQL Editor 执行：
```sql
-- 清空所有表（保留结构）
TRUNCATE TABLE "OrderItem", "Order", "QuoteItem", "Quote", "Product", "Category", "Brand", "Supplier", "ProductSupplier", "User", "Account", "Session", "Address", "VerificationToken", "PurchaseOrder", "PurchaseOrderItem" CASCADE;
```
然后重新运行 seed 和 import 脚本。

### Q5: 如何添加更多测试账号？
**A**: 在 seed.js 中添加更多用户，或直接在 Supabase Dashboard → Table Editor 中手动添加。

---

*文档版本：v1.0 | 更新日期：2026-04-22*
