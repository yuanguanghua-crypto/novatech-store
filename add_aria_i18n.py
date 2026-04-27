"""Add aria-label translation keys for language-switcher."""
FILE = r'E:\novatech-store\lib\i18n\translations.ts'
with open(FILE, encoding='utf-8') as f:
    content = f.read()

# aria-label keys to add
ARIA_KEYS = {
    'aria_select_language': {
        'en': 'Select language',
        'zh': '选择语言',
        'es': 'Seleccionar idioma',
        'ja': '言語を選択',
        'hi': 'भाषा चुनें',
        'ar': 'اختر اللغة',
        'pt': 'Selecionar idioma',
    },
    'aria_language_options': {
        'en': 'Language options',
        'zh': '语言选项',
        'es': 'Opciones de idioma',
        'ja': '言語オプション',
        'hi': 'भाषा विकल्प',
        'ar': 'خيارات اللغة',
        'pt': 'Opções de idioma',
    },
}

# Insert in types section after auth_env_setup_notice: string
type_needle = '  auth_env_setup_notice: string'
if type_needle in content:
    idx = content.find(type_needle)
    end = content.find('\n', idx)
    type_block = '\n  aria_select_language: string\n  aria_language_options: string'
    content = content[:end+1] + type_block + content[end+1:]
    print('[types] OK')
else:
    print('[types] NOT FOUND')

# Insert in each language section after auth_env_setup_notice: '...' value
LANGS = ['en', 'zh', 'es', 'ja', 'hi', 'ar', 'pt']
for lang in LANGS:
    key = f'auth_env_setup_notice: "{ARIA_KEYS["aria_select_language"][lang]}"'
    if f'aria_select_language: "{ARIA_KEYS["aria_select_language"][lang]}"' in content or f"aria_select_language: '{ARIA_KEYS['aria_select_language'][lang]}'" in content:
        print(f'  [{lang}] Already present')
        continue
    # Find the value (search for the auth_env_setup_notice value)
    # Build all possible search strings
    env_notice_vals = {
        'en': "Set up OAuth credentials in <code>.env.local</code> to enable sign up.",
        'zh': "请在 <code>.env.local</code> 中配置 OAuth 凭证以启用注册。",
        'es': "Configure las credenciales OAuth en <code>.env.local</code> para habilitar el registro.",
        'ja': "<code>.env.local</code> にOAuth認証情報を設定してサインアップを有効にします。",
        'hi': "<code>.env.local</code> में OAuth क्रेडेंशियल्स सेट करें ताकि साइन अप सक्षम हो।",
        'ar': "قم بتعيين بيانات اعتماد OAuth في <code>.env.local</code> لتمكين التسجيل.",
        'pt': "Configure as credenciais OAuth em <code>.env.local</code> para ativar o registo.",
    }
    val = env_notice_vals[lang]
    sq = f"auth_env_setup_notice: '{val}',"
    dq = f'auth_env_setup_notice: "{val}",'
    found = False
    for search in [sq, dq]:
        if search in content:
            idx = content.rfind(search)
            end = content.find('\n', idx)
            val_block = f"\n  aria_select_language: '{ARIA_KEYS['aria_select_language'][lang]}'\n  aria_language_options: '{ARIA_KEYS['aria_language_options'][lang]}'"
            content = content[:end+1] + val_block + content[end+1:]
            print(f'  [{lang}] OK')
            found = True
            break
    if not found:
        print(f'  [{lang}] NOT FOUND env_notice')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

f2 = open(FILE, encoding='utf-8')
c = f2.read()
f2.close()
type_count = c.count('aria_select_language: string')
val_count = c.count("aria_select_language: '") + c.count('aria_select_language: "')
print(f'\nVerification: types={type_count}, values={val_count}/7')
