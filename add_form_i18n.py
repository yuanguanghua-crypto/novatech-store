"""Add register form placeholder keys and fix checker false positives"""
filepath = r"E:\novatech-store\lib\i18n\translations.ts"
with open(filepath, encoding="utf-8") as f:
    content = f.read()

# 1. Add register form placeholder keys (under auth section)
auth_ext_type = """
  // ---- Form Placeholders ----
  placeholder_name_example: string
  placeholder_company_example: string
  placeholder_email_example: string
  placeholder_phone_example: string
  placeholder_notes_example: string
  placeholder_search_example: string
"""
content = content.replace(
    "  auth_demo_mode_setup: string\n",
    "  auth_demo_mode_setup: string" + auth_ext_type
)

# English placeholders
en_placeholders = """
  placeholder_name_example: 'John Smith',
  placeholder_company_example: 'Your Company Inc.',
  placeholder_email_example: 'your@email.com',
  placeholder_phone_example: '+1 (555) 123-4567',
  placeholder_notes_example: 'Shipping address, special requirements, etc.',
  placeholder_search_example: 'Search products...',
"""
content = content.replace(
    "  auth_demo_mode_setup: \"Set up OAuth credentials in `.env.local` to enable sign up.\",\n\n  // Account",
    "  auth_demo_mode_setup: \"Set up OAuth credentials in `.env.local` to enable sign up.\"," + en_placeholders + "\n\n  // Account"
)

# Chinese
zh_placeholders = """
  placeholder_name_example: '张三',
  placeholder_company_example: '您的公司名称',
  placeholder_email_example: 'your@email.com',
  placeholder_phone_example: '+86 138-0000-0000',
  placeholder_notes_example: '收货地址、特殊需求等',
  placeholder_search_example: '搜索产品...',
"""
content = content.replace(
    "  auth_demo_mode_setup: '请在 `.env.local` 中配置 OAuth 凭证以启用注册。',\n\n  // Account",
    "  auth_demo_mode_setup: '请在 `.env.local` 中配置 OAuth 凭证以启用注册。'," + zh_placeholders + "\n\n  // Account"
)

# Spanish
es_placeholders = """
  placeholder_name_example: 'Juan Pérez',
  placeholder_company_example: 'Su Empresa S.L.',
  placeholder_email_example: 'su@email.com',
  placeholder_phone_example: '+34 600 000 000',
  placeholder_notes_example: 'Dirección de envío, requisitos especiales, etc.',
  placeholder_search_example: 'Buscar productos...',
"""
content = content.replace(
    "  auth_demo_mode_setup: 'Configure las credenciales OAuth en `.env.local` para habilitar el registro.',\n\n  // Account",
    "  auth_demo_mode_setup: 'Configure las credenciales OAuth en `.env.local` para habilitar el registro.'," + es_placeholders + "\n\n  // Account"
)

# Japanese
ja_placeholders = """
  placeholder_name_example: '山田 太郎',
  placeholder_company_example: '会社名',
  placeholder_email_example: 'your@email.com',
  placeholder_phone_example: '+81 90-0000-0000',
  placeholder_notes_example: '配送先住所、特別な要件など',
  placeholder_search_example: '製品を検索...',
"""
content = content.replace(
    "  auth_demo_mode_setup: '`.env.local`でOAuth資格情報を設定してください。',\n\n  // Account",
    "  auth_demo_mode_setup: '`.env.local`でOAuth資格情報を設定してください。'," + ja_placeholders + "\n\n  // Account"
)

# Hindi
hi_placeholders = """
  placeholder_name_example: 'राजेश कुमार',
  placeholder_company_example: 'आपकी कंपनी',
  placeholder_email_example: 'aap@email.com',
  placeholder_phone_example: '+91 98765 43210',
  placeholder_notes_example: 'शिपिंग पता, विशेष आवश्यकताएं, आदि',
  placeholder_search_example: 'उत्पाद खोजें...',
"""
content = content.replace(
    "  auth_demo_mode_setup: 'साइन अप सक्षम करने के लिए `.env.local` में OAuth क्रेडेंशियल्स सेट करें।',\n\n  // Account",
    "  auth_demo_mode_setup: 'साइन अप सक्षम करने के लिए `.env.local` में OAuth क्रेडेंशियल्स सेट करें।'," + hi_placeholders + "\n\n  // Account"
)

# Arabic
ar_placeholders = """
  placeholder_name_example: 'أحمد محمد',
  placeholder_company_example: ' شركتك',
  placeholder_email_example: 'your@email.com',
  placeholder_phone_example: '+966 50 000 0000',
  placeholder_notes_example: 'عنوان الشحن، المتطلبات الخاصة، إلخ',
  placeholder_search_example: 'البحث عن منتجات...',
"""
content = content.replace(
    "  auth_demo_mode_setup: 'قم بتعيين بيانات اعتماد OAuth في `.env.local` لتمكين التسجيل.',\n\n  // Account",
    "  auth_demo_mode_setup: 'قم بتعيين بيانات اعتماد OAuth في `.env.local` لتمكين التسجيل.'," + ar_placeholders + "\n\n  // Account"
)

# Portuguese
pt_placeholders = """
  placeholder_name_example: 'João Silva',
  placeholder_company_example: 'A Sua Empresa',
  placeholder_email_example: 'seu@email.com',
  placeholder_phone_example: '+351 912 000 000',
  placeholder_notes_example: 'Endereço de envio, requisitos especiais, etc.',
  placeholder_search_example: 'Pesquisar produtos...',
"""
content = content.replace(
    "  auth_demo_mode_setup: 'Configure as credenciais OAuth em `.env.local` para ativar o registo.',\n\n  // Account",
    "  auth_demo_mode_setup: 'Configure as credenciais OAuth em `.env.local` para ativar o registo.'," + pt_placeholders + "\n\n  // Account"
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
print("placeholder_name_example count:", content.count("placeholder_name_example:"))
