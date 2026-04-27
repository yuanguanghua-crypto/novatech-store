"""Add missing auth_register translation keys to translations.ts"""
FILE = r'E:\novatech-store\lib\i18n\translations.ts'
with open(FILE, encoding='utf-8') as f:
    content = f.read()

NEW_KEYS = {
    'auth_join_desc': {
        'en': "Join LabProGlobal to manage orders and request quotes",
        'zh': '注册 LabProGlobal，管理订单并请求报价',
        'es': 'Únete a LabProGlobal para gestionar pedidos y solicitar cotizaciones',
        'ja': 'LabProGlobalに参加して注文管理と見積もり依頼',
        'hi': 'LabProGlobal से जुड़ें और ऑर्डर प्रबंधित करें तथा कोट्स का अनुरोध करें',
        'ar': 'انضم إلى LabProGlobal لإدارة الطلبات وطلب عروض الأسعار',
        'pt': 'Junte-se ao LabProGlobal para gerenciar pedidos e solicitar orçamentos',
    },
    'auth_env_setup_notice': {
        'en': "Set up OAuth credentials in <code>.env.local</code> to enable sign up.",
        'zh': '请在 <code>.env.local</code> 中配置 OAuth 凭证以启用注册。',
        'es': 'Configure las credenciales OAuth en <code>.env.local</code> para habilitar el registro.',
        'ja': '<code>.env.local</code> にOAuth認証情報を設定してサインアップを有効にします。',
        'hi': '<code>.env.local</code> में OAuth क्रेडेंशियल्स सेट करें ताकि साइन अप सक्षम हो।',
        'ar': 'قم بتعيين بيانات اعتماد OAuth في <code>.env.local</code> لتمكين التسجيل.',
        'pt': 'Configure as credenciais OAuth em <code>.env.local</code> para ativar o registo.',
    },
}

type_block = '\n  auth_join_desc: string\n  auth_env_setup_notice: string'

# 1. Insert types after auth_demo_mode_setup: string
type_needle = '  auth_demo_mode_setup: string'
idx = content.find(type_needle)
if idx == -1:
    print('ERROR: auth_demo_mode_setup: string not found')
else:
    end = content.find('\n', idx)
    content = content[:end+1] + type_block + content[end+1:]
    print('[types] OK')

# 2. Insert values after auth_demo_mode_setup value in each language
LANGS = ['en', 'zh', 'es', 'ja', 'hi', 'ar', 'pt']
for lang in LANGS:
    needle = f"  auth_join_desc:"
    if needle in content:
        print(f'  [{lang}] Values already inserted, skipping')
        continue
    # Build the value block
    val_block = f'\n  auth_join_desc: {NEW_KEYS["auth_join_desc"][lang]!r}\n  auth_env_setup_notice: {NEW_KEYS["auth_env_setup_notice"][lang]!r}'
    # Find auth_demo_mode_setup value line (after auth_demo_mode_notice)
    notice_needle = f"auth_demo_mode_notice:"
    idx_n = content.find(notice_needle)
    if idx_n == -1:
        print(f'  [{lang}] auth_demo_mode_notice not found, trying fallback')
        # Find auth_demo_mode_setup: string (types section already updated)
        setup_str = '  auth_demo_mode_setup: string'
        idx_s = content.find(setup_str)
        if idx_s != -1:
            end = content.find('\n', idx_s)
            content = content[:end+1] + '\n' + val_block + content[end+1:]
            print(f'  [{lang}] Inserted after types (fallback)')
        continue
    # Find end of auth_demo_mode_setup value line
    # Pattern: auth_demo_mode_setup: "...\n\n"
    setup_needle = f"auth_demo_mode_setup:"
    idx_s = content.find(setup_needle, idx_n)
    if idx_s == -1:
        print(f'  [{lang}] auth_demo_mode_setup not found after notice')
        continue
    # Find the end of that line
    end = content.find('\n', idx_s)
    # Check if next line is also part of the string (ends with comma)
    if end < len(content) - 1 and content[end+1] not in ['\n', ' ', '  //', '  }']:
        end2 = content.find('\n', end+1)
        if content[end+1:].strip().startswith('"') or content[end+1:].strip().startswith("'"):
            end = end2
    # Insert after auth_demo_mode_setup line
    content = content[:end+1] + val_block + content[end+1:]
    print(f'  [{lang}] OK')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
f2 = open(FILE, encoding='utf-8')
c = f2.read()
f2.close()
print(f'\nVerification: auth_join_desc count = {c.count("auth_join_desc: string")}, auth_env_setup_notice count = {c.count("auth_env_setup_notice: string")}')
