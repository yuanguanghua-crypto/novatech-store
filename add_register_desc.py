"""Add auth_register_desc after auth_register_title in each language."""
FILE = r'E:\novatech-store\lib\i18n\translations.ts'
with open(FILE, encoding='utf-8') as f:
    content = f.read()

# Map of language to existing auth_register_title value (from translations.ts)
TITLE_VALS = {
    'en': 'Create an Account',
    'zh': '创建账户',
    'es': 'Crear una Cuenta',
    'ja': 'アカウントを作成',
    'hi': 'एक खाता बनाएं',
    'ar': 'إنشاء حساب جديد',
    'pt': 'Criar uma Conta',
}

# Map of language to description value
DESC_VALS = {
    'en': "Create your LabProGlobal account to manage orders and request quotes",
    'zh': '创建 LabProGlobal 账户以管理订单并请求报价',
    'es': 'Crea tu cuenta LabProGlobal para gestionar pedidos y solicitar cotizaciones',
    'ja': 'LabProGlobalアカウントを作成して注文管理和見積もり依頼',
    'hi': 'LabProGlobal खाता बनाएं ताकि ऑर्डर प्रबंधित करें और कोट्स का अनुरोध करें',
    'ar': 'أنشئ حساب LabProGlobal لإدارة الطلبات وطلب عروض الأسعار',
    'pt': 'Crie sua conta LabProGlobal para gerenciar pedidos e solicitar orçamentos',
}

for lang in TITLE_VALS:
    desc = DESC_VALS[lang]
    # Check if already present
    if f"auth_register_desc: '{desc}'" in content:
        print(f'  [{lang}] Already present')
        continue
    # Find auth_register_title: 'value' for this language
    title_val = TITLE_VALS[lang]
    search = f"auth_register_title: '{title_val}',"
    if search not in content:
        print(f'  [{lang}] NOT FOUND: {repr(title_val)}')
        continue
    # Insert after this line
    idx = content.rfind(search)
    line_end = content.find('\n', idx)
    content = content[:line_end+1] + f"\n  auth_register_desc: '{desc}'," + content[line_end+1:]
    print(f'  [{lang}] Inserted')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

f2 = open(FILE, encoding='utf-8')
c = f2.read()
f2.close()
val_count = c.count("auth_register_desc: '")
print(f'\nVerification: auth_register_desc values = {val_count}/7')
