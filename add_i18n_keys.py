"""
在 translations.ts 中批量添加新翻译 key。
"""
import re

filepath = r"E:\novatech-store\lib\i18n\translations.ts"
with open(filepath, encoding="utf-8") as f:
    content = f.read()

# ============================================================
# TypeScript 类型定义：追加新 key
# ============================================================

# Auth 类型 (在 auth_or_continue: string 之后、// ---- Footer ---- 之前)
auth_type_keys = """
  // ---- Auth (extended) ----
  auth_welcome_back: string
  auth_sign_in_subtitle: string
  auth_demo_credentials: string
  auth_demo_email: string
  auth_demo_password: string
  auth_invalid_credentials: string
  auth_auth_failed: string
  auth_signing_in: string
  auth_enter_password: string
  auth_create_account_link: string
  auth_company_optional: string
  auth_min_password: string
  auth_create_account_btn: string
  auth_already_have: string
  auth_sign_in_link: string
  auth_demo_mode: string
  auth_demo_mode_notice: string
  auth_demo_mode_setup: string
"""

# Account/Address/Quotes 类型 (在 account_order_date 之后、// ---- Products Page ---- 之前)
account_type_keys = """
  // ---- Address Book ----
  addr_title: string
  addr_subtitle: string
  addr_add_address: string
  addr_new_address: string
  addr_label: string
  addr_first_name: string
  addr_last_name: string
  addr_address1: string
  addr_address2: string
  addr_city: string
  addr_state: string
  addr_zip: string
  addr_country: string
  addr_phone_optional: string
  addr_save: string
  addr_cancel: string
  addr_no_addresses: string
  addr_add_first: string
  addr_add_first_desc: string
  addr_add_first_btn: string
  addr_edit: string
  addr_delete: string
  addr_default: string
  addr_loading: string
  // ---- Quotes ----
  quotes_title: string
  quotes_subtitle: string
  quotes_request_new: string
  quotes_quote_number: string
  quotes_date: string
  quotes_items: string
  quotes_est_total: string
  quotes_status: string
  quotes_status_pending: string
  quotes_status_approved: string
  quotes_status_rejected: string
  quotes_no_quotes: string
  quotes_no_quotes_desc: string
  quotes_request_quote: string
  quotes_loading: string
"""

# 在类型定义的 auth_or_continue 之后插入 auth keys
content = content.replace(
    "  auth_or_continue: string\n\n  // ---- Footer ----",
    "  auth_or_continue: string" + auth_type_keys + "\n\n  // ---- Footer ----"
)

# 在类型定义的 account_order_date 之后插入 address/quote keys
content = content.replace(
    "  account_order_date: string\n\n  // ---- Products Page ----",
    "  account_order_date: string" + account_type_keys + "\n\n  // ---- Products Page ----"
)

# ============================================================
# 英文翻译值
# ============================================================
en_auth = """
  auth_welcome_back: 'Welcome Back',
  auth_sign_in_subtitle: 'Sign in to manage your orders and quotes',
  auth_demo_credentials: 'Demo credentials',
  auth_demo_email: 'admin@labproglobal.com',
  auth_demo_password: 'Admin@1234',
  auth_invalid_credentials: 'Invalid email or password. Please try again.',
  auth_auth_failed: 'Authentication failed. Please try again.',
  auth_signing_in: 'Signing in...',
  auth_enter_password: 'Enter your password',
  auth_create_account_link: 'Create one',
  auth_company_optional: 'Company (optional)',
  auth_min_password: 'Min. 8 characters',
  auth_create_account_btn: 'Create Account',
  auth_already_have: 'Already have an account?',
  auth_sign_in_link: 'Sign in',
  auth_demo_mode: 'Demo Mode',
  auth_demo_mode_notice: 'Registration is not yet configured.',
  auth_demo_mode_setup: "Set up OAuth credentials in `.env.local` to enable sign up.",
"""

en_addr = """
  addr_title: 'Address Book',
  addr_subtitle: 'Manage your shipping and billing addresses',
  addr_add_address: 'Add Address',
  addr_new_address: 'New Address',
  addr_label: 'Address Label',
  addr_first_name: 'First Name',
  addr_last_name: 'Last Name',
  addr_address1: 'Address Line 1',
  addr_address2: 'Address Line 2',
  addr_city: 'City',
  addr_state: 'State / Province',
  addr_zip: 'ZIP / Postal Code',
  addr_country: 'Country',
  addr_phone_optional: 'Phone (optional)',
  addr_save: 'Save Address',
  addr_cancel: 'Cancel',
  addr_no_addresses: 'No addresses saved',
  addr_add_first: 'Add Your First Address',
  addr_add_first_desc: 'Add a shipping or billing address for faster checkout.',
  addr_add_first_btn: 'Add Your First Address',
  addr_edit: 'Edit',
  addr_delete: 'Delete',
  addr_default: 'Default',
  addr_loading: 'Loading...',
"""

en_quotes = """
  quotes_title: 'My Quotes',
  quotes_subtitle: 'View and manage your quote requests',
  quotes_request_new: 'Request New Quote',
  quotes_quote_number: 'Quote #',
  quotes_date: 'Date',
  quotes_items: 'Items',
  quotes_est_total: 'Est. Total',
  quotes_status: 'Status',
  quotes_status_pending: 'Pending Review',
  quotes_status_approved: 'Approved',
  quotes_status_rejected: 'Rejected',
  quotes_no_quotes: 'No quotes yet',
  quotes_no_quotes_desc: 'Need a custom quote for bulk orders or hard-to-find items?',
  quotes_request_quote: 'Request a Quote',
  quotes_loading: 'Loading...',
"""

# 中文翻译值
zh_auth = """
  auth_welcome_back: '欢迎回来',
  auth_sign_in_subtitle: '登录以管理您的订单和询价',
  auth_demo_credentials: '演示账号',
  auth_demo_email: 'admin@labproglobal.com',
  auth_demo_password: 'Admin@1234',
  auth_invalid_credentials: '邮箱或密码错误，请重试。',
  auth_auth_failed: '认证失败，请重试。',
  auth_signing_in: '正在登录...',
  auth_enter_password: '输入密码',
  auth_create_account_link: '立即注册',
  auth_company_optional: '公司（选填）',
  auth_min_password: '至少 8 个字符',
  auth_create_account_btn: '创建账户',
  auth_already_have: '已有账户？',
  auth_sign_in_link: '登录',
  auth_demo_mode: '演示模式',
  auth_demo_mode_notice: '注册功能尚未配置。',
  auth_demo_mode_setup: '请在 `.env.local` 中配置 OAuth 凭证以启用注册。',
"""

zh_addr = """
  addr_title: '地址簿',
  addr_subtitle: '管理您的收货地址和账单地址',
  addr_add_address: '添加地址',
  addr_new_address: '新地址',
  addr_label: '地址标签',
  addr_first_name: '名',
  addr_last_name: '姓',
  addr_address1: '地址行 1',
  addr_address2: '地址行 2',
  addr_city: '城市',
  addr_state: '州/省份',
  addr_zip: '邮政编码',
  addr_country: '国家',
  addr_phone_optional: '电话（选填）',
  addr_save: '保存地址',
  addr_cancel: '取消',
  addr_no_addresses: '暂无保存的地址',
  addr_add_first: '添加您的第一个地址',
  addr_add_first_desc: '添加收货或账单地址，加快结账流程。',
  addr_add_first_btn: '添加第一个地址',
  addr_edit: '编辑',
  addr_delete: '删除',
  addr_default: '默认',
  addr_loading: '加载中...',
"""

zh_quotes = """
  quotes_title: '我的询价单',
  quotes_subtitle: '查看和管理您的询价请求',
  quotes_request_new: '申请新询价',
  quotes_quote_number: '询价单号',
  quotes_date: '日期',
  quotes_items: '商品数',
  quotes_est_total: '预估总额',
  quotes_status: '状态',
  quotes_status_pending: '待审核',
  quotes_status_approved: '已批准',
  quotes_status_rejected: '已拒绝',
  quotes_no_quotes: '暂无询价单',
  quotes_no_quotes_desc: '需要大批量或特殊产品的定制报价？',
  quotes_request_quote: '申请询价',
  quotes_loading: '加载中...',
"""

# 西班牙语
es_auth = """
  auth_welcome_back: 'Bienvenido de nuevo',
  auth_sign_in_subtitle: 'Inicie sesión para gestionar sus pedidos y cotizaciones',
  auth_demo_credentials: 'Credenciales de demostración',
  auth_demo_email: 'admin@labproglobal.com',
  auth_demo_password: 'Admin@1234',
  auth_invalid_credentials: 'Correo electrónico o contraseña inválidos. Inténtelo de nuevo.',
  auth_auth_failed: 'Error de autenticación. Inténtelo de nuevo.',
  auth_signing_in: 'Iniciando sesión...',
  auth_enter_password: 'Introduzca su contraseña',
  auth_create_account_link: 'Cree una',
  auth_company_optional: 'Empresa (opcional)',
  auth_min_password: 'Mín. 8 caracteres',
  auth_create_account_btn: 'Crear Cuenta',
  auth_already_have: '¿Ya tiene una cuenta?',
  auth_sign_in_link: 'Iniciar sesión',
  auth_demo_mode: 'Modo Demo',
  auth_demo_mode_notice: 'El registro aún no está configurado.',
  auth_demo_mode_setup: 'Configure las credenciales OAuth en `.env.local` para habilitar el registro.',
"""

es_addr = """
  addr_title: 'Libro de Direcciones',
  addr_subtitle: 'Gestione sus direcciones de envío y facturación',
  addr_add_address: 'Añadir Dirección',
  addr_new_address: 'Nueva Dirección',
  addr_label: 'Etiqueta de Dirección',
  addr_first_name: 'Nombre',
  addr_last_name: 'Apellido',
  addr_address1: 'Dirección Línea 1',
  addr_address2: 'Dirección Línea 2',
  addr_city: 'Ciudad',
  addr_state: 'Estado / Provincia',
  addr_zip: 'Código Postal',
  addr_country: 'País',
  addr_phone_optional: 'Teléfono (opcional)',
  addr_save: 'Guardar Dirección',
  addr_cancel: 'Cancelar',
  addr_no_addresses: 'Sin direcciones guardadas',
  addr_add_first: 'Añadir su Primera Dirección',
  addr_add_first_desc: 'Añada una dirección de envío o facturación para un checkout más rápido.',
  addr_add_first_btn: 'Añadir su Primera Dirección',
  addr_edit: 'Editar',
  addr_delete: 'Eliminar',
  addr_default: 'Predeterminado',
  addr_loading: 'Cargando...',
"""

es_quotes = """
  quotes_title: 'Mis Cotizaciones',
  quotes_subtitle: 'Vea y gestione sus solicitudes de cotización',
  quotes_request_new: 'Solicitar Nueva Cotización',
  quotes_quote_number: 'Cotización #',
  quotes_date: 'Fecha',
  quotes_items: 'Artículos',
  quotes_est_total: 'Total Est.',
  quotes_status: 'Estado',
  quotes_status_pending: 'Revisión Pendiente',
  quotes_status_approved: 'Aprobada',
  quotes_status_rejected: 'Rechazada',
  quotes_no_quotes: 'Sin cotizaciones aún',
  quotes_no_quotes_desc: '¿Necesita una cotización personalizada para pedidos grandes o artículos difíciles de encontrar?',
  quotes_request_quote: 'Solicitar Cotización',
  quotes_loading: 'Cargando...',
"""

# ============================================================
# 在英文翻译中插入 (在 auth_or_continue 之后)
# ============================================================
content = content.replace(
    "  auth_or_continue: 'Or continue with',\n\n  footer_about",
    "  auth_or_continue: 'Or continue with'," + en_auth + en_addr + en_quotes + "\n\n  footer_about"
)

# ============================================================
# 在中文翻译中插入
# ============================================================
content = content.replace(
    "  auth_or_continue: '或通过以下方式继续',\n\n  footer_about",
    "  auth_or_continue: '或通过以下方式继续'," + zh_auth + zh_addr + zh_quotes + "\n\n  footer_about"
)

# ============================================================
# 在西班牙语翻译中插入 (注意: 没有换行符，是直接连着 footer_about)
# ============================================================
content = content.replace(
    "  auth_or_continue: 'O continuar con',\n\n  footer_about",
    "  auth_or_continue: 'O continuar con'," + es_auth + es_addr + es_quotes + "\n\n  footer_about"
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Done! Keys added to translations.ts")
print("Final file size:", len(content), "chars")
