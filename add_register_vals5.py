"""Insert auth_join_desc and auth_env_setup_notice after auth_demo_mode_setup values."""
FILE = r'E:\novatech-store\lib\i18n\translations.ts'
with open(FILE, encoding='utf-8') as f:
    content = f.read()

# Exact auth_demo_mode_setup values from the file
SETUP_VALUES = {
    'en': "Set up OAuth credentials in `.env.local` to enable sign up.",
    'zh': "请在 `.env.local` 中配置 OAuth 凭证以启用注册。",
    'es': "Configure las credenciales OAuth en `.env.local` para habilitar el registro.",
    'ja': "`<code>.env.local</code>` にOAuth認証情報を設定してサインアップを有効にします。",
    'hi': "साइन अप सक्षम करने के लिए `.env.local` में OAuth क्रेडेंशियल्स सेट करें।",
    'ar': "قم بتعيين بيانات اعتماد OAuth في `.env.local` لتمكين التسجيل.",
    'pt': "Configure as credenciais OAuth em `.env.local` para ativar o registo.",
}

VALUES = {
    'en': ("Join LabProGlobal to manage orders and request quotes",
           "Set up OAuth credentials in <code>.env.local</code> to enable sign up."),
    'zh': ("注册 LabProGlobal，管理订单并请求报价",
           "请在 <code>.env.local</code> 中配置 OAuth 凭证以启用注册。"),
    'es': ("Únete a LabProGlobal para gestionar pedidos y solicitar cotizaciones",
           "Configure las credenciales OAuth en <code>.env.local</code> para habilitar el registro."),
    'ja': ("LabProGlobalに参加して注文管理と見積もり依頼",
           "<code>.env.local</code> にOAuth認証情報を設定してサインアップを有効にします。"),
    'hi': ("LabProGlobal से जुड़ें और ऑर्डर प्रबंधित करें तथा कोट्स का अनुरोध करें",
           "<code>.env.local</code> में OAuth क्रेडेंशियल्स सेट करें ताकि साइन अप सक्षम हो।"),
    'ar': ("انضم إلى LabProGlobal لإدارة الطلبات وطلب عروض الأسعار",
           "قم بتعيين بيانات اعتماد OAuth في <code>.env.local</code> لتمكين التسجيل."),
    'pt': ("Junte-se ao LabProGlobal para gerenciar pedidos y solicitar orçamentos",
           "Configure as credenciais OAuth em <code>.env.local</code> para ativar o registo."),
}

for lang in SETUP_VALUES:
    setup_val = SETUP_VALUES[lang]
    # Check if values already inserted for this language
    join_desc = VALUES[lang][0]
    if f"auth_join_desc: '{join_desc}'" in content or f'auth_join_desc: "{join_desc}"' in content:
        print(f'  [{lang}] Already present')
        continue

    # Build search for single-quote version
    search_sq = f"auth_demo_mode_setup: '{setup_val}',"
    search_dq = f'auth_demo_mode_setup: "{setup_val}",'

    if search_sq in content:
        idx = content.rfind(search_sq)
        line_end = content.find('\n', idx)
        val_block = f"\n  auth_join_desc: '{join_desc}'\n  auth_env_setup_notice: '{VALUES[lang][1]}'"
        content = content[:line_end+1] + val_block + content[line_end+1:]
        print(f'  [{lang}] Inserted (single quote)')
    elif search_dq in content:
        idx = content.rfind(search_dq)
        line_end = content.find('\n', idx)
        val_block = f'\n  auth_join_desc: "{join_desc}"\n  auth_env_setup_notice: "{VALUES[lang][1]}"'
        content = content[:line_end+1] + val_block + content[line_end+1:]
        print(f'  [{lang}] Inserted (double quote)')
    else:
        print(f'  [{lang}] NOT FOUND - checking file...')
        # Try to find the line
        idx = content.find(f"auth_demo_mode_setup:")
        if idx != -1:
            end = content.find('\n', idx)
            print(f'    Found at: {repr(content[idx:end])}')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

f2 = open(FILE, encoding='utf-8')
c = f2.read()
f2.close()
print(f'\nVerification: en_count={c.count("auth_join_desc: ")} (expect 7 types+values)')
