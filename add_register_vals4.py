"""Precisely insert auth_join_desc and auth_env_setup_notice after auth_demo_mode_setup values."""
FILE = r'E:\novatech-store\lib\i18n\translations.ts'
with open(FILE, encoding='utf-8') as f:
    content = f.read()

# Values for each language (quoted)
VALUES = [
    ('en', "Join LabProGlobal to manage orders and request quotes",
           "Set up OAuth credentials in <code>.env.local</code> to enable sign up."),
    ('zh', "注册 LabProGlobal，管理订单并请求报价",
           "请在 <code>.env.local</code> 中配置 OAuth 凭证以启用注册。"),
    ('es', "Únete a LabProGlobal para gestionar pedidos y solicitar cotizaciones",
           "Configure las credenciales OAuth en <code>.env.local</code> para habilitar el registro."),
    ('ja', "LabProGlobalに参加して注文管理と見積もり依頼",
           "<code>.env.local</code> にOAuth認証情報を設定してサインアップを有効にします。"),
    ('hi', "LabProGlobal से जुड़ें और ऑर्डर प्रबंधित करें तथा कोट्स का अनुरोध करें",
           "<code>.env.local</code> में OAuth क्रेडेंशियल्स सेट करें ताकि साइन अप सक्षम हो।"),
    ('ar', "انضم إلى LabProGlobal لإدارة الطلبات وطلب عروض الأسعار",
           "قم بتعيين بيانات اعتماد OAuth في <code>.env.local</code> لتمكين التسجيل."),
    ('pt', "Junte-se ao LabProGlobal para gerenciar pedidos y solicitar orçamentos",
           "Configure as credenciais OAuth em <code>.env.local</code> para ativar o registo."),
]

# The EXACT text of auth_demo_mode_setup values in each language (for finding insertion point)
# These must match exactly what's in the file
SETUP_VALUES = {
    'en': "Set up OAuth credentials in `.env.local` to enable sign up.",
    'zh': "请在 `.env.local` 中配置 OAuth 凭证以启用注册。",
    'es': "Configure las credenciales OAuth en `.env.local` para habilitar el registro.",
    'ja': "`<code>.env.local</code>` にOAuth認証情報を設定してサインアップを有効にします。",
    'hi': "`<code>.env.local</code>` में OAuth क्रेडेंशियल्स सेट करें ताकि साइन अप सक्षम हो।",
    'ar': "قم بتعيين بيانات اعتماد OAuth في `<code>.env.local</code>` لتمكين التسجيل.",
    'pt': "Configure as credenciais OAuth em `<code>.env.local</code>` para ativar o registo.",
}

# Find insertion points and insert
for lang, join_desc, env_notice in VALUES:
    setup_val = SETUP_VALUES[lang]
    # Build the EXACT search string: auth_demo_mode_setup: '...value...',
    search = f"auth_demo_mode_setup: '{setup_val}',"
    if search in content:
        # Find the last occurrence of this pattern (to skip type section)
        idx = content.rfind(search)
        # Insert after this line
        line_end = content.find('\n', idx)
        val_block = f"\n  auth_join_desc: '{join_desc}'\n  auth_env_setup_notice: '{env_notice}'"
        content = content[:line_end+1] + val_block + content[line_end+1:]
        print(f'  [{lang}] Inserted (single quote)')
    else:
        # Try double quotes
        search2 = f'auth_demo_mode_setup: "{setup_val}",'
        if search2 in content:
            idx = content.rfind(search2)
            line_end = content.find('\n', idx)
            val_block = f'\n  auth_join_desc: "{join_desc}"\n  auth_env_setup_notice: "{env_notice}"'
            content = content[:line_end+1] + val_block + content[line_end+1:]
            print(f'  [{lang}] Inserted (double quote)')
        else:
            print(f'  [{lang}] NOT FOUND')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
f2 = open(FILE, encoding='utf-8')
c = f2.read()
f2.close()
en_count = c.count("auth_join_desc: 'Join LabProGlobal")
print(f'Verification: en_count={en_count}')
