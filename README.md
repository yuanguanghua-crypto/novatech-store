# NovatechStore

工业品跨境电商平台 — 面向海外客户，基于中国供应链。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Next.js 14 (App Router) + TypeScript |
| 样式 | Tailwind CSS + shadcn/ui |
| 数据库 | PostgreSQL (AWS RDS) via Prisma ORM |
| 认证 | NextAuth.js (Google OAuth + Email/Password) |
| 状态管理 | Zustand (购物车/询价单) |
| 支付 | Stripe |
| 文件存储 | AWS S3 + CloudFront |
| 部署 | AWS ECS Fargate + ALB |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local，填写所有必填项
```

### 3. 初始化数据库

```bash
# 推送 Schema 到数据库
npm run db:push

# 或使用 Migration（推荐生产环境）
npm run db:migrate
```

### 4. 导入产品数据

```bash
# 先用 dry-run 验证数据
npm run db:import -- --dry-run

# 测试导入 100 条
npm run db:import -- --limit=100

# 导入全部 15,259 条（约 10-15 分钟）
npm run db:import
```

> **注意**：运行导入前，确保 `novatech_nova_products.json` 在项目父目录（默认路径）或当前目录。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
novatech-store/
├── app/
│   ├── (store)/          # 前台页面
│   │   ├── page.tsx         首页
│   │   ├── products/        产品列表/详情
│   │   ├── categories/      分类页
│   │   ├── search/          搜索结果
│   │   ├── cart/            购物车
│   │   ├── checkout/        结账
│   │   ├── quote/           询价
│   │   └── account/         用户中心
│   ├── admin/            # 后台管理
│   │   ├── page.tsx         仪表盘
│   │   ├── products/        产品管理
│   │   ├── orders/          订单管理
│   │   ├── quotes/          询价管理
│   │   ├── suppliers/       供应商管理
│   │   └── customers/       客户管理
│   └── api/              # API 路由
│       ├── auth/            NextAuth
│       ├── products/        产品 API
│       ├── orders/          订单 API
│       ├── quotes/          询价 API
│       └── search/          搜索 API
├── components/
│   ├── store/            # 前台组件
│   └── admin/            # 后台组件
├── lib/                  # 工具库
│   ├── prisma.ts          数据库客户端
│   ├── auth.ts            认证配置
│   └── utils.ts           通用工具
├── hooks/                # React Hooks
│   ├── use-cart.ts        购物车状态
│   └── use-quote.ts       询价状态
├── prisma/
│   └── schema.prisma      数据库 Schema
└── scripts/
    ├── import-products.js  产品导入脚本
    └── deploy-aws.sh       AWS 部署脚本
```

## 本地 Docker 开发

```bash
# 启动 PostgreSQL + Redis
docker-compose up -d postgres redis

# 修改 .env.local 中的 DATABASE_URL:
# DATABASE_URL="postgresql://postgres:changeme@localhost:5432/novatech_store"

npm run db:push
npm run db:import
npm run dev
```

## 生产部署（AWS）

### 前置条件

1. AWS 账号，已配置 CLI (`aws configure`)
2. 创建 ECR 仓库：`aws ecr create-repository --repository-name novatech-store`
3. 创建 ECS 集群（Fargate 模式）
4. 创建 RDS PostgreSQL 实例（db.t3.medium 推荐）
5. 创建 S3 存储桶（产品图片）
6. 配置 CloudFront 分发

### 部署步骤

```bash
# 编辑 scripts/deploy-aws.sh，填写 AWS Account ID 等参数
chmod +x scripts/deploy-aws.sh
./scripts/deploy-aws.sh
```

## 环境变量说明

| 变量 | 说明 | 必填 |
|------|------|------|
| DATABASE_URL | PostgreSQL 连接串 | ✅ |
| NEXTAUTH_SECRET | 随机字符串（openssl rand -base64 32）| ✅ |
| NEXTAUTH_URL | 应用 URL | ✅ |
| GOOGLE_CLIENT_ID | Google OAuth | ❌ |
| STRIPE_SECRET_KEY | Stripe 密钥 | ❌ |
| AWS_S3_BUCKET | 图片存储桶名 | ❌ |

## 第一个管理员账号

导入数据后，在数据库直接执行：

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```

或通过 Prisma Studio：

```bash
npx prisma studio
```

## 路线图

- [x] Phase 1: 产品展示、搜索、分类筛选
- [x] Phase 1: 询价系统
- [x] Phase 1: 后台管理
- [ ] Phase 2: 在线支付（Stripe）
- [ ] Phase 2: 用户注册/登录
- [ ] Phase 3: 物流追踪（AfterShip）
- [ ] Phase 3: 邮件通知（SES）
- [ ] Phase 4: 供应商门户
- [ ] Phase 4: 数据分析报表
