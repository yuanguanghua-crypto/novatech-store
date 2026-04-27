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
function h(level, text, bookmark) {
  return new Paragraph({
    heading: level,
    children: bookmark
      ? [new TextRun({ text, bold: true, font: 'Arial', size: level === HeadingLevel.HEADING_1 ? 36 : level === HeadingLevel.HEADING_2 ? 28 : 24 })]
      : [new TextRun({ text, bold: true, font: 'Arial', size: level === HeadingLevel.HEADING_1 ? 36 : level === HeadingLevel.HEADING_2 ? 28 : 24 })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: 'Arial', size: 22, ...opts })],
  });
}

function bullet(text, bold = false) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: 'Arial', size: 22, bold })],
  });
}

function bullet2(text) {
  return new Paragraph({
    numbering: { reference: 'bullets2', level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: 'Arial', size: 22 })],
  });
}

function code(text) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, font: 'Courier New', size: 18, color: '2E75B6', background: 'F3F4F6' })],
    indent: { left: 360 },
  });
}

function gap() {
  return new Paragraph({ spacing: { after: 80 }, children: [new TextRun('')] });
}

function hRule() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D1D5DB', space: 1 } },
    spacing: { after: 200 },
    children: [new TextRun('')],
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    children: [new TextRun({ text: '─────────────────────────────────────────', color: 'D1D5DB', font: 'Courier New', size: 16 })],
  });
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
      children: [new TextRun({ text, bold: true, color: 'FFFFFF', font: 'Arial', size: 20 })],
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
      children: [new TextRun({ text, font: 'Arial', size: 20 })],
    })],
  });
}

function makeCellBold(text, width, shade = false) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: shade ? 'F9FAFB' : 'FFFFFF', type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, font: 'Arial', size: 20 })],
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
    children: [new TextRun({ text: 'B2B Industrial E-Commerce Platform', font: 'Arial', size: 36, color: '4B5563' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: 'Product Documentation  ·  v1.0', font: 'Arial', size: 28, color: '9CA3AF' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: 'Complete Product Documentation', bold: true, font: 'Arial', size: 32 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: '功能点说明 · 交互说明 · 技术架构 · 后台管理 · 操作手册', font: 'Arial', size: 22, color: '6B7280' })],
  }),
  gap(), gap(), gap(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: 'Last Updated: 2026-04-22', font: 'Arial', size: 20, color: '9CA3AF' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Internal Use Only  ·  Confidential', font: 'Arial', size: 20, color: '9CA3AF' })],
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 目录 =====
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 0, after: 240 },
    children: [new TextRun({ text: 'Table of Contents', font: 'Arial', size: 36 })],
  }),
  new TableOfContents('', { hyperlink: true, headingStyleRange: '1-2' }),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第一章：产品概述 =====
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: '1. Product Overview', font: 'Arial', size: 36 })],
  }),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '1.1 Product Description', font: 'Arial', size: 28 })] }),
  p('LabProGlobal is a B2B e-commerce platform focused on industrial and laboratory equipment, developed using Next.js, Prisma, and PostgreSQL. The platform enables global sourcing of laboratory supplies from Chinese manufacturers, with a particular emphasis on chemical metering pumps, water quality analyzers, and precision instruments.'),
  gap(),
  p('Core product catalog sourced from Novatech-USA includes 15,259+ SKUs across 52 brands (Pulsafeeder, LMI, Lovibond, United Scientific, etc.) spanning 140 subcategories.'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '1.2 Key Features', font: 'Arial', size: 28 })] }),
  bullet('B2B Product Catalog — 15,000+ industrial/lab products with full specs, images, and pricing'),
  bullet('Smart Quote System — Customers can request custom quotes for individual or bulk items'),
  bullet('Admin Panel — Full CRUD operations for products, orders, quotes, and suppliers'),
  bullet('Dual Purchase Model — Supports both direct online purchase and quote-based procurement'),
  bullet('Multi-Brand Browse — Filter products by 52 brands and 140+ subcategories'),
  bullet('Responsive Design — Mobile-friendly interface for professionals on the go'),
  bullet('Session-Based Auth — NextAuth with credentials and Google OAuth support'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '1.3 Target Users', font: 'Arial', size: 28 })] }),
  bullet('B2B Customers — Laboratories, chemical plants, water treatment facilities, research institutions'),
  bullet('Platform Administrators — Internal team managing catalog, orders, and supplier relationships'),
  bullet('Procurement Officers — Using quote system for bulk orders and OEM requirements'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '1.4 System Architecture', font: 'Arial', size: 28 })] }),
  p('The platform is built on a full-stack architecture with clear separation between frontend (Next.js App Router), backend (Next.js API Routes), and database (PostgreSQL via Prisma ORM).'),

  // Tech stack table
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2200, 7160],
    rows: [
      new TableRow({ children: [makeHeaderCell('Category', 2200), makeHeaderCell('Technology', 7160)] }),
      new TableRow({ children: [makeCell('Framework', 2200), makeCell('Next.js 14.2.3 (App Router, React 18)', 7160)] }),
      new TableRow({ children: [makeCell('Database', 2200), makeCell('PostgreSQL 18 (AWS RDS compatible)', 7160, true)] }),
      new TableRow({ children: [makeCell('ORM', 2200), makeCell('Prisma 5.14.0', 7160)] }),
      new TableRow({ children: [makeCell('Authentication', 2200), makeCell('NextAuth 4.24.7 (Credentials + Google OAuth)', 7160, true)] }),
      new TableRow({ children: [makeCell('State Management', 2200), makeCell('Zustand 4.5.2 (Cart + Quote state, persisted to localStorage)', 7160)] }),
      new TableRow({ children: [makeCell('Payment', 2200), makeCell('Stripe 15.12.0 (Stripe.js + React Stripe)', 7160, true)] }),
      new TableRow({ children: [makeCell('Form Validation', 2200), makeCell('React Hook Form + Zod 3.23.8', 7160)] }),
      new TableRow({ children: [makeCell('Styling', 2200), makeCell('Tailwind CSS + Radix UI (Dialog, Tabs, Select, etc.)', 7160)] }),
      new TableRow({ children: [makeCell('Email', 2200), makeCell('Nodemailer 7 + AWS SES / SMTP', 7160, true)] }),
      new TableRow({ children: [makeCell('Storage', 2200), makeCell('AWS S3 (via @aws-sdk/client-s3)', 7160)] }),
      new TableRow({ children: [makeCell('Runtime', 2200), makeCell('Node.js (E:/Program Files/nodejs/node.exe)', 7160, true)] }),
    ],
  }),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第二章：目录结构 =====
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '2. Project Structure', font: 'Arial', size: 36 })] }),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '2.1 Directory Layout', font: 'Arial', size: 28 })] }),
  code('novatech-store/                   # Project root'),
  code('├── app/                         # Next.js App Router'),
  code('│   ├── (store)/                  # Store front (public)'),
  code('│   │   ├── page.tsx              # Homepage'),
  code('│   │   ├── products/             # Product listing & detail'),
  code('│   │   ├── categories/           # Category browse'),
  code('│   │   ├── brands/               # Brand listing & detail'),
  code('│   │   ├── cart/                # Shopping cart'),
  code('│   │   ├── checkout/             # Checkout page'),
  code('│   │   ├── quote/                # Quote request form'),
  code('│   │   ├── search/               # Search results'),
  code('│   │   ├── account/              # Customer account hub'),
  code('│   │   │   ├── orders/           # Order history'),
  code('│   │   │   ├── quotes/            # Quote history'),
  code('│   │   │   └── addresses/         # Address book'),
  code('│   │   ├── auth/                 # Login & Register'),
  code('│   │   └── [privacy|terms|support|shipping|returns]/'),
  code('│   ├── admin/                    # Admin panel (auth-protected)'),
  code('│   │   ├── page.tsx              # Dashboard'),
  code('│   │   ├── products/             # Product CRUD'),
  code('│   │   ├── orders/               # Order management'),
  code('│   │   ├── quotes/               # Quote management'),
  code('│   │   ├── customers/            # Customer list'),
  code('│   │   ├── suppliers/            # Supplier management'),
  code('│   │   ├── analytics/            # Data analytics (placeholder)'),
  code('│   │   └── settings/             # System settings (placeholder)'),
  code('│   └── api/                      # API routes'),
  code('│       ├── admin/products/       # Admin product CRUD'),
  code('│       ├── admin/orders/         # Admin order management'),
  code('│       ├── admin/quotes/         # Admin quote + pricing'),
  code('│       ├── admin/suppliers/     # Admin supplier CRUD'),
  code('│       ├── products/             # Public product listing'),
  code('│       ├── categories/           # Category listing'),
  code('│       ├── brands/               # Brand listing'),
  code('│       ├── quotes/               # Customer quote submission'),
  code('│       ├── search/               # Product search'),
  code('│       ├── auth/[...nextauth]/   # NextAuth handler'),
  code('│       └── webhooks/stripe/      # Stripe payment webhooks'),
  code('├── components/'),
  code('│   ├── admin/                    # Admin-specific components'),
  code('│   │   ├── sidebar.tsx           # Admin navigation sidebar'),
  code('│   │   ├── product-form.tsx     # Product create/edit form'),
  code('│   │   ├── order-detail-client.tsx'),
  code('│   │   ├── quote-detail-client.tsx'),
  code('│   │   └── supplier-list-client.tsx'),
  code('│   ├── store/                    # Store front components'),
  code('│   │   ├── navbar.tsx            # Top navigation'),
  code('│   │   ├── footer.tsx            # Page footer'),
  code('│   │   ├── product-grid.tsx      # Product card grid'),
  code('│   │   ├── add-to-cart-button.tsx'),
  code('│   │   ├── add-to-quote-button.tsx'),
  code('│   │   └── sort-selector.tsx      # Sort dropdown'),
  code('│   └── providers.tsx             # React Query + Session provider'),
  code('├── hooks/'),
  code('│   ├── use-cart.ts               # Zustand cart store (localStorage)'),
  code('│   └── use-quote.ts              # Zustand quote store (localStorage)'),
  code('├── lib/'),
  code('│   ├── auth.ts                  # NextAuth configuration'),
  code('│   ├── prisma.ts                 # Prisma client singleton'),
  code('│   ├── utils.ts                  # Helper functions'),
  code('│   └── email/transporter.ts       # Nodemailer email transport'),
  code('├── prisma/'),
  code('│   └── schema.prisma             # Full data model definition'),
  code('└── scripts/'),
  code('    ├── seed.js                   # Admin account seeding'),
  code('    ├── test-admin.js             # Automated test suite'),
  code('    └── import-products.js        # Novatech data import'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第三章：数据模型 =====
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '3. Data Models', font: 'Arial', size: 36 })] }),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.1 Entity Relationship Overview', font: 'Arial', size: 28 })] }),
  p('The database schema defines 17 models across 5 domains: Product Catalog, Supplier Chain, Users & Auth, Orders, and Quotes.'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.2 Product Catalog Models', font: 'Arial', size: 28 })] }),

  // Category table
  new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: 'Category (hierarchical product taxonomy)', bold: true, font: 'Arial', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 2000, 4560],
    rows: [
      new TableRow({ children: [makeHeaderCell('Field', 2800), makeHeaderCell('Type', 2000), makeHeaderCell('Description', 4560)] }),
      new TableRow({ children: [makeCell('id', 2800), makeCell('String (cuid)', 2000), makeCell('Primary key', 4560)] }),
      new TableRow({ children: [makeCell('name', 2800), makeCell('String (unique)', 2000), makeCell('Category name', 4560, true)] }),
      new TableRow({ children: [makeCell('slug', 2800), makeCell('String (unique)', 2000), makeCell('URL-friendly identifier', 4560)] }),
      new TableRow({ children: [makeCell('parentId', 2800), makeCell('String? (FK)', 2000), makeCell('Self-referencing parent category', 4560, true)] }),
      new TableRow({ children: [makeCell('imageUrl', 2800), makeCell('String?', 2000), makeCell('Category banner image', 4560)] }),
      new TableRow({ children: [makeCell('sortOrder', 2800), makeCell('Int', 2000), makeCell('Display order (default: 0)', 4560)] }),
      new TableRow({ children: [makeCell('isActive', 2800), makeCell('Boolean', 2000), makeCell('Soft visibility flag', 4560)] }),
    ],
  }),
  gap(),

  // Brand table
  new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: 'Brand (manufacturer/supplier branding)', bold: true, font: 'Arial', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 2000, 4560],
    rows: [
      new TableRow({ children: [makeHeaderCell('Field', 2800), makeHeaderCell('Type', 2000), makeHeaderCell('Description', 4560)] }),
      new TableRow({ children: [makeCell('id', 2800), makeCell('String (cuid)', 2000), makeCell('Primary key', 4560)] }),
      new TableRow({ children: [makeCell('name', 2800), makeCell('String (unique)', 2000), makeCell('Brand name (e.g., Pulsafeeder)', 4560, true)] }),
      new TableRow({ children: [makeCell('slug', 2800), makeCell('String (unique)', 2000), makeCell('URL identifier', 4560)] }),
      new TableRow({ children: [makeCell('logoUrl', 2800), makeCell('String?', 2000), makeCell('Brand logo image URL', 4560)] }),
      new TableRow({ children: [makeCell('country', 2800), makeCell('String', 2000), makeCell('Country of origin (default: USA)', 4560, true)] }),
      new TableRow({ children: [makeCell('isActive', 2800), makeCell('Boolean', 2000), makeCell('Visibility flag', 4560)] }),
    ],
  }),
  gap(),

  // Product table
  new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: 'Product (core inventory item)', bold: true, font: 'Arial', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 2000, 4560],
    rows: [
      new TableRow({ children: [makeHeaderCell('Field', 2800), makeHeaderCell('Type', 2000), makeHeaderCell('Description', 4560)] }),
      new TableRow({ children: [makeCell('id', 2800), makeCell('String (cuid)', 2000), makeCell('Primary key', 4560)] }),
      new TableRow({ children: [makeCell('sku', 2800), makeCell('String (unique)', 2000), makeCell('Stock Keeping Unit — unique product code', 4560, true)] }),
      new TableRow({ children: [makeCell('internalId', 2800), makeCell('String? (unique)', 2000), makeCell('Novatech original ID', 4560)] }),
      new TableRow({ children: [makeCell('name', 2800), makeCell('String', 2000), makeCell('Product display name', 4560, true)] }),
      new TableRow({ children: [makeCell('slug', 2800), makeCell('String (unique)', 2000), makeCell('URL-friendly product identifier', 4560)] }),
      new TableRow({ children: [makeCell('description', 2800), makeCell('String? (Text)', 2000), makeCell('Full product description', 4560)] }),
      new TableRow({ children: [makeCell('categoryId', 2800), makeCell('String (FK)', 2000), makeCell('References Category.id', 4560, true)] }),
      new TableRow({ children: [makeCell('brandId', 2800), makeCell('String? (FK)', 2000), makeCell('References Brand.id', 4560)] }),
      new TableRow({ children: [makeCell('ourPrice', 2800), makeCell('Decimal(10,2)', 2000), makeCell('Displayed selling price in USD', 4560, true)] }),
      new TableRow({ children: [makeCell('listPrice', 2800), makeCell('Decimal?(10,2)', 2000), makeCell('MSRP (for discount display)', 4560)] }),
      new TableRow({ children: [makeCell('costPrice', 2800), makeCell('Decimal?(10,2)', 2000), makeCell('Internal procurement cost (hidden)', 4560)] }),
      new TableRow({ children: [makeCell('availability', 2800), makeCell('String', 2000), makeCell('in_stock / out_of_stock / lead_time', 4560, true)] }),
      new TableRow({ children: [makeCell('stockQty', 2800), makeCell('Int', 2000), makeCell('Available inventory count', 4560)] }),
      new TableRow({ children: [makeCell('specs', 2800), makeCell('Json?', 2000), makeCell('Flexible spec key-value pairs (JSON)', 4560)] }),
      new TableRow({ children: [makeCell('isActive', 2800), makeCell('Boolean', 2000), makeCell('Soft delete / visibility', 4560, true)] }),
      new TableRow({ children: [makeCell('isFeatured', 2800), makeCell('Boolean', 2000), makeCell('Show on homepage', 4560)] }),
    ],
  }),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.3 Supplier Chain Models', font: 'Arial', size: 28 })] }),
  bullet('Supplier — Chinese manufacturers/suppliers with contact info, rating (1-5 stars), and location'),
  bullet('ProductSupplier — Many-to-many junction with cost price, MOQ, lead time, and supplier SKU'),
  bullet('PurchaseOrder — Internal procurement orders to suppliers (draft/sent/confirmed/shipped/received)'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.4 User & Authentication Models', font: 'Arial', size: 28 })] }),
  bullet('User — email (unique), name, role (customer/admin/staff), company, passwordHash (bcrypt)'),
  bullet('Account — NextAuth OAuth account linkage (Google provider)'),
  bullet('Session — NextAuth session records'),
  bullet('VerificationToken — NextAuth email verification tokens'),
  bullet('Address — Customer shipping/billing addresses'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.5 Order & Quote Models', font: 'Arial', size: 28 })] }),
  bullet('Order — Order number (unique), customer snapshot, shipping/billing address (JSON), financial totals, status workflow'),
  bullet('OrderItem — Product snapshot per order (sku, name, imageUrl, unitPrice, quantity, total)'),
  bullet('Quote — Quote number (unique), customer contact info, 6-state workflow (pending/reviewing/quoted/accepted/declined/expired)'),
  bullet('QuoteItem — Product reference + quantity + optional admin-set unitPrice'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第四章：API 接口文档 =====
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '4. API Documentation', font: 'Arial', size: 36 })] }),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '4.1 Public APIs (No Auth Required)', font: 'Arial', size: 28 })] }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'GET /api/products — Public Product Listing', bold: true, font: 'Arial', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 7360],
    rows: [
      new TableRow({ children: [makeHeaderCell('Parameter', 2000), makeHeaderCell('Description', 7360)] }),
      new TableRow({ children: [makeCell('limit', 2000), makeCell('Max results (default: 12, max: 100)', 7360)] }),
      new TableRow({ children: [makeCell('offset', 2000), makeCell('Pagination offset (default: 0)', 7360)] }),
      new TableRow({ children: [makeCell('search', 2000), makeCell('Keyword search across name, SKU, description, specsFlat', 7360)] }),
      new TableRow({ children: [makeCell('category', 2000), makeCell('Category slug filter', 7360)] }),
      new TableRow({ children: [makeCell('brand', 2000), makeCell('Brand slug filter', 7360)] }),
      new TableRow({ children: [makeCell('sort', 2000), makeCell('Sort: name / price_asc / price_desc / newest', 7360)] }),
      new TableRow({ children: [makeCell('minPrice / maxPrice', 2000), makeCell('Price range filter', 7360)] }),
    ],
  }),
  p('Response: { products[], total, offset, limit, hasMore }', { color: '2E75B6' }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'GET /api/categories — Category Tree', bold: true, font: 'Arial', size: 22 })] }),
  bullet('?parent=true → Returns top-level categories with children (for navbar dropdowns)'),
  bullet('No param → Returns all active categories with product counts'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'GET /api/brands — Brand Listing', bold: true, font: 'Arial', size: 22 })] }),
  bullet('Returns all active brands ordered alphabetically'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'GET /api/search — Product Search', bold: true, font: 'Arial', size: 22 })] }),
  bullet('Parameters: q (query), page, limit (default: 24)'),
  bullet('Searches: SKU, name, description, specsFlat, brand name'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'POST /api/quotes — Submit Quote Request (No Auth)', bold: true, font: 'Arial', size: 22 })] }),
  bullet('Body: { customerEmail, customerName, customerCompany?, customerPhone?, message?, items: [{productId, quantity}] }'),
  bullet('Returns: { success: true, quoteNumber: "QUO-2604-00001" }'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '4.2 Admin APIs (Auth Required — role: admin)', font: 'Arial', size: 28 })] }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Product Management', bold: true, font: 'Arial', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 3000, 5160],
    rows: [
      new TableRow({ children: [makeHeaderCell('Method', 1200), makeHeaderCell('Endpoint', 3000), makeHeaderCell('Description', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/products', 3000), makeCell('List with search/filter/pagination', 5160)] }),
      new TableRow({ children: [makeCell('POST', 1200), makeCell('/api/admin/products', 3000), makeCell('Create product (Zod validated)', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/products/[id]', 3000), makeCell('Get single product detail', 5160)] }),
      new TableRow({ children: [makeCell('PUT', 1200), makeCell('/api/admin/products/[id]', 3000), makeCell('Update product fields', 5160)] }),
      new TableRow({ children: [makeCell('DELETE', 1200), makeCell('/api/admin/products/[id]', 3000), makeCell('Delete product (cascade OrderItems)', 5160)] }),
      new TableRow({ children: [makeCell('POST', 1200), makeCell('/api/admin/products/[id]/images', 3000), makeCell('Add/manage product images', 5160)] }),
    ],
  }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Order Management', bold: true, font: 'Arial', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 3000, 5160],
    rows: [
      new TableRow({ children: [makeHeaderCell('Method', 1200), makeHeaderCell('Endpoint', 3000), makeHeaderCell('Description', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/orders', 3000), makeCell('List orders (filter by status/search)', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/orders/[id]', 3000), makeCell('Get order with items and address', 5160)] }),
      new TableRow({ children: [makeCell('PUT', 1200), makeCell('/api/admin/orders/[id]', 3000), makeCell('Update status/tracking/shipping info', 5160)] }),
    ],
  }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Quote Management', bold: true, font: 'Arial', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 3000, 5160],
    rows: [
      new TableRow({ children: [makeHeaderCell('Method', 1200), makeHeaderCell('Endpoint', 3000), makeHeaderCell('Description', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/quotes', 3000), makeCell('List quotes (filter by status/search)', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/quotes/[id]', 3000), makeCell('Get quote with items, product details', 5160)] }),
      new TableRow({ children: [makeCell('PUT', 1200), makeCell('/api/admin/quotes/[id]', 3000), makeCell('Reply with pricing: status, item prices, total, expiresAt, adminNotes', 5160)] }),
    ],
  }),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Supplier Management', bold: true, font: 'Arial', size: 22 })] }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 3000, 5160],
    rows: [
      new TableRow({ children: [makeHeaderCell('Method', 1200), makeHeaderCell('Endpoint', 3000), makeHeaderCell('Description', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/suppliers', 3000), makeCell('List suppliers (search/pagination)', 5160)] }),
      new TableRow({ children: [makeCell('POST', 1200), makeCell('/api/admin/suppliers', 3000), makeCell('Create supplier', 5160)] }),
      new TableRow({ children: [makeCell('GET', 1200), makeCell('/api/admin/suppliers/[id]', 3000), makeCell('Get supplier with product/PO counts', 5160)] }),
      new TableRow({ children: [makeCell('PUT', 1200), makeCell('/api/admin/suppliers/[id]', 3000), makeCell('Update supplier fields', 5160)] }),
      new TableRow({ children: [makeCell('DELETE', 1200), makeCell('/api/admin/suppliers/[id]', 3000), makeCell('Delete (blocked if has products or POs)', 5160)] }),
    ],
  }),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第五章：前台功能说明 =====
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '5. Store Front Features', font: 'Arial', size: 36 })] }),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.1 Homepage (/)', font: 'Arial', size: 28 })] }),
  bullet('Hero Banner — Brand headline with gradient background, CTA buttons (Shop All / Request Quote)'),
  bullet('Category Grid — 6-col responsive grid with emoji icons, links to /categories/[slug]'),
  bullet('Featured Products — Pulled from isFeatured=true products, 4-col grid with product cards'),
  bullet('Trust Badges — Quality Guaranteed / Worldwide Shipping / Expert Support / Competitive Pricing'),
  bullet('CTA Banner — Custom quote call-to-action with form link'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.2 Product Catalog (/products)', font: 'Arial', size: 28 })] }),
  bullet('Server-side rendered product grid with pagination (24 per page)'),
  bullet('Sort by: Featured / Newest / Price Low-High / Price High-Low'),
  bullet('Responsive 2-4 column product card layout'),
  bullet('Each card shows: image, brand, name, SKU, price, availability badge'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.3 Product Detail (/products/[slug])', font: 'Arial', size: 28 })] }),
  bullet('Image gallery with primary image + thumbnail strip (up to 5)'),
  bullet('Brand name link, product title, SKU badge'),
  bullet('Availability badge (In Stock / Out of Stock / Lead Time)'),
  bullet('Price display (ourPrice + strikethrough listPrice if available)'),
  bullet('Key specifications table (from JSON specs field)'),
  bullet('Full specifications table'),
  bullet('Add to Cart: quantity selector + cart button (Zustand state, localStorage persisted)'),
  bullet('Request Quote: adds to quote cart (Zustand state)'),
  bullet('Trust badges row: Secure Payment / Fast Shipping / Returns / Support'),
  bullet('Related products from same category'),
  bullet('Breadcrumb: Home > Products > Category > SKU'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.4 Category Browse (/categories/[slug])', font: 'Arial', size: 28 })] }),
  bullet('Parent categories → subcategory grid (thumbnail cards)'),
  bullet('Leaf categories → product grid with sort selector'),
  bullet('Breadcrumb navigation'),
  bullet('Server-side rendering with Next.js'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.5 Brand Pages (/brands, /brands/[slug])', font: 'Arial', size: 28 })] }),
  bullet('/brands — Alphabetical brand listing with letter grouping'),
  bullet('/brands/[slug] — Brand info + filtered product grid'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.6 Search (/search)', font: 'Arial', size: 28 })] }),
  bullet('Global search bar in navbar (Enter key or search button)'),
  bullet('Search API: SKU, name, description, specsFlat, brand name'),
  bullet('Paginated product grid results'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.7 Shopping Cart (/cart)', font: 'Arial', size: 28 })] }),
  bullet('State managed by Zustand (persisted to localStorage key: cart-storage)'),
  bullet('CartItem: { productId, sku, name, price, imageUrl, quantity }'),
  bullet('Operations: Add, Remove, Update quantity, Clear cart'),
  bullet('Live total calculation'),
  bullet('Checkout CTA → /checkout (Stripe integration placeholder)'),
  bullet('Request Quote CTA → /quote'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.8 Quote System (/quote)', font: 'Arial', size: 28 })] }),
  bullet('Two input modes: from "Add to Quote" buttons, or from cart items'),
  bullet('Cart items shown with checkbox for selective quote submission'),
  bullet('Quote form: customerName, customerEmail, customerCompany, customerPhone, message'),
  bullet('Quote number generated: QUO-YYMM-XXXXX (via generateQuoteNumber())'),
  bullet('Quote submission via POST /api/quotes (no auth required for guests)'),
  bullet('Success confirmation with quote number'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.9 Customer Account (/account)', font: 'Arial', size: 28 })] }),
  bullet('Requires login (redirects to /auth/login with callbackUrl)'),
  bullet('Dashboard hub with: Orders, Quotes, Profile cards'),
  bullet('/account/orders — Order history list'),
  bullet('/account/quotes — Quote history list'),
  bullet('/account/addresses — Address book management'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.10 Authentication (/auth)', font: 'Arial', size: 28 })] }),
  bullet('/auth/login — Email + password form (NextAuth credentials provider)'),
  bullet('/auth/register — Account creation (demo mode: disabled, needs OAuth setup)'),
  bullet('Google OAuth provider configured (requires GOOGLE_CLIENT_ID/SECRET in .env.local)'),
  bullet('Session strategy: JWT'),
  bullet('Role-based access: customer / admin / staff'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第六章：后台管理功能 =====
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '6. Admin Panel Features', font: 'Arial', size: 36 })] }),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '6.1 Dashboard (/admin)', font: 'Arial', size: 28 })] }),
  p('Server-side rendered dashboard with 4 stat cards and recent orders table.'),
  bullet('Stat Cards: Total Products / Total Orders / Quote Requests / Customers'),
  bullet('Alert Cards: Pending Orders (yellow) / Quote Requests (blue) — click to navigate'),
  bullet('Recent Orders Table: order number, customer, items, total, status badge'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '6.2 Product Management (/admin/products)', font: 'Arial', size: 28 })] }),
  bullet('Product list table: image thumbnail, SKU, name, brand, category, price, status, actions'),
  bullet('Search by name, SKU, or description'),
  bullet('Pagination: 30 per page'),
  bullet('Actions: Edit → /admin/products/[id]/edit, Delete (only if no order history)'),
  gap(),
  p('Add Product (/admin/products/new):', { bold: true }),
  bullet('Unified ProductForm component (mode: create)'),
  bullet('Fields: SKU (unique), name, description, category (dropdown), brand (dropdown), ourPrice, listPrice, costPrice, availability, stockQty, weight, dimensions, specs JSON, sourceUrl'),
  bullet('Image management: add by URL, set primary, remove'),
  bullet('Status toggles: isActive, isFeatured, isNew'),
  bullet('Slug auto-generated from name with collision detection'),
  gap(),
  p('Edit Product (/admin/products/[id]/edit):', { bold: true }),
  bullet('Same form in mode: edit, pre-populated with existing data'),
  bullet('All fields editable, images can be added/removed'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '6.3 Order Management (/admin/orders)', font: 'Arial', size: 28 })] }),
  bullet('Order list table: order number, customer, date, items, total, status, payment status'),
  bullet('Filter by status: All / Pending / Paid / Processing / Shipped / Delivered / Cancelled'),
  bullet('Search by order number, customer name, or email'),
  bullet('Pagination: 30 per page'),
  bullet('Click row to open Order Detail'),
  gap(),
  p('Order Detail (/admin/orders/[id]):', { bold: true }),
  bullet('Header: order number, date, customer info'),
  bullet('Items table: SKU, name, quantity, unit price, total'),
  bullet('Address section: shipping address JSON rendered'),
  bullet('Status Update: 8-state workflow buttons (pending → paid → processing → shipped → delivered)'),
  bullet('Payment Info: payment status, method, Stripe ID'),
  bullet('Shipping Info: carrier, tracking number, shipped/delivered timestamps'),
  bullet('Notes field'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '6.4 Quote Management (/admin/quotes)', font: 'Arial', size: 28 })] }),
  bullet('Quote list table: quote number, customer, date, item count, status, quoted price'),
  bullet('Status filter tabs: All / Pending / Reviewing / Quoted / Accepted / Declined'),
  bullet('Search by quote number, customer name, email, company'),
  bullet('Click row to open Quote Detail'),
  gap(),
  p('Quote Detail (/admin/quotes/[id]) — Tabbed Interface:', { bold: true }),
  bullet('View Tab: Customer info, message, item list with product thumbnails, status badge'),
  bullet('Reply Tab (admin only): Per-item unit price fields → auto-calculated total quote price, overall status change, expiry date, internal admin notes'),
  bullet('Reply workflow: pending → reviewing → quoted / accepted / declined / expired'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '6.5 Supplier Management (/admin/suppliers)', font: 'Arial', size: 28 })] }),
  bullet('Supplier list: name, contact, email, phone, city, rating (stars), active status, product/PO counts'),
  bullet('Add Supplier button → modal form'),
  bullet('Edit Supplier button → same modal pre-populated'),
  bullet('Delete: Blocked if supplier has associated products or purchase orders (data integrity protection)'),
  bullet('Active/Inactive toggle (soft disable)'),
  gap(),
  p('Supplier Fields:', { bold: true }),
  bullet('name (required), nameEn (English name), contactName, email, phone, wechat'),
  bullet('address, city, province, country (default: China), website'),
  bullet('rating (1-5 stars), notes, isActive'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '6.6 Customer Management (/admin/customers)', font: 'Arial', size: 28 })] }),
  bullet('Placeholder page — lists registered customers'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '6.7 Analytics (/admin/analytics)', font: 'Arial', size: 28 })] }),
  bullet('4 stat cards: Revenue / Orders / Avg Order Value / Conversion Rate'),
  bullet('4 chart placeholders: Sales Trend, Top Categories, Traffic Sources, Customer Map'),
  bullet('Roadmap: Google Analytics integration, real-time charts with Recharts'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '6.8 Settings (/admin/settings)', font: 'Arial', size: 28 })] }),
  bullet('6 setting groups: Store Info, Contact Settings, Shipping Zones, Tax Settings, Email Templates, API Keys'),
  bullet('Danger Zone: Delete All Data, Reset Database'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第七章：状态流转 =====
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '7. Business Workflows', font: 'Arial', size: 36 })] }),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '7.1 Order Status Workflow', font: 'Arial', size: 28 })] }),
  p('pending → payment_pending → paid → processing → shipped → delivered'),
  p('Alternative paths: cancelled, refunded'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '7.2 Quote Status Workflow', font: 'Arial', size: 28 })] }),
  p('pending → reviewing → quoted → accepted / declined / expired'),
  gap(),
  bullet('pending: Newly submitted by customer'),
  bullet('reviewing: Admin is evaluating the request'),
  bullet('quoted: Admin has filled in prices and submitted a reply'),
  bullet('accepted: Customer accepted the quoted price'),
  bullet('declined: Customer or admin declined'),
  bullet('expired: Quote validity period passed'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '7.3 Purchase Order Status', font: 'Arial', size: 28 })] }),
  p('draft → sent → confirmed → shipped → received'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第八章：操作手册 =====
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '8. Operation Manual', font: 'Arial', size: 36 })] }),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '8.1 Initial Setup', font: 'Arial', size: 28 })] }),
  gap(),
  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Step 1: Environment Configuration', bold: true, font: 'Arial', size: 22 })] }),
  p('Create .env.local in the project root:'),
  code('DATABASE_URL=postgresql://user:password@host:5432/novatech'),
  code('NEXTAUTH_SECRET=your-secret-key-here'),
  code('NEXTAUTH_URL=http://localhost:3000'),
  code('GOOGLE_CLIENT_ID=your-google-client-id        # Optional'),
  code('GOOGLE_CLIENT_SECRET=your-google-secret     # Optional'),
  code('STRIPE_SECRET_KEY=sk_test_...               # Optional'),
  code('STRIPE_PUBLISHABLE_KEY=pk_test_...          # Optional'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Step 2: Database Setup', bold: true, font: 'Arial', size: 22 })] }),
  code('npx prisma generate        # Generate Prisma client'),
  code('npx prisma db push          # Push schema to database'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Step 3: Create Admin Account', bold: true, font: 'Arial', size: 22 })] }),
  p('Run the seed script to create an admin user:'),
  code('node scripts/seed.js admin@labproglobal.com Admin@1234'),
  p('Or create a custom account:'),
  code('node scripts/seed.js your@email.com YourPassword'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Step 4: Import Products', bold: true, font: 'Arial', size: 22 })] }),
  p('Import Novatech product data:'),
  code('node scripts/import-products.js novatech_nova_products.json'),
  gap(),

  new Paragraph({ spacing: { before: 80, after: 60 }, children: [new TextRun({ text: 'Step 5: Start Development Server', bold: true, font: 'Arial', size: 22 })] }),
  code('npm run dev'),
  p('Store front: http://localhost:3000'),
  p('Admin panel: http://localhost:3000/admin'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '8.2 Admin Login Guide', font: 'Arial', size: 28 })] }),
  bullet('Navigate to: http://localhost:3000/auth/login'),
  bullet('Enter admin credentials: admin@labproglobal.com / Admin@1234'),
  bullet('Click "Sign In"'),
  bullet('Redirected to: /admin dashboard'),
  bullet('All /admin/* routes are protected — non-admin users are redirected to login'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '8.3 Managing Products', font: 'Arial', size: 28 })] }),
  gap(),
  new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: 'Add a New Product:', bold: true })] }),
  bullet('Go to /admin/products'),
  bullet('Click "+ Add Product"'),
  bullet('Fill in required fields: SKU, Product Name, Category'),
  bullet('Set pricing: ourPrice (required), listPrice, costPrice'),
  bullet('Set availability: in_stock / out_of_stock / lead_time'),
  bullet('Add images by pasting image URLs'),
  bullet('Toggle isActive, isFeatured, isNew as needed'),
  bullet('Click Save — redirects back to product list'),
  gap(),
  new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: 'Edit a Product:', bold: true })] }),
  bullet('Go to /admin/products'),
  bullet('Click "Edit" on the desired product row'),
  bullet('Modify any fields'),
  bullet('Save changes'),
  gap(),
  new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: 'Delete a Product:', bold: true })] }),
  bullet('Go to /admin/products'),
  bullet('Products with existing order history cannot be deleted (data protection)'),
  bullet('For other products, click "Delete" → confirm'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '8.4 Processing Orders', font: 'Arial', size: 28 })] }),
  gap(),
  new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: 'Handling an Order:', bold: true })] }),
  bullet('Go to /admin/orders'),
  bullet('Click the order number to open details'),
  bullet('Review items, shipping address, and customer info'),
  bullet('Update status step-by-step: Pending → Paid → Processing → Shipped → Delivered'),
  bullet('Enter tracking number when shipped'),
  bullet('Add notes for internal reference'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '8.5 Responding to Quote Requests', font: 'Arial', size: 28 })] }),
  gap(),
  new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: 'Quote Reply Workflow:', bold: true })] }),
  bullet('Go to /admin/quotes — view pending (yellow) and reviewing (blue) quotes'),
  bullet('Click any quote number to open the detail page'),
  bullet('Switch to the "Reply" tab'),
  bullet('Fill in unit price for each item → total auto-calculates'),
  bullet('Optionally set expiry date'),
  bullet('Add internal admin notes (not shown to customer)'),
  bullet('Click "Send Quote" — status changes to "quoted"'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '8.6 Running the Test Suite', font: 'Arial', size: 28 })] }),
  p('Automated test suite (50 tests covering auth, pages, APIs, and error handling):'),
  code('node scripts/test-admin.js'),
  p('With custom credentials:'),
  code('node scripts/test-admin.js your@email.com YourPassword'),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第九章：环境变量 =====
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '9. Environment Variables', font: 'Arial', size: 36 })] }),
  gap(),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 2000, 4560],
    rows: [
      new TableRow({ children: [makeHeaderCell('Variable', 2800), makeHeaderCell('Required', 2000), makeHeaderCell('Description', 4560)] }),
      new TableRow({ children: [makeCellBold('DATABASE_URL', 2800), makeCell('Yes', 2000), makeCell('PostgreSQL connection string', 4560)] }),
      new TableRow({ children: [makeCellBold('NEXTAUTH_SECRET', 2800), makeCell('Yes', 2000), makeCell('Secret for JWT signing (openssl rand -base64 32)', 4560)] }),
      new TableRow({ children: [makeCellBold('NEXTAUTH_URL', 2800), makeCell('Yes', 2000), makeCell('Application URL (http://localhost:3000 for dev)', 4560)] }),
      new TableRow({ children: [makeCellBold('GOOGLE_CLIENT_ID', 2800), makeCell('No', 2000), makeCell('Google OAuth 2.0 Client ID from Google Cloud Console', 4560)] }),
      new TableRow({ children: [makeCellBold('GOOGLE_CLIENT_SECRET', 2800), makeCell('No', 2000), makeCell('Google OAuth Client Secret', 4560)] }),
      new TableRow({ children: [makeCellBold('STRIPE_SECRET_KEY', 2800), makeCell('No', 2000), makeCell('Stripe secret key (sk_test_... / sk_live_...)', 4560)] }),
      new TableRow({ children: [makeCellBold('STRIPE_PUBLISHABLE_KEY', 2800), makeCell('No', 2000), makeCell('Stripe publishable key (pk_test_... / pk_live_...)', 4560)] }),
      new TableRow({ children: [makeCellBold('STRIPE_WEBHOOK_SECRET', 2800), makeCell('No', 2000), makeCell('Stripe webhook signing secret', 4560)] }),
      new TableRow({ children: [makeCellBold('AWS_ACCESS_KEY_ID', 2800), makeCell('No', 2000), makeCell('AWS S3 access key for image uploads', 4560)] }),
      new TableRow({ children: [makeCellBold('AWS_SECRET_ACCESS_KEY', 2800), makeCell('No', 2000), makeCell('AWS S3 secret key', 4560)] }),
      new TableRow({ children: [makeCellBold('AWS_REGION', 2800), makeCell('No', 2000), makeCell('AWS region for S3 (e.g., us-east-1)', 4560)] }),
      new TableRow({ children: [makeCellBold('AWS_S3_BUCKET', 2800), makeCell('No', 2000), makeCell('S3 bucket name for product images', 4560)] }),
      new TableRow({ children: [makeCellBold('EMAIL_HOST', 2800), makeCell('No', 2000), makeCell('SMTP server hostname (e.g., email-smtp.us-east-1.amazonaws.com)', 4560)] }),
      new TableRow({ children: [makeCellBold('EMAIL_PORT', 2800), makeCell('No', 2000), makeCell('SMTP port (e.g., 587)', 4560)] }),
      new TableRow({ children: [makeCellBold('EMAIL_USER', 2800), makeCell('No', 2000), makeCell('SMTP username', 4560)] }),
      new TableRow({ children: [makeCellBold('EMAIL_PASSWORD', 2800), makeCell('No', 2000), makeCell('SMTP password or SES SMTP password', 4560)] }),
      new TableRow({ children: [makeCellBold('EMAIL_FROM', 2800), makeCell('No', 2000), makeCell('From email address (e.g., sales@labproglobal.com)', 4560)] }),
    ],
  }),
  gap(),
  new Paragraph({ children: [new PageBreak()] })
);

// ===== 第十章：待完成功能 =====
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '10. Roadmap & Pending Features', font: 'Arial', size: 36 })] }),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '10.1 High Priority', font: 'Arial', size: 28 })] }),
  bullet('Stripe Payment Integration — Full checkout flow with Stripe Elements and webhook processing'),
  bullet('Email Notifications — Automated emails for order confirmation, quote replies, shipping updates'),
  bullet('Product Image Upload — AWS S3 integration for direct image upload in admin panel'),
  bullet('User Registration — Complete registration flow replacing the placeholder'),
  bullet('Password Reset — NextAuth credential provider password reset'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '10.2 Medium Priority', font: 'Arial', size: 28 })] }),
  bullet('Google Analytics Integration — GA4 tracking for store front pages and events'),
  bullet('Analytics Dashboard — Real charts (Recharts) replacing placeholder graphics'),
  bullet('Customer Management — Full customer profile, order history, quote history'),
  bullet('Purchase Order System — Internal PO creation and supplier management workflow'),
  bullet('Bulk Product Import — CSV/XLSX import for mass product updates'),
  gap(),

  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '10.3 Lower Priority', font: 'Arial', size: 28 })] }),
  bullet('Wishlist / Favorites — Save products for later'),
  bullet('Product Comparison — Side-by-side spec comparison'),
  bullet('Advanced Search — Filters by specs, brand, price range, availability'),
  bullet('Multi-language — i18n for international markets'),
  bullet('Inventory Alerts — Low stock notifications'),
  gap(),
  gap(),
  hRule(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 60 },
    children: [new TextRun({ text: 'End of Document', font: 'Arial', size: 24, color: '9CA3AF', italic: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'LabProGlobal Product Documentation v1.0  ·  April 2026', font: 'Arial', size: 20, color: 'D1D5DB' })],
  }),
);

// ===== 构建文档 =====
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 240 } } },
        }],
      },
      {
        reference: 'bullets2',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u25E6',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 240 } } },
        }],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: 'Arial', size: 22 } },
    },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial', color: '1E3A5F' },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: '1E3A5F' },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 },
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1E3A5F', space: 1 } },
          children: [
            new TextRun({ text: 'LabProGlobal  ', font: 'Arial', size: 18, bold: true, color: '1E3A5F' }),
            new TextRun({ text: 'Product Documentation', font: 'Arial', size: 18, color: '9CA3AF' }),
          ],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB', space: 1 } },
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: 'Page ', font: 'Arial', size: 18, color: '9CA3AF' }),
            new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: '9CA3AF' }),
            new TextRun({ text: ' of ', font: 'Arial', size: 18, color: '9CA3AF' }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: '9CA3AF' }),
          ],
        })],
      }),
    },
    children,
  }],
});

const outputPath = path.join('E:/novatech-store/docs/LabProGlobal-Product-Documentation-v1.0.docx');
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log('Document created successfully!');
  console.log('Output:', outputPath);
  const stats = fs.statSync(outputPath);
  console.log('Size:', (stats.size / 1024).toFixed(1), 'KB');
}).catch(err => {
  console.error('Error creating document:', err);
  process.exit(1);
});
