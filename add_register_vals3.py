"""Add auth_join_desc and auth_env_setup_notice values to each language section."""
FILE = r'E:\novatech-store\lib\i18n\translations.ts'
with open(FILE, encoding='utf-8') as f:
    content = f.read()

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

count_quoted = lambda c, k: c.count(f"{k}: '") + c.count(f'{k}: "')

# Process sequentially - insert after each language's auth_demo_mode_setup value line
for lang, join_desc, env_notice in VALUES:
    val_needle = f"auth_join_desc: '{join_desc[:20]}"
    if val_needle in content:
        print(f'  [{lang}] Already present')
        continue

    # Find auth_demo_mode_setup: followed by a quote (value line, not type)
    pattern = 'auth_demo_mode_setup:'
    idx = 0
    while idx < len(content):
        idx = content.find(pattern, idx)
        if idx == -1:
            break
        # Check what follows
        rest = content[idx:idx+30]
        if "'" in rest or '"' in rest:
            # This is a value line
            line_end = content.find('\n', idx)
            val_block = f'\n  auth_join_desc: {join_desc!r}\n  auth_env_setup_notice: {env_notice!r}'
            content = content[:line_end+1] + val_block + content[line_end+1:]
            print(f'  [{lang}] Inserted after line ending at {line_end}')
            break
        else:
            idx += len(pattern)

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

f2 = open(FILE, encoding='utf-8')
c = f2.read()
f2.close()
val_count = c.count("auth_join_desc: '") + c.count('auth_join_desc: "')
print(f'\nVerification: auth_join_desc values = {val_count}/7')
