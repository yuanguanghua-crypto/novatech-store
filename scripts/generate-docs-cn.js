'use strict';

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  ExternalHyperlink, TableOfContents
} = require('docx');
const fs = require('fs');
const path = require('path');

// ===== 辅助函数 =====
function h(level, text) {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, bold: true, font: 'Microsoft YaHei', size: level === HeadingLevel.HEADING_1 ? 36 : level === HeadingLevel.HEADING_2 ? 28 : 24, color: level === HeadingLevel.HEADING_1 ? '1E3A5F' : '2E75B6' })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: 'Microsoft YaHei', size: 22, ...opts })],
  });
}

function bullet(text, bold = false) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: 'Microsoft YaHei', size: 22, bold })],
  });
}

function bullet2(text) {
  return new Paragraph({
    numbering: { reference: 'bullets2', level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: 'Microsoft YaHei', size: 22 })],
  });
}

function gap() {
  return new Paragraph({ spacing: { after: 80 }, children: [new TextRun('')] });
}

// ===== 表格工具 =====
const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function makeHeaderCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: '1E3A5F', type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: 'FFFFFF', font: 'Microsoft YaHei', size: 20 })],
    })],
  });
}

function makeCell(text, width, shade = false) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: shade ? 'F9FAFB' : 'FFFFFF', type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    children: [new Paragraph({
      children: [new TextRun({ text, font: 'Microsoft YaHei', size: 20 })],
    })],
  });
}

// ===== 文档内容 =====
const children = [];

// ===== 封面 =====
children.push(
  gap(), gap(), gap(), gap(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: 'LabProGlobal', bold: true, font: 'Arial', size: 64, color: '1E3A5F' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: 'B2B 工业品跨境电商平台', font: 'Microsoft YaHei', size: 36, color: '4B5563' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: '产品文档  ·  v1.0', font: 'Microsoft YaHei', size: 28, color: '9CA3AF' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: '完整产品文档', bold: true, font: 'Microsoft YaHei', size: 32 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: '功能说明 · 交互说明 · 技术架构 · 后台管理 · 操作手册', font: 'Microsoft YaHei', size: 22, color: '6B7280' })],
  }),
  gap(), gap(), gap(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: '最后更新：2026-04-22', font: 'Microsoft YaHei', size: 20, color: '9CA3AF' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: '内部使用  ·  保密文件', font: 'Microsoft YaHei', size: 20, color: '9CA3AF' })],
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 目录 =====
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: '目  录', font: 'Microsoft YaHei', size: 36, color: '1E3A5F' })],
  }),
  new TableOfContents('', { hyperlink: true, headingStyleRange: '1-2' }),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第一章：产品概述 =====
children.push(
  h(HeadingLevel.HEADING_1, '一、产品概述'),
  gap(),

  h(HeadingLevel.HEADING_2, '1.1 产品简介'),
  p('LabProGlobal 是一个专注于工业和实验室设备的 B2B 跨境电商平台，基于 Next.js、Prisma 和 PostgreSQL 构建。平台旨在帮助全球客户从中国制造商采购实验室用品，尤其侧重于化学计量泵、水质分析仪和精密仪器等品类。'),
  gap(),
  p('核心产品目录来源于 LABPRO 的数据采集，共涵盖 15,259+ 个 SKU，横跨 52 个品牌（如 Pulsafeeder、LMI、Lovibond、United Scientific 等），分布在 140 个子分类下。'),
  gap(),

  h(HeadingLevel.HEADING_2, '1.2 核心功能亮点'),
  bullet('B2B 产品目录 — 15,000+ 工业品/实验室产品，完整规格、图片和价格'),
  bullet('智能询价系统 — 客户可对单个或批量产品发起询价请求'),
  bullet('后台管理面板 — 产品、订单、询价单、供应商的全功能 CRUD 操作'),
  bullet('双轨采购模式 — 支持在线直接购买和询价报价两种采购方式'),
  bullet('多品牌浏览 — 支持按 52 个品牌和 140+ 子分类筛选产品'),
  bullet('响应式设计 — 适配移动端，方便专业人员随时随地进行采购'),
  bullet('会话认证 — NextAuth 支持账号密码和 Google OAuth 登录'),
  gap(),

  h(HeadingLevel.HEADING_2, '1.3 目标用户'),
  bullet('B2B 客户 — 实验室、化工企业、水处理厂、科研机构'),
  bullet('平台管理员 — 负责目录管理、订单处理和供应商关系的内部团队'),
  bullet('采购人员 — 使用询价系统进行批量采购和 OEM 定制需求'),
  gap(),

  h(HeadingLevel.HEADING_2, '1.4 系统技术栈'),
  p('平台采用全栈架构，前端（Next.js App Router）、后端（Next.js API Routes）和数据库（PostgreSQL + Prisma ORM）之间职责清晰分离。'),

  // Tech stack table
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 6560],
    rows: [
      new TableRow({ children: [makeHeaderCell('技术类别', 2800), makeHeaderCell('技术选型', 6560)] }),
      new TableRow({ children: [makeCell('前端框架', 2800), makeCell('Next.js 14.2.3（App Router, React 18）', 6560)] }),
      new TableRow({ children: [makeCell('数据库', 2800), makeCell('PostgreSQL 18（兼容 AWS RDS）', 6560, true)] }),
      new TableRow({ children: [makeCell('ORM', 2800), makeCell('Prisma 5.14.0', 6560)] }),
      new TableRow({ children: [makeCell('身份认证', 2800), makeCell('NextAuth 4.24.7（Credentials + Google OAuth）', 6560, true)] }),
      new TableRow({ children: [makeCell('状态管理', 2800), makeCell('Zustand 4.5.2（购物车 + 询价车状态，localStorage 持久化）', 6560)] }),
      new TableRow({ children: [makeCell('支付系统', 2800), makeCell('Stripe 15.12.0（Stripe.js + React Stripe）', 6560, true)] }),
      new TableRow({ children: [makeCell('表单验证', 2800), makeCell('React Hook Form + Zod 3.23.8', 6560)] }),
      new TableRow({ children: [makeCell('样式方案', 2800), makeCell('Tailwind CSS + Radix UI（Dialog、Tabs、Select 等）', 6560)] }),
      new TableRow({ children: [makeCell('邮件服务', 2800), makeCell('Nodemailer 7 + AWS SES / SMTP', 6560, true)] }),
      new TableRow({ children: [makeCell('对象存储', 2800), makeCell('AWS S3（通过 @aws-sdk/client-s3）', 6560)] }),
      new TableRow({ children: [makeCell('运行环境', 2800), makeCell('Node.js（E:/Program Files/nodejs/node.exe）', 6560, true)] }),
    ],
  }),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第二章：项目结构 =====
children.push(
  h(HeadingLevel.HEADING_1, '二、项目结构'),
  gap(),

  h(HeadingLevel.HEADING_2, '2.1 目录布局'),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: 'labpro-store/                         # 项目根目录', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 60 },
    indent: { left: 360 },
    children: [new TextRun({ text: '├── app/                              # Next.js App Router', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── (store)/                         # 前台商城（公开访问）', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   ├── page.tsx                     # 首页', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   ├── products/                    # 产品列表与详情', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   ├── categories/                 # 分类浏览', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   ├── brands/                      # 品牌列表与详情', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   ├── cart/                       # 购物车', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   ├── checkout/                   # 结账页面', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   ├── quote/                      # 询价请求表单', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   ├── search/                     # 搜索结果页', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   ├── account/                    # 客户账户中心', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1440 },
    children: [new TextRun({ text: '│   ├── orders/                     # 订单历史', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1440 },
    children: [new TextRun({ text: '│   ├── quotes/                     # 询价单历史', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1440 },
    children: [new TextRun({ text: '│   └── addresses/                  # 收货地址簿', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   ├── auth/                       # 登录与注册', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '│   └── [privacy|terms|support|shipping|returns]/', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── admin/                          # 后台管理面板（需登录认证）', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '├── page.tsx                       # 管理后台首页/仪表盘', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '├── products/                      # 产品管理', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '├── orders/                        # 订单管理', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '├── quotes/                        # 询价单管理', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '├── customers/                     # 客户列表', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '├── suppliers/                     # 供应商管理', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '├── analytics/                    # 数据分析（占位）', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 1080 },
    children: [new TextRun({ text: '└── settings/                     # 系统设置（占位）', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '└── api/                            # API 路由', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── admin/products/               # 管理端产品 CRUD', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── admin/orders/                 # 管理端订单管理', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── admin/quotes/                 # 管理端询价 + 报价', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── admin/suppliers/              # 管理端供应商 CRUD', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── products/                      # 公开产品列表', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── categories/                   # 分类列表', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── brands/                        # 品牌列表', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── quotes/                        # 客户询价提交', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── search/                        # 产品搜索', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: "├── auth/[...nextauth]/            # NextAuth 处理器", font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '└── webhooks/stripe/              # Stripe 支付回调', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: '├── components/', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '├── admin/                         # 管理端专用组件', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── sidebar.tsx                   # 侧边导航栏', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── product-form.tsx              # 产品创建/编辑表单', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── order-detail-client.tsx        # 订单详情组件', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── quote-detail-client.tsx       # 询价单详情组件', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '└── supplier-list-client.tsx      # 供应商列表组件', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '├── store/                         # 商城前端组件', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── navbar.tsx                    # 顶部导航栏', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── footer.tsx                    # 页面底部', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── product-grid.tsx             # 产品卡片网格', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── add-to-cart-button.tsx        # 加入购物车按钮', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '├── add-to-quote-button.tsx       # 加入询价车按钮', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 720 },
    children: [new TextRun({ text: '└── sort-selector.tsx             # 排序选择下拉框', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: '└── providers.tsx                 # React Query + Session Provider', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: '├── hooks/', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '├── use-cart.ts                  # Zustand 购物车状态（localStorage）', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '└── use-quote.ts                 # Zustand 询价车状态（localStorage）', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: '├── lib/', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '├── auth.ts                      # NextAuth 配置', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '├── prisma.ts                    # Prisma 客户端单例', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '├── utils.ts                     # 辅助工具函数', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '└── email/transporter.ts         # Nodemailer 邮件传输配置', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: '├── prisma/', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '└── schema.prisma               # 完整数据模型定义', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: '└── scripts/', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '├── seed.js                      # 管理员账号初始化', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '├── test-admin.js               # 自动化测试套件', font: 'Courier New', size: 18 })],
  }),
  new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text: '└── import-products.js           # LABPRO 数据导入脚本', font: 'Courier New', size: 18 })],
  }),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第三章：数据模型 =====
children.push(
  h(HeadingLevel.HEADING_1, '三、数据模型'),
  gap(),

  h(HeadingLevel.HEADING_2, '3.1 数据模型总览'),
  p('数据库 schema 共定义 17 个数据模型，涵盖 5 大领域：产品目录、供应链、用户认证、订单系统和询价系统。'),
  gap(),

  h(HeadingLevel.HEADING_2, '3.2 产品目录模型'),
  gap(),

  // Category table
  new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: 'Category（产品分类 — 层级结构）', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 2000, 4560],
    rows: [
      new TableRow({ children: [makeHeaderCell('字段名', 2800), makeHeaderCell('类型', 2000), makeHeaderCell('说明', 4560)] }),
      new TableRow({ children: [makeCell('id', 2800), makeCell('String (cuid)', 2000), makeCell('主键', 4560)] }),
      new TableRow({ children: [makeCell('name', 2800), makeCell('String (唯一)', 2000), makeCell('分类名称', 4560, true)] }),
      new TableRow({ children: [makeCell('slug', 2800), makeCell('String (唯一)', 2000), makeCell('URL 友好标识符', 4560)] }),
      new TableRow({ children: [makeCell('parentId', 2800), makeCell('String? (外键)', 2000), makeCell('自引用父分类', 4560, true)] }),
      new TableRow({ children: [makeCell('imageUrl', 2800), makeCell('String?', 2000), makeCell('分类横幅图片', 4560)] }),
      new TableRow({ children: [makeCell('sortOrder', 2800), makeCell('Int', 2000), makeCell('显示排序顺序（默认：0）', 4560)] }),
      new TableRow({ children: [makeCell('isActive', 2800), makeCell('Boolean', 2000), makeCell('软删除/可见性标志', 4560)] }),
    ],
  }),
  gap(),

  // Brand table
  new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: 'Brand（品牌 — 制造商/供应商品牌）', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 2000, 4560],
    rows: [
      new TableRow({ children: [makeHeaderCell('字段名', 2800), makeHeaderCell('类型', 2000), makeHeaderCell('说明', 4560)] }),
      new TableRow({ children: [makeCell('id', 2800), makeCell('String (cuid)', 2000), makeCell('主键', 4560)] }),
      new TableRow({ children: [makeCell('name', 2800), makeCell('String (唯一)', 2000), makeCell('品牌名称（如 Pulsafeeder）', 4560, true)] }),
      new TableRow({ children: [makeCell('slug', 2800), makeCell('String (唯一)', 2000), makeCell('URL 标识符', 4560)] }),
      new TableRow({ children: [makeCell('logoUrl', 2800), makeCell('String?', 2000), makeCell('品牌 Logo 图片 URL', 4560)] }),
      new TableRow({ children: [makeCell('country', 2800), makeCell('String', 2000), makeCell('原产国（默认：美国）', 4560, true)] }),
      new TableRow({ children: [makeCell('isActive', 2800), makeCell('Boolean', 2000), makeCell('可见性标志', 4560)] }),
    ],
  }),
  gap(),

  // Product table
  new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: 'Product（产品 — 核心库存项）', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 2000, 4560],
    rows: [
      new TableRow({ children: [makeHeaderCell('字段名', 2800), makeHeaderCell('类型', 2000), makeHeaderCell('说明', 4560)] }),
      new TableRow({ children: [makeCell('id', 2800), makeCell('String (cuid)', 2000), makeCell('主键', 4560)] }),
      new TableRow({ children: [makeCell('sku', 2800), makeCell('String (唯一)', 2000), makeCell('产品唯一代码', 4560, true)] }),
      new TableRow({ children: [makeCell('internalId', 2800), makeCell('String? (唯一)', 2000), makeCell('LABPRO 原始 ID', 4560)] }),
      new TableRow({ children: [makeCell('name', 2800), makeCell('String', 2000), makeCell('产品显示名称', 4560, true)] }),
      new TableRow({ children: [makeCell('slug', 2800), makeCell('String (唯一)', 2000), makeCell('URL 友好标识符', 4560)] }),
      new TableRow({ children: [makeCell('description', 2800), makeCell('String? (Text)', 2000), makeCell('完整产品描述', 4560)] }),
      new TableRow({ children: [makeCell('categoryId', 2800), makeCell('String (外键)', 2000), makeCell('关联 Category.id', 4560, true)] }),
      new TableRow({ children: [makeCell('brandId', 2800), makeCell('String? (外键)', 2000), makeCell('关联 Brand.id', 4560)] }),
      new TableRow({ children: [makeCell('ourPrice', 2800), makeCell('Decimal(10,2)', 2000), makeCell('页面显示售价（美元）', 4560, true)] }),
      new TableRow({ children: [makeCell('listPrice', 2800), makeCell('Decimal?(10,2)', 2000), makeCell('建议零售价（用于划线价展示）', 4560)] }),
      new TableRow({ children: [makeCell('costPrice', 2800), makeCell('Decimal?(10,2)', 2000), makeCell('内部采购成本（隐藏字段）', 4560)] }),
      new TableRow({ children: [makeCell('availability', 2800), makeCell('String', 2000), makeCell('库存状态：in_stock / out_of_stock / lead_time', 4560, true)] }),
      new TableRow({ children: [makeCell('stockQty', 2800), makeCell('Int', 2000), makeCell('可用库存数量', 4560)] }),
      new TableRow({ children: [makeCell('specs', 2800), makeCell('Json?', 2000), makeCell('规格参数键值对（JSON 格式）', 4560)] }),
      new TableRow({ children: [makeCell('isActive', 2800), makeCell('Boolean', 2000), makeCell('软删除/可见性', 4560, true)] }),
      new TableRow({ children: [makeCell('isFeatured', 2800), makeCell('Boolean', 2000), makeCell('是否在首页展示', 4560)] }),
    ],
  }),
  gap(),

  h(HeadingLevel.HEADING_2, '3.3 供应链模型'),
  bullet('Supplier — 中国制造商/供应商，含联系方式、评分（1-5星）和所在地'),
  bullet('ProductSupplier — 多对多关联表，含采购价、最小起订量、交货周期和供应商 SKU'),
  bullet('PurchaseOrder — 内部采购订单（草稿/已发送/已确认/已发货/已收货 状态流转）'),
  gap(),

  h(HeadingLevel.HEADING_2, '3.4 用户与认证模型'),
  bullet('User — email（唯一）、name、role（customer/admin/staff）、company、passwordHash（bcrypt 加密）'),
  bullet('Account — NextAuth OAuth 账号关联（支持 Google 登录）'),
  bullet('Session — NextAuth 会话记录'),
  bullet('VerificationToken — NextAuth 邮箱验证 Token'),
  bullet('Address — 客户收货/账单地址'),
  gap(),

  h(HeadingLevel.HEADING_2, '3.5 订单与询价模型'),
  bullet('Order — 订单号（唯一）、客户快照、收货/账单地址（JSON）、财务汇总、状态工作流'),
  bullet('OrderItem — 每条订单项的产品快照（sku、name、imageUrl、unitPrice、quantity、total）'),
  bullet('Quote — 询价单号（唯一）、客户联系信息、6 种状态流转（pending/reviewing/quoted/accepted/declined/expired）'),
  bullet('QuoteItem — 产品引用 + 数量 + 管理员可选的报价单价'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第四章：API 接口文档 =====
children.push(
  h(HeadingLevel.HEADING_1, '四、API 接口文档'),
  gap(),

  h(HeadingLevel.HEADING_2, '4.1 公开 API（无需认证）'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'GET /api/products — 公开产品列表', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 6560],
    rows: [
      new TableRow({ children: [makeHeaderCell('参数', 2800), makeHeaderCell('说明', 6560)] }),
      new TableRow({ children: [makeCell('limit', 2800), makeCell('最大返回数量（默认：12，最大：100）', 6560)] }),
      new TableRow({ children: [makeCell('offset', 2800), makeCell('分页偏移量（默认：0）', 6560)] }),
      new TableRow({ children: [makeCell('search', 2800), makeCell('关键词搜索（搜索 name、SKU、description、specsFlat）', 6560)] }),
      new TableRow({ children: [makeCell('category', 2800), makeCell('按分类 slug 筛选', 6560)] }),
      new TableRow({ children: [makeCell('brand', 2800), makeCell('按品牌 slug 筛选', 6560)] }),
      new TableRow({ children: [makeCell('sort', 2800), makeCell('排序方式：name / price_asc / price_desc / newest', 6560)] }),
      new TableRow({ children: [makeCell('minPrice / maxPrice', 2800), makeCell('价格区间筛选', 6560)] }),
    ],
  }),
  gap(),
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '返回格式：{ products[], total, offset, limit, hasMore }', font: 'Courier New', size: 18, color: '2E75B6' })] }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'GET /api/categories — 分类树', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  bullet('?parent=true → 返回顶级分类及其子分类（用于导航栏下拉）'),
  bullet('不带参数 → 返回所有启用状态的分类及产品数量'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'GET /api/brands — 品牌列表', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  bullet('返回所有启用状态的品牌，按字母顺序排列'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'GET /api/search — 产品搜索', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  bullet('参数：q（搜索词）、page、limit（默认：24）'),
  bullet('搜索范围：SKU、name、description、specsFlat、brand name'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'POST /api/quotes — 提交询价请求（无需认证）', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  bullet('请求体：{ customerEmail, customerName, customerCompany?, customerPhone?, message?, items: [{productId, quantity}] }'),
  bullet('返回：{ success: true, quoteNumber: "QUO-2604-00001" }'),
  gap(),

  h(HeadingLevel.HEADING_2, '4.2 管理端 API（需认证 — role: admin）'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: '产品管理', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 3000, 5160],
    rows: [
      new TableRow({ children: [makeHeaderCell('方法', 1200), makeHeaderCell('端点', 3000), makeHeaderCell('说明', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/products', 3000), makeCell('列表查询（支持搜索/筛选/分页）', 5160)] }),
      new TableRow({ children: [makeCell('POST', 1200), makeCell('/api/admin/products', 3000), makeCell('创建产品（Zod 验证）', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/products/[id]', 3000), makeCell('获取单个产品详情', 5160)] }),
      new TableRow({ children: [makeCell('PUT', 1200), makeCell('/api/admin/products/[id]', 3000), makeCell('更新产品字段', 5160)] }),
      new TableRow({ children: [makeCell('DELETE', 1200), makeCell('/api/admin/products/[id]', 3000), makeCell('删除产品（级联删除关联订单项）', 5160)] }),
      new TableRow({ children: [makeCell('POST', 1200), makeCell('/api/admin/products/[id]/images', 3000), makeCell('添加/管理产品图片', 5160)] }),
    ],
  }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: '订单管理', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 3000, 5160],
    rows: [
      new TableRow({ children: [makeHeaderCell('方法', 1200), makeHeaderCell('端点', 3000), makeHeaderCell('说明', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/orders', 3000), makeCell('订单列表（支持按状态筛选/搜索）', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/orders/[id]', 3000), makeCell('获取订单详情（含订单项和地址）', 5160)] }),
      new TableRow({ children: [makeCell('PUT', 1200), makeCell('/api/admin/orders/[id]', 3000), makeCell('更新订单状态/物流信息/发货信息', 5160)] }),
    ],
  }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: '询价单管理', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 3000, 5160],
    rows: [
      new TableRow({ children: [makeHeaderCell('方法', 1200), makeHeaderCell('端点', 3000), makeHeaderCell('说明', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/quotes', 3000), makeCell('询价单列表（支持按状态筛选/搜索）', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/quotes/[id]', 3000), makeCell('获取询价单详情（含产品详情）', 5160)] }),
      new TableRow({ children: [makeCell('PUT', 1200), makeCell('/api/admin/quotes/[id]', 3000), makeCell('回复报价：status、item prices、total、expiresAt、adminNotes', 5160)] }),
    ],
  }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: '供应商管理', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 3000, 5160],
    rows: [
      new TableRow({ children: [makeHeaderCell('方法', 1200), makeHeaderCell('端点', 3000), makeHeaderCell('说明', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/suppliers', 3000), makeCell('供应商列表（搜索/分页）', 5160)] }),
      new TableRow({ children: [makeCell('POST', 1200), makeCell('/api/admin/suppliers', 3000), makeCell('创建供应商', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/suppliers/[id]', 3000), makeCell('获取供应商详情（含产品数/采购单数）', 5160)] }),
      new TableRow({ children: [makeCell('PUT', 1200), makeCell('/api/admin/suppliers/[id]', 3000), makeCell('更新供应商字段', 5160)] }),
      new TableRow({ children: [makeCell('DELETE', 1200), makeCell('/api/admin/suppliers/[id]', 3000), makeCell('删除（若有产品或采购单则阻止删除）', 5160)] }),
    ],
  }),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第五章：前台功能说明 =====
children.push(
  h(HeadingLevel.HEADING_1, '五、前台功能说明'),
  gap(),

  h(HeadingLevel.HEADING_2, '5.1 首页（/）'),
  bullet('英雄横幅 — 品牌标语 + 渐变背景 + CTA 按钮（查看全部 / 发起询价）'),
  bullet('分类网格 — 6 列响应式网格，带 emoji 图标，链接到 /categories/[slug]'),
  bullet('精选产品 — 从 isFeatured=true 的产品中拉取，4 列网格展示产品卡片'),
  bullet('信任徽章 — 品质保证 / 全球配送 / 专家支持 / 竞争价格'),
  bullet('CTA 横幅 — 定制询价行动号召，带询价表单链接'),
  gap(),

  h(HeadingLevel.HEADING_2, '5.2 产品目录页（/products）'),
  bullet('服务端渲染的产品网格，分页（每页 24 个）'),
  bullet('排序选项：精选 / 最新 / 价格升序 / 价格降序'),
  bullet('响应式 2-4 列产品卡片布局'),
  bullet('每个卡片展示：图片、品牌、名称、SKU、价格、库存状态徽章'),
  gap(),

  h(HeadingLevel.HEADING_2, '5.3 产品详情页（/products/[slug]）'),
  bullet('图片画廊 — 主图 + 缩略图条带（最多 5 张）'),
  bullet('品牌名称链接、产品标题、SKU 徽章'),
  bullet('库存状态徽章（有货 / 缺货 / 货期待定）'),
  bullet('价格展示（ourPrice + 如有 listPrice 则显示划线价）'),
  bullet('关键规格表（来自 JSON specs 字段）'),
  bullet('完整规格参数表'),
  bullet('加入购物车：数量选择器 + 购物车按钮（Zustand 状态，localStorage 持久化）'),
  bullet('发起询价：将产品加入询价车（Zustand 状态）'),
  bullet('信任徽章行：安全支付 / 快速发货 / 退货政策 / 客户支持'),
  bullet('相关产品（同分类推荐）'),
  bullet('面包屑导航：首页 > 产品 > 分类 > SKU'),
  gap(),

  h(HeadingLevel.HEADING_2, '5.4 分类浏览页（/categories/[slug]）'),
  bullet('父分类 → 子分类网格（缩略图卡片）'),
  bullet('叶子分类 → 带排序选择器的产品网格'),
  bullet('面包屑导航'),
  bullet('服务端渲染（Next.js）'),
  gap(),

  h(HeadingLevel.HEADING_2, '5.5 品牌页（/brands, /brands/[slug]）'),
  bullet('/brands — 按字母分组的品牌列表'),
  bullet('/brands/[slug] — 品牌信息 + 筛选后的产品网格'),
  gap(),

  h(HeadingLevel.HEADING_2, '5.6 购物车（/cart）'),
  bullet('Zustand 状态，localStorage 持久化'),
  bullet('产品项：图片、名称、品牌、SKU、单价、数量调整器、小计'),
  bullet('数量修改实时更新小计和总计'),
  bullet('移除单个商品'),
  bullet('清空购物车'),
  bullet('结算按钮 → /checkout'),
  gap(),

  h(HeadingLevel.HEADING_2, '5.7 结账页（/checkout）'),
  bullet('购物车摘要（含运费估算）'),
  bullet('收货地址表单（React Hook Form + Zod 验证）'),
  bullet('Stripe 支付表单集成（Stripe Elements）'),
  bullet('订单备注'),
  bullet('提交后创建 Order 记录并跳转至 /account/orders/[id]'),
  gap(),

  h(HeadingLevel.HEADING_2, '5.8 询价车与询价（/quote）'),
  bullet('Zustand 状态，localStorage 持久化'),
  bullet('产品项：图片、名称、品牌、SKU、参考价格、数量'),
  bullet('客户联系信息表单（姓名、邮箱、公司、电话）'),
  bullet('询价留言'),
  bullet('提交后创建 Quote 记录，生成唯一询价单号（QUO-YYYY-NNNNN）'),
  gap(),

  h(HeadingLevel.HEADING_2, '5.9 用户账户中心（/account）'),
  bullet('订单历史（/account/orders） — 列表 + 详情查看'),
  bullet('询价单历史（/account/quotes） — 列表 + 详情查看 + 状态追踪'),
  bullet('收货地址簿（/account/addresses） — 添加/编辑/删除地址'),
  gap(),

  h(HeadingLevel.HEADING_2, '5.10 认证页（/auth）'),
  bullet('/auth/login — 账号密码登录 + Google OAuth 登录'),
  bullet('/auth/register — 新用户注册表单'),
  bullet('NextAuth 处理会话，支持 Google 第三方登录'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第六章：后台管理功能 =====
children.push(
  h(HeadingLevel.HEADING_1, '六、后台管理功能'),
  gap(),

  h(HeadingLevel.HEADING_2, '6.1 仪表盘（/admin）'),
  bullet('概览统计 — 产品总数、订单总数、待处理询价单、客户数'),
  bullet('快捷操作入口 — 产品管理、订单管理、询价单管理'),
  bullet('最近订单列表'),
  gap(),

  h(HeadingLevel.HEADING_2, '6.2 产品管理（/admin/products）'),
  bullet('产品列表 — 分页、搜索（SKU/名称）、按分类/品牌/状态筛选'),
  bullet('创建产品 — 表单含：SKU、名称、描述、分类、品牌、价格、库存、规格参数、图片上传'),
  bullet('编辑产品 — 修改任意字段'),
  bullet('删除产品 — 软删除（级联处理关联订单项）'),
  bullet('产品图片管理 — 上传/删除产品图片'),
  gap(),

  h(HeadingLevel.HEADING_2, '6.3 订单管理（/admin/orders）'),
  bullet('订单列表 — 按状态（pending/confirmed/shipped/delivered/cancelled）筛选 + 搜索'),
  bullet('订单详情 — 查看完整订单项、收货地址、财务汇总'),
  bullet('状态更新 — 改订单状态、填物流单号、填发货信息'),
  bullet('客户信息查看'),
  gap(),

  h(HeadingLevel.HEADING_2, '6.4 询价单管理（/admin/quotes）'),
  bullet('询价单列表 — 按状态（pending/reviewing/quoted/accepted/declined/expired）筛选'),
  bullet('询价单详情 — 查看客户联系信息、产品列表及数量'),
  bullet('报价回复 — 为每个产品设置报价单价，系统计算总价，设置有效期，附备注'),
  bullet('状态流转 — pending → reviewing → quoted → accepted/declined → expired'),
  gap(),

  h(HeadingLevel.HEADING_2, '6.5 供应商管理（/admin/suppliers）'),
  bullet('供应商列表 — 搜索、分页'),
  bullet('创建供应商 — 名称、联系人、电话、邮箱、地址、评级、备注'),
  bullet('编辑/删除供应商'),
  bullet('安全删除保护 — 有产品或采购单的供应商无法删除'),
  gap(),

  h(HeadingLevel.HEADING_2, '6.6 客户管理（/admin/customers）'),
  bullet('客户列表 — 显示姓名、邮箱、公司、注册时间'),
  bullet('查看客户详情'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第七章：操作手册 =====
children.push(
  h(HeadingLevel.HEADING_1, '七、操作手册'),
  gap(),

  h(HeadingLevel.HEADING_2, '7.1 管理员账号初始化'),
  p('首次部署时，需运行 seed 脚本创建管理员账号：'),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'npx prisma db push && node scripts/seed.js', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  p('默认管理员账号：admin@labpro.com / admin123（请在生产环境立即修改密码）'),
  gap(),

  h(HeadingLevel.HEADING_2, '7.2 产品导入流程'),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: '步骤 1：准备数据文件', bold: true, font: 'Microsoft YaHei', size: 22 })],
  }),
  bullet('准备 CSV 或 JSON 格式的产品数据文件'),
  bullet('必填字段：sku、name、category、brand、ourPrice'),
  bullet('可选字段：description、listPrice、costPrice、specs、stockQty、availability'),
  gap(),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: '步骤 2：运行导入脚本', bold: true, font: 'Microsoft YaHei', size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'node scripts/import-products.js --file ./data/products.csv', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  gap(),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: '步骤 3：验证导入结果', bold: true, font: 'Microsoft YaHei', size: 22 })],
  }),
  bullet('访问 /admin/products 检查产品是否正确导入'),
  bullet('抽查产品详情页是否正常显示'),
  gap(),

  h(HeadingLevel.HEADING_2, '7.3 询价报价处理流程'),
  bullet('客户提交询价 → 管理员在 /admin/quotes 收到新询价单（状态：pending）'),
  bullet('管理员点击查看详情 → 审核客户需求和产品数量'),
  bullet('管理员为每个产品填写报价单价 → 系统自动汇总总价'),
  bullet('设置报价有效期 → 填写内部备注 → 点击"发送报价"'),
  bullet('系统更新状态为 quoted → 客户收到报价通知邮件'),
  bullet('客户接受报价 → 系统更新状态为 accepted → 可转化为正式订单'),
  gap(),

  h(HeadingLevel.HEADING_2, '7.4 订单处理流程'),
  bullet('客户提交订单并完成支付 → Stripe webhook 触发 → Order 状态为 pending'),
  bullet('管理员在 /admin/orders 查看新订单'),
  bullet('确认订单 → 更新状态为 confirmed'),
  bullet('安排发货 → 填写物流信息 → 更新状态为 shipped'),
  bullet('客户确认收货 → 更新状态为 delivered'),
  bullet('如需退款 → 更新状态为 cancelled 并处理退款'),
  gap(),

  h(HeadingLevel.HEADING_2, '7.5 常见问题（FAQ）'),
  gap(),
  new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: 'Q1: 如何添加新的产品分类？', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  bullet('答：在 Prisma schema 中直接插入 Category 记录，或通过后台管理界面添加（若已实现表单）。'),
  gap(),
  new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: 'Q2: 询价单过期后会自动怎样处理？', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  bullet('答：管理员可手动将询价单状态更新为 expired。也可设置定时任务自动更新过期的询价单。'),
  gap(),
  new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: 'Q3: 如何启用 Google OAuth 登录？', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  bullet('答：在 Google Cloud Console 创建 OAuth 2.0 客户端，将 Client ID 和 Secret 配置到 .env 的 GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET。'),
  gap(),
  new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: 'Q4: 产品图片存储在哪里？', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  bullet('答：目前支持本地存储（/public/uploads/）和 AWS S3 存储。在 .env 中配置 USE_S3=true 和相关凭证即可切换到 S3。'),
  gap(),
  new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: 'Q5: 如何修改 Stripe 支付配置？', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  bullet('答：在 .env 中配置 STRIPE_SECRET_KEY 和 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY。测试环境使用 Stripe test keys，生产环境使用 live keys。'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第八章：部署说明 =====
children.push(
  h(HeadingLevel.HEADING_1, '八、部署说明'),
  gap(),

  h(HeadingLevel.HEADING_2, '8.1 环境要求'),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 6560],
    rows: [
      new TableRow({ children: [makeHeaderCell('项目', 2800), makeHeaderCell('要求', 6560)] }),
      new TableRow({ children: [makeCell('Node.js', 2800), makeCell('>= 18.0.0（推荐 20.x LTS）', 6560)] }),
      new TableRow({ children: [makeCell('PostgreSQL', 2800), makeCell('>= 14.0（推荐 18.x，支持 AWS RDS）', 6560, true)] }),
      new TableRow({ children: [makeCell('npm', 2800), makeCell('>= 9.0.0', 6560)] }),
      new TableRow({ children: [makeCell('内存', 2800), makeCell('最低 2GB RAM（生产环境建议 4GB+）', 6560, true)] }),
    ],
  }),
  gap(),

  h(HeadingLevel.HEADING_2, '8.2 环境变量配置'),
  p('在项目根目录创建 .env 文件，配置以下环境变量：'),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: '# 数据库', bold: true, font: 'Microsoft YaHei', size: 20 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'DATABASE_URL="postgresql://user:password@localhost:5432/labpro"', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: '# NextAuth', bold: true, font: 'Microsoft YaHei', size: 20 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'NEXTAUTH_URL="http://localhost:3000"', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'NEXTAUTH_SECRET="your-secret-key-here"', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: '# Stripe', bold: true, font: 'Microsoft YaHei', size: 20 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'STRIPE_SECRET_KEY="sk_test_..."', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: '# AWS S3（可选）', bold: true, font: 'Microsoft YaHei', size: 20 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'AWS_ACCESS_KEY_ID="..."', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'AWS_SECRET_ACCESS_KEY="..."', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'AWS_REGION="us-east-1"', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'AWS_S3_BUCKET="labpro-store"', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  gap(),

  h(HeadingLevel.HEADING_2, '8.3 部署步骤'),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: '步骤 1：安装依赖', bold: true, font: 'Microsoft YaHei', size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'npm install', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: '步骤 2：初始化数据库', bold: true, font: 'Microsoft YaHei', size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'npx prisma db push', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: '步骤 3：创建管理员账号', bold: true, font: 'Microsoft YaHei', size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'node scripts/seed.js', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: '步骤 4：启动开发服务器', bold: true, font: 'Microsoft YaHei', size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'npm run dev', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: '步骤 5：生产环境构建', bold: true, font: 'Microsoft YaHei', size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: 'npm run build && npm start', font: 'Courier New', size: 18, color: '2E75B6' })],
    indent: { left: 360 },
  }),
  gap(),

  h(HeadingLevel.HEADING_2, '8.4 AWS 部署建议'),
  bullet('前端部署 — Vercel（官方支持 Next.js）或 AWS Amplify'),
  bullet('数据库 — AWS RDS PostgreSQL（开启自动备份，配置安全组）'),
  bullet('文件存储 — AWS S3（启用版本控制和生命周期策略）'),
  bullet('邮件服务 — AWS SES（配置域名验证和 DKIM）'),
  bullet('CDN — AWS CloudFront（加速静态资源和图片分发）'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 附录 =====
children.push(
  h(HeadingLevel.HEADING_1, '附录'),
  gap(),

  h(HeadingLevel.HEADING_2, '附录 A：数据字典'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: '订单状态枚举值', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 3280, 3280],
    rows: [
      new TableRow({ children: [makeHeaderCell('状态值', 2800), makeHeaderCell('中文含义', 3280), makeHeaderCell('说明', 3280)] }),
      new TableRow({ children: [makeCell('pending', 2800), makeCell('待处理', 3280), makeCell('订单已创建，等待确认', 3280)] }),
      new TableRow({ children: [makeCell('confirmed', 2800), makeCell('已确认', 3280), makeCell('管理员已确认订单', 3280, true)] }),
      new TableRow({ children: [makeCell('shipped', 2800), makeCell('已发货', 3280), makeCell('已安排发货，填写物流信息', 3280)] }),
      new TableRow({ children: [makeCell('delivered', 2800), makeCell('已送达', 3280), makeCell('客户确认收货', 3280, true)] }),
      new TableRow({ children: [makeCell('cancelled', 2800), makeCell('已取消', 3280), makeCell('订单已取消，可退款', 3280)] }),
    ],
  }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: '询价单状态枚举值', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 3280, 3280],
    rows: [
      new TableRow({ children: [makeHeaderCell('状态值', 2800), makeHeaderCell('中文含义', 3280), makeHeaderCell('说明', 3280)] }),
      new TableRow({ children: [makeCell('pending', 2800), makeCell('待处理', 3280), makeCell('客户刚提交，等待审核', 3280)] }),
      new TableRow({ children: [makeCell('reviewing', 2800), makeCell('审核中', 3280), makeCell('管理员正在审核和处理', 3280, true)] }),
      new TableRow({ children: [makeCell('quoted', 2800), makeCell('已报价', 3280), makeCell('管理员已发送报价给客户', 3280)] }),
      new TableRow({ children: [makeCell('accepted', 2800), makeCell('已接受', 3280), makeCell('客户接受了报价', 3280, true)] }),
      new TableRow({ children: [makeCell('declined', 2800), makeCell('已拒绝', 3280), makeCell('客户拒绝了报价', 3280)] }),
      new TableRow({ children: [makeCell('expired', 2800), makeCell('已过期', 3280), makeCell('报价超过有效期', 3280, true)] }),
    ],
  }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: '库存状态枚举值', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 3280, 3280],
    rows: [
      new TableRow({ children: [makeHeaderCell('状态值', 2800), makeHeaderCell('中文含义', 3280), makeHeaderCell('说明', 3280)] }),
      new TableRow({ children: [makeCell('in_stock', 2800), makeCell('有货', 3280), makeCell('有库存，可直接发货', 3280)] }),
      new TableRow({ children: [makeCell('out_of_stock', 2800), makeCell('缺货', 3280), makeCell('无库存，需等待补货', 3280, true)] }),
      new TableRow({ children: [makeCell('lead_time', 2800), makeCell('货期待定', 3280), makeCell('需确认交货周期', 3280)] }),
    ],
  }),
  gap(),
  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: '用户角色枚举值', bold: true, font: 'Microsoft YaHei', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 3280, 3280],
    rows: [
      new TableRow({ children: [makeHeaderCell('角色值', 2800), makeHeaderCell('中文含义', 3280), makeHeaderCell('说明', 3280)] }),
      new TableRow({ children: [makeCell('customer', 2800), makeCell('客户', 3280), makeCell('普通注册用户', 3280)] }),
      new TableRow({ children: [makeCell('admin', 2800), makeCell('管理员', 3280), makeCell('拥有全部管理权限', 3280, true)] }),
      new TableRow({ children: [makeCell('staff', 2800), makeCell('员工', 3280), makeCell('部分管理权限', 3280)] }),
    ],
  }),
  gap(),

  h(HeadingLevel.HEADING_2, '附录 B：修订历史'),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1600, 2000, 5760],
    rows: [
      new TableRow({ children: [makeHeaderCell('版本', 1600), makeHeaderCell('日期', 2000), makeHeaderCell('更新内容', 5760)] }),
      new TableRow({ children: [makeCell('v1.0', 1600), makeCell('2026-04-22', 2000), makeCell('初始版本，包含完整产品文档、功能说明和技术架构', 5760)] }),
    ],
  }),
  gap(),
  gap(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
    children: [new TextRun({ text: '— 文档结束 —', font: 'Microsoft YaHei', size: 20, color: '9CA3AF' })],
  }),
);

// ===== 生成文档 =====
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: 720, hanging: 360 } },
            run: { font: 'Arial', size: 22 },
          },
        }],
      },
      {
        reference: 'bullets2',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '○',
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: 1080, hanging: 360 } },
            run: { font: 'Arial', size: 22 },
          },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: 'LabProGlobal 产品文档 v1.0', font: 'Microsoft YaHei', size: 18, color: '9CA3AF' })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: '第 ', font: 'Microsoft YaHei', size: 18, color: '9CA3AF' }),
            new TextRun({ children: [PageNumber.CURRENT], font: 'Microsoft YaHei', size: 18, color: '9CA3AF' }),
            new TextRun({ text: ' 页', font: 'Microsoft YaHei', size: 18, color: '9CA3AF' }),
          ],
        })],
      }),
    },
    children,
  }],
});

// 确保输出目录存在
const outputDir = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成文件
const outputPath = path.join(outputDir, 'LabProGlobal-产品文档-v1.0.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ 文档生成成功：${outputPath}`);
  console.log(`📄 文件大小：${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
}).catch(err => {
  console.error('❌ 生成失败：', err);
  process.exit(1);
});
