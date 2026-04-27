// ============================================================
//  Admin 后台专用多语言 — 仅英文 / 中文
// ============================================================

export type AdminLocale = 'en' | 'zh'

export const ADMIN_LOCALES: { code: AdminLocale; label: string; labelZh: string }[] = [
  { code: 'en', label: 'English', labelZh: 'EN' },
  { code: 'zh', label: '中文',    labelZh: '中文' },
]

export type AdminTranslationKeys = {
  // Sidebar
  nav_dashboard: string
  nav_products: string
  nav_orders: string
  nav_quotes: string
  nav_customers: string
  nav_brands: string
  nav_analytics: string
  nav_settings: string
  nav_view_store: string
  nav_sign_out: string
  nav_admin_panel: string
  // Dashboard
  dashboard_title: string
  dashboard_total_products: string
  dashboard_total_orders: string
  dashboard_quote_requests: string
  dashboard_customers: string
  dashboard_pending_orders: string
  dashboard_require_attention: string
  dashboard_awaiting_review: string
  dashboard_recent_orders: string
  dashboard_view_all: string
  dashboard_no_orders: string
  dashboard_order_col: string
  dashboard_customer_col: string
  dashboard_items_col: string
  dashboard_total_col: string
  dashboard_status_col: string
  // Analytics
  analytics_title: string
  analytics_coming_soon: string
  analytics_coming_soon_desc: string
  analytics_total_revenue: string
  analytics_orders: string
  analytics_conversion_rate: string
  analytics_avg_order_value: string
  analytics_this_month: string
  analytics_last_30_days: string
  analytics_revenue_over_time: string
  analytics_top_products: string
  analytics_orders_by_status: string
  analytics_traffic_sources: string
  analytics_chart_coming: string
  analytics_roadmap_title: string
  // Customers
  customers_title: string
  customers_count: string
  customers_name_col: string
  customers_email_col: string
  customers_joined_col: string
  customers_orders_col: string
  customers_quotes_col: string
  customers_no_customers: string
  customers_na: string
  // Orders
  orders_title: string
  orders_total: string
  orders_search_placeholder: string
  orders_search: string
  orders_clear: string
  orders_all_status: string
  orders_pending: string
  orders_paid: string
  orders_processing: string
  orders_shipped: string
  orders_delivered: string
  orders_cancelled: string
  orders_loading: string
  orders_no_results: string
  orders_no_orders: string
  orders_order_col: string
  orders_customer_col: string
  orders_date_col: string
  orders_items_col: string
  orders_total_col: string
  orders_status_col: string
  orders_payment_col: string
  orders_page_of: string
  orders_previous: string
  orders_next: string
  orders_confirm_delete: string
  orders_delete_failed: string
  orders_delete_title: string
  // Products
  products_title: string
  products_total: string
  products_add_new: string
  products_search_placeholder: string
  products_search: string
  products_clear: string
  products_image_col: string
  products_sku_col: string
  products_product_col: string
  products_brand_col: string
  products_category_col: string
  products_price_col: string
  products_status_col: string
  products_actions_col: string
  products_loading: string
  products_no_results: string
  products_no_products: string
  products_active: string
  products_inactive: string
  products_edit: string
  products_delete: string
  products_no_img: string
  products_page_of: string
  products_previous: string
  products_next: string
  // Product New/Edit
  products_add_new_title: string
  products_edit_title: string
  products_fill_details: string
  products_editing: string
  // Quotes
  quotes_title: string
  quotes_of_requests: string
  quotes_search_placeholder: string
  quotes_all: string
  quotes_no_requests: string
  quotes_quote_col: string
  quotes_customer_col: string
  quotes_date_col: string
  quotes_items_col: string
  quotes_status_col: string
  quotes_quote_price_col: string
  quotes_pending: string
  quotes_reviewing: string
  quotes_quoted: string
  quotes_accepted: string
  quotes_declined: string
  quotes_expired: string
  // Settings
  settings_title: string
  settings_store_info: string
  settings_store_info_desc: string
  settings_store_name: string
  settings_contact_email: string
  settings_currency: string
  settings_coming_soon_edit: string
  settings_integrations: string
  settings_integrations_desc: string
  settings_not_connected: string
  settings_coming_soon_connect: string
  settings_notifications: string
  settings_notifications_desc: string
  settings_new_order: string
  settings_quote_received: string
  settings_low_stock: string
  settings_feedback: string
  settings_coming_soon_alerts: string
  settings_team_roles: string
  settings_team_roles_desc: string
  settings_team_coming: string
  settings_invite_staff: string
  settings_security: string
  settings_security_desc: string
  settings_change_pw: string
  settings_2fa: string
  settings_active_sessions: string
  settings_advanced: string
  settings_advanced_desc: string
  settings_api_keys: string
  settings_webhooks: string
  settings_env_vars: string
  settings_danger_zone: string
  settings_delete_all: string
  settings_delete_all_desc: string
  settings_delete_everything: string
  // Common
  common_na: string
  common_items_count: string
}

export const adminTranslations: Record<AdminLocale, AdminTranslationKeys> = {
  en: {
    // Sidebar
    nav_dashboard: 'Dashboard',
    nav_products: 'Products',
    nav_orders: 'Orders',
    nav_quotes: 'Quotes',
    nav_customers: 'Customers',
    nav_brands: 'Brands',
    nav_analytics: 'Analytics',
    nav_settings: 'Settings',
    nav_view_store: 'View Store',
    nav_sign_out: 'Sign Out',
    nav_admin_panel: 'Admin Panel',
    // Dashboard
    dashboard_title: 'Dashboard',
    dashboard_total_products: 'Total Products',
    dashboard_total_orders: 'Total Orders',
    dashboard_quote_requests: 'Quote Requests',
    dashboard_customers: 'Customers',
    dashboard_pending_orders: 'Pending Orders',
    dashboard_require_attention: 'Require attention',
    dashboard_awaiting_review: 'Awaiting review',
    dashboard_recent_orders: 'Recent Orders',
    dashboard_view_all: 'View All →',
    dashboard_no_orders: 'No orders yet',
    dashboard_order_col: 'Order',
    dashboard_customer_col: 'Customer',
    dashboard_items_col: 'Items',
    dashboard_total_col: 'Total',
    dashboard_status_col: 'Status',
    // Analytics
    analytics_title: 'Analytics',
    analytics_coming_soon: 'Coming soon',
    analytics_coming_soon_desc: 'Sales reports, traffic insights, and business metrics',
    analytics_total_revenue: 'Total Revenue',
    analytics_orders: 'Orders',
    analytics_conversion_rate: 'Conversion Rate',
    analytics_avg_order_value: 'Avg. Order Value',
    analytics_this_month: 'This month',
    analytics_last_30_days: 'Last 30 days',
    analytics_revenue_over_time: 'Revenue Over Time',
    analytics_top_products: 'Top Products',
    analytics_orders_by_status: 'Orders by Status',
    analytics_traffic_sources: 'Traffic Sources',
    analytics_chart_coming: 'Chart coming soon',
    analytics_roadmap_title: '📋 Coming Soon',
    // Customers
    customers_title: 'Customers',
    customers_count: '{count} customers',
    customers_name_col: 'Name',
    customers_email_col: 'Email',
    customers_joined_col: 'Joined',
    customers_orders_col: 'Orders',
    customers_quotes_col: 'Quotes',
    customers_no_customers: 'No customers yet',
    customers_na: 'N/A',
    // Orders
    orders_title: 'Orders',
    orders_total: '{count} orders total',
    orders_search_placeholder: 'Search order #, customer name or email...',
    orders_search: 'Search',
    orders_clear: 'Clear',
    orders_all_status: 'All Status',
    orders_pending: 'Pending',
    orders_paid: 'Paid',
    orders_processing: 'Processing',
    orders_shipped: 'Shipped',
    orders_delivered: 'Delivered',
    orders_cancelled: 'Cancelled',
    orders_loading: 'Loading...',
    orders_no_results: 'No orders match your filters',
    orders_no_orders: 'No orders yet',
    orders_order_col: 'Order #',
    orders_customer_col: 'Customer',
    orders_date_col: 'Date',
    orders_items_col: 'Items',
    orders_total_col: 'Total',
    orders_status_col: 'Status',
    orders_payment_col: 'Payment',
    orders_page_of: 'Page {page} of {total} ({count} total)',
    orders_previous: 'Previous',
    orders_next: 'Next',
    orders_confirm_delete: 'Are you sure you want to delete this product? This cannot be undone.',
    orders_delete_failed: 'Failed to delete',
    orders_delete_title: 'Delete Product',
    // Products
    products_title: 'Products',
    products_total: '{count} products total',
    products_add_new: '+ Add Product',
    products_search_placeholder: 'Search by name, SKU, or description...',
    products_search: 'Search',
    products_clear: 'Clear',
    products_image_col: 'Image',
    products_sku_col: 'SKU',
    products_product_col: 'Product',
    products_brand_col: 'Brand',
    products_category_col: 'Category',
    products_price_col: 'Price',
    products_status_col: 'Status',
    products_actions_col: 'Actions',
    products_loading: 'Loading...',
    products_no_results: 'No products match your search',
    products_no_products: 'No products yet',
    products_active: 'Active',
    products_inactive: 'Inactive',
    products_edit: 'Edit',
    products_delete: 'Delete',
    products_no_img: 'No img',
    products_page_of: 'Page {page} of {total} ({count} total)',
    products_previous: 'Previous',
    products_next: 'Next',
    // Product New/Edit
    products_add_new_title: 'Add New Product',
    products_edit_title: 'Edit Product',
    products_fill_details: 'Fill in the product details below',
    products_editing: 'Editing:',
    // Quotes
    quotes_title: 'Quote Requests',
    quotes_of_requests: '{shown} of {total} requests',
    quotes_search_placeholder: 'Search by quote #, customer name, email...',
    quotes_all: 'All',
    quotes_no_requests: 'No quote requests found',
    quotes_quote_col: 'Quote #',
    quotes_customer_col: 'Customer',
    quotes_date_col: 'Date',
    quotes_items_col: 'Items',
    quotes_status_col: 'Status',
    quotes_quote_price_col: 'Quote Price',
    quotes_pending: 'Pending',
    quotes_reviewing: 'Reviewing',
    quotes_quoted: 'Quoted',
    quotes_accepted: 'Accepted',
    quotes_declined: 'Declined',
    quotes_expired: 'Expired',
    // Settings
    settings_title: 'Settings',
    settings_store_info: 'Store Information',
    settings_store_info_desc: 'Basic store details',
    settings_store_name: 'Store Name',
    settings_contact_email: 'Contact Email',
    settings_currency: 'Currency',
    settings_coming_soon_edit: 'Coming soon — edit store info',
    settings_integrations: 'Integrations',
    settings_integrations_desc: 'Third-party services',
    settings_not_connected: 'Not connected',
    settings_coming_soon_connect: 'Coming soon — connect services',
    settings_notifications: 'Notifications',
    settings_notifications_desc: 'Email & alert preferences',
    settings_new_order: 'New order placed',
    settings_quote_received: 'Quote request received',
    settings_low_stock: 'Low stock alert',
    settings_feedback: 'Customer feedback',
    settings_coming_soon_alerts: 'Coming soon — configure alerts',
    settings_team_roles: 'Team & Roles',
    settings_team_roles_desc: 'Manage staff accounts',
    settings_team_coming: 'Team management coming soon',
    settings_invite_staff: 'Invite staff and assign roles',
    settings_security: 'Security',
    settings_security_desc: 'Password & access',
    settings_change_pw: 'Change password',
    settings_2fa: 'Two-factor authentication',
    settings_active_sessions: 'Active sessions',
    settings_advanced: 'Advanced',
    settings_advanced_desc: 'Developer options',
    settings_api_keys: 'API Keys',
    settings_webhooks: 'Webhooks',
    settings_env_vars: 'Environment Variables',
    settings_danger_zone: '⚠️ Danger Zone',
    settings_delete_all: 'Delete all data',
    settings_delete_all_desc: 'Permanently remove all orders, products, and customer data. This action cannot be undone.',
    settings_delete_everything: 'Delete Everything',
    // Common
    common_na: '—',
    common_items_count: '{count} item{s}',
  },

  zh: {
    // Sidebar
    nav_dashboard: '仪表盘',
    nav_products: '产品管理',
    nav_orders: '订单管理',
    nav_quotes: '询价管理',
    nav_customers: '客户管理',
    nav_brands: '品牌管理',
    nav_analytics: '数据分析',
    nav_settings: '系统设置',
    nav_view_store: '查看商店',
    nav_sign_out: '退出登录',
    nav_admin_panel: '管理后台',
    // Dashboard
    dashboard_title: '仪表盘',
    dashboard_total_products: '产品总数',
    dashboard_total_orders: '订单总数',
    dashboard_quote_requests: '询价请求',
    dashboard_customers: '客户总数',
    dashboard_pending_orders: '待处理订单',
    dashboard_require_attention: '需要关注',
    dashboard_awaiting_review: '待审核',
    dashboard_recent_orders: '最近订单',
    dashboard_view_all: '查看全部 →',
    dashboard_no_orders: '暂无订单',
    dashboard_order_col: '订单号',
    dashboard_customer_col: '客户',
    dashboard_items_col: '商品',
    dashboard_total_col: '总额',
    dashboard_status_col: '状态',
    // Analytics
    analytics_title: '数据分析',
    analytics_coming_soon: '即将上线',
    analytics_coming_soon_desc: '销售报告、流量洞察和业务指标',
    analytics_total_revenue: '总收入',
    analytics_orders: '订单数',
    analytics_conversion_rate: '转化率',
    analytics_avg_order_value: '平均订单金额',
    analytics_this_month: '本月',
    analytics_last_30_days: '近30天',
    analytics_revenue_over_time: '收入趋势',
    analytics_top_products: '热销产品',
    analytics_orders_by_status: '订单状态分布',
    analytics_traffic_sources: '流量来源',
    analytics_chart_coming: '图表即将上线',
    analytics_roadmap_title: '📋 即将上线',
    // Customers
    customers_title: '客户管理',
    customers_count: '{count} 位客户',
    customers_name_col: '姓名',
    customers_email_col: '邮箱',
    customers_joined_col: '注册时间',
    customers_orders_col: '订单数',
    customers_quotes_col: '询价数',
    customers_no_customers: '暂无客户',
    customers_na: '暂无',
    // Orders
    orders_title: '订单管理',
    orders_total: '共 {count} 个订单',
    orders_search_placeholder: '搜索订单号、客户名或邮箱...',
    orders_search: '搜索',
    orders_clear: '清除',
    orders_all_status: '全部状态',
    orders_pending: '待处理',
    orders_paid: '已付款',
    orders_processing: '处理中',
    orders_shipped: '已发货',
    orders_delivered: '已送达',
    orders_cancelled: '已取消',
    orders_loading: '加载中...',
    orders_no_results: '没有符合条件的订单',
    orders_no_orders: '暂无订单',
    orders_order_col: '订单号',
    orders_customer_col: '客户',
    orders_date_col: '日期',
    orders_items_col: '商品',
    orders_total_col: '总额',
    orders_status_col: '状态',
    orders_payment_col: '支付',
    orders_page_of: '第 {page} 页，共 {total} 页（{count} 条）',
    orders_previous: '上一页',
    orders_next: '下一页',
    orders_confirm_delete: '确定要删除此产品吗？此操作无法撤销。',
    orders_delete_failed: '删除失败',
    orders_delete_title: '删除产品',
    // Products
    products_title: '产品管理',
    products_total: '共 {count} 个产品',
    products_add_new: '+ 添加产品',
    products_search_placeholder: '按名称、SKU 或描述搜索...',
    products_search: '搜索',
    products_clear: '清除',
    products_image_col: '图片',
    products_sku_col: 'SKU',
    products_product_col: '产品',
    products_brand_col: '品牌',
    products_category_col: '分类',
    products_price_col: '价格',
    products_status_col: '状态',
    products_actions_col: '操作',
    products_loading: '加载中...',
    products_no_results: '没有搜索到产品',
    products_no_products: '暂无产品',
    products_active: '已上架',
    products_inactive: '已下架',
    products_edit: '编辑',
    products_delete: '删除',
    products_no_img: '无图',
    products_page_of: '第 {page} 页，共 {total} 页（{count} 条）',
    products_previous: '上一页',
    products_next: '下一页',
    // Product New/Edit
    products_add_new_title: '添加新产品',
    products_edit_title: '编辑产品',
    products_fill_details: '请填写以下产品信息',
    products_editing: '正在编辑：',
    // Quotes
    quotes_title: '询价管理',
    quotes_of_requests: '显示 {shown} / 共 {total} 条',
    quotes_search_placeholder: '按询价单号、客户名、邮箱搜索...',
    quotes_all: '全部',
    quotes_no_requests: '暂无询价请求',
    quotes_quote_col: '询价单号',
    quotes_customer_col: '客户',
    quotes_date_col: '日期',
    quotes_items_col: '商品',
    quotes_status_col: '状态',
    quotes_quote_price_col: '报价',
    quotes_pending: '待处理',
    quotes_reviewing: '审核中',
    quotes_quoted: '已报价',
    quotes_accepted: '已接受',
    quotes_declined: '已拒绝',
    quotes_expired: '已过期',
    // Settings
    settings_title: '系统设置',
    settings_store_info: '商店信息',
    settings_store_info_desc: '基本商店信息',
    settings_store_name: '商店名称',
    settings_contact_email: '联系邮箱',
    settings_currency: '货币',
    settings_coming_soon_edit: '即将支持编辑商店信息',
    settings_integrations: '第三方集成',
    settings_integrations_desc: '第三方服务',
    settings_not_connected: '未连接',
    settings_coming_soon_connect: '即将支持连接服务',
    settings_notifications: '通知设置',
    settings_notifications_desc: '邮件与提醒偏好',
    settings_new_order: '新订单提醒',
    settings_quote_received: '收到询价提醒',
    settings_low_stock: '库存不足提醒',
    settings_feedback: '客户反馈',
    settings_coming_soon_alerts: '即将支持配置提醒',
    settings_team_roles: '团队与角色',
    settings_team_roles_desc: '管理员工账号',
    settings_team_coming: '团队管理即将上线',
    settings_invite_staff: '邀请员工并分配角色',
    settings_security: '安全设置',
    settings_security_desc: '密码与访问',
    settings_change_pw: '修改密码',
    settings_2fa: '双重认证',
    settings_active_sessions: '活跃会话',
    settings_advanced: '高级选项',
    settings_advanced_desc: '开发者选项',
    settings_api_keys: 'API 密钥',
    settings_webhooks: 'Webhooks',
    settings_env_vars: '环境变量',
    settings_danger_zone: '⚠️ 危险区域',
    settings_delete_all: '删除所有数据',
    settings_delete_all_desc: '永久删除所有订单、产品和客户数据。此操作不可撤销。',
    settings_delete_everything: '删除全部',
    // Common
    common_na: '—',
    common_items_count: '{count} 件商品',
  },
}
