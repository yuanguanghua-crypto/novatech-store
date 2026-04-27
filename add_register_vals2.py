"""Add auth_join_desc and auth_env_setup_notice values to each language section."""
FILE = r'E:\novatech-store\lib\i18n\translations.ts'
with open(FILE, encoding='utf-8') as f:
    content = f.read()

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
    'pt': ("Junte-se ao LabProGlobal para gerenciar pedidos e solicitar orçamentos",
           "Configure as credenciais OAuth em <code>.env.local</code> para ativar o registo."),
}

# Insert after the type declaration section ends (after 'auth_demo_mode_setup: string')
# Then insert values into each language section after 'auth_demo_mode_setup: "...(value)"'

# First, check if values already exist (quoted form)
has_quoted = lambda c, k: (f"{k}: '" in c) or (f'{k}: "' in c)
count_quoted = lambda c, k: c.count(f"{k}: '") + c.count(f'{k}: "')

for lang, (join_desc, env_notice) in VALUES.items():
    if count_quoted(content, 'auth_join_desc') >= 1:
        print(f'  [{lang}] Values already present')
        continue

    # Find auth_demo_mode_setup in this language section
    # The type section uses 'auth_demo_mode_setup: string'
    # Each language uses 'auth_demo_mode_setup: "..."' or 'auth_demo_mode_setup: '...''

    # Find all occurrences of auth_demo_mode_setup:
    pattern = 'auth_demo_mode_setup:'
    idx = 0
    occurrences = []
    while True:
        idx = content.find(pattern, idx)
        if idx == -1:
            break
        occurrences.append(idx)
        idx += len(pattern)

    # Find the LAST occurrence (this is the one in the last language section, pt)
    # We need to insert in each language section
    # A language section can be identified by looking for the value form (has quote)

    for occ_idx in occurrences:
        # Look at what follows
        rest = content[occ_idx:occ_idx+30]
        if "'" in rest or '"' in rest:
            # This is a value line (not type declaration)
            # Find end of line
            line_end = content.find('\n', occ_idx)
            # Insert after this line
            val_block = f'\n  auth_join_desc: {join_desc!r}\n  auth_env_setup_notice: {env_notice!r}'
            content = content[:line_end+1] + val_block + content[line_end+1:]
            print(f'  [{lang}] Inserted')
            break
        else:
            # Type declaration, skip
            continue

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

f2 = open(FILE, encoding='utf-8')
c = f2.read()
f2.close()
val_count = c.count("auth_join_desc: '") + c.count('auth_join_desc: "')
print(f'\nVerification: auth_join_desc values = {val_count}')
