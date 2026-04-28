# LabProGlobal 前端重新设计方案

## 1. 设计理念与品牌定位

### 品牌个性
- **专业可靠**: B2B 工业设备领域的专家形象
- **高效清晰**: 便于快速找到产品，提高采购效率
- **现代简约**: 扁平化设计，留白充足，信息层次分明
- **信任感**: 专业的视觉语言，建立采购信心

### 目标用户画像
- 实验室技术人员：关注产品参数和技术规格
- 企业采购人员：注重效率和批量采购能力
- 研究机构：追求品质和创新产品

---

## 2. 色彩体系

### 主色调
```css
:root {
  /* 主色 - 深蓝（专业、信任） */
  --color-primary-50: #EEF4FF;
  --color-primary-100: #D9E7FF;
  --color-primary-200: #BBD3FF;
  --color-primary-500: #4A7DFF;
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;
  --color-primary-800: #1E40AF;
  --color-primary-900: #1E3A5F;

  /* 辅助色 - 青绿（创新、科技） */
  --color-accent-500: #06B6D4;
  --color-accent-600: #0891B2;

  /* 成功/警告/错误 */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;

  /* 中性色 */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
}
```

---

## 3. 字体系统

### 字体选择
- **标题字体**: Plus Jakarta Sans (现代、专业、有活力)
- **正文字体**: Inter (极佳可读性、适合数字)
- **等宽字体**: JetBrains Mono (SKU、规格参数)

### 字体层级
```css
--font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* 字号系统 */
--text-xs: 0.75rem;    /* 12px - 辅助文字 */
--text-sm: 0.875rem;   /* 14px - 次要信息 */
--text-base: 1rem;     /* 16px - 正文 */
--text-lg: 1.125rem;    /* 18px - 副标题 */
--text-xl: 1.25rem;     /* 20px - 小标题 */
--text-2xl: 1.5rem;     /* 24px - 区块标题 */
--text-3xl: 1.875rem;   /* 30px - 页面标题 */
--text-4xl: 2.25rem;    /* 36px - Hero 标题 */
--text-5xl: 3rem;       /* 48px - 大 Hero */
```

---

## 4. 组件设计规范

### 4.1 导航栏 (Navbar)
- **高度**: 64px (桌面) / 56px (移动)
- **背景**: 白色 + 底部 1px 边框
- **Logo 区域**: 左侧，高度 40px
- **搜索框**: 中央，宽度 480px，圆角 8px
- **操作按钮**: 右侧，语言切换、询价、登录、购物车

### 4.2 产品卡片 (Product Card)
- **尺寸**: 宽度自适应，最小 280px
- **图片区域**: 16:10 比例，居中裁剪
- **信息区域**: 产品名称、品牌、编号、价格
- **悬停效果**: 轻微上浮 + 阴影加深
- **操作按钮**: "查看详情" + "加入询价"

### 4.3 筛选侧边栏 (Filter Sidebar)
- **宽度**: 280px (固定)
- **分组**: 按类别（可用性、价格、品牌）折叠/展开
- **复选框**: 自定义样式，16px 大小
- **价格滑块**: 双轨道，显示最小/最大值

### 4.4 Hero 区域
- **高度**: 480px (桌面) / 360px (移动)
- **背景**: 渐变色 + 抽象几何图形装饰
- **内容**: 大标题 + 副标题 + 搜索框 + CTA 按钮
- **动画**: 文字渐入 + 背景微动

### 4.5 页脚 (Footer)
- **背景**: 深灰色 (#1F2937)
- **布局**: 4 列网格
- **内容**: 产品分类、服务、账户、公司信息
- **底部**: 版权信息 + 社交媒体链接

---

## 5. 交互动效

### 全局动画
```css
/* 过渡时间 */
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-slow: 400ms ease;

/* 悬停效果 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

/* 按钮按下 */
.button:active {
  transform: scale(0.98);
}
```

### 页面加载动画
- 骨架屏 + 渐显效果
- 产品卡片交错动画 (stagger: 50ms)

---

## 6. 响应式断点

```css
/* 移动端优先 */
--screen-sm: 640px;   /* 大手机 */
--screen-md: 768px;   /* 平板 */
--screen-lg: 1024px;  /* 小桌面 */
--screen-xl: 1280px;  /* 桌面 */
--screen-2xl: 1536px; /* 大桌面 */
```

---

## 7. 无障碍设计

- 所有交互元素支持键盘导航
- ARIA 标签完整
- 颜色对比度符合 WCAG AA 标准
- 支持屏幕阅读器
- 减少动画偏好支持 (prefers-reduced-motion)
