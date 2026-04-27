"""Fix missing commas in JA section."""
FILE = r'E:\novatech-store\lib\i18n\translations.ts'
with open(FILE, encoding='utf-8') as f:
    content = f.read()

# Fix JA auth_join_desc missing comma
old = "  auth_join_desc: 'LabProGlobalに参加して注文管理と見積もり依頼'\n  auth_env_setup_notice: '<code>.env.local</code> にOAuth認証情報を設定してサインアップを有効にします。',"
new = "  auth_join_desc: 'LabProGlobalに参加して注文管理と見積もり依頼',\n  auth_env_setup_notice: '<code>.env.local</code> にOAuth認証情報を設定してサインアップを有効にします。',"
if old in content:
    content = content.replace(old, new, 1)
    print('JA comma fix: OK')
else:
    print('JA comma fix: NOT FOUND')

# Also fix HI, AR, PT
HI_OLD = "  auth_join_desc: 'LabProGlobal से जुड़ें और ऑर्डर प्रबंधित करें तथा कोट्स का अनुरोध करें'\n  auth_env_setup_notice: '<code>.env.local</code> में OAuth क्रेडेंशियल्स सेट करें ताकि साइन अप सक्षम हो।'"
HI_NEW = "  auth_join_desc: 'LabProGlobal से जुड़ें और ऑर्डर प्रबंधित करें तथा कोट्स का अनुरोध करें',\n  auth_env_setup_notice: '<code>.env.local</code> में OAuth क्रेडेंशियल्स सेट करें ताकि साइन अप सक्षम हो।',"
if HI_OLD in content:
    content = content.replace(HI_OLD, HI_NEW, 1)
    print('HI comma fix: OK')
else:
    print('HI comma fix: NOT FOUND - checking...')
    # Try without the Hindi text
    idx = content.find("auth_join_desc: 'LabProGlobal से जुड़ें")
    if idx != -1:
        end = content.find('\n', idx)
        print('  Found at:', repr(content[idx:end]))

AR_OLD = "  auth_join_desc: 'انضم إلى LabProGlobal لإدارة الطلبات وطلب عروض الأسعار'\n  auth_env_setup_notice: 'قم بتعيين بيانات اعتماد OAuth في <code>.env.local</code> لتمكين التسجيل.'"
AR_NEW = "  auth_join_desc: 'انضم إلى LabProGlobal لإدارة الطلبات وطلب عروض الأسعار',\n  auth_env_setup_notice: 'قم بتعيين بيانات اعتماد OAuth في <code>.env.local</code> لتمكين التسجيل.',"
if AR_OLD in content:
    content = content.replace(AR_OLD, AR_NEW, 1)
    print('AR comma fix: OK')
else:
    print('AR comma fix: NOT FOUND')

PT_OLD = "  auth_join_desc: 'Junte-se ao LabProGlobal para gerenciar pedidos e solicitar orçamentos'\n  auth_env_setup_notice: 'Configure as credenciais OAuth em <code>.env.local</code> para ativar o registo.'"
PT_NEW = "  auth_join_desc: 'Junte-se ao LabProGlobal para gerenciar pedidos e solicitar orçamentos',\n  auth_env_setup_notice: 'Configure as credenciais OAuth em <code>.env.local</code> para ativar o registo.',"
if PT_OLD in content:
    content = content.replace(PT_OLD, PT_NEW, 1)
    print('PT comma fix: OK')
else:
    print('PT comma fix: NOT FOUND')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

# Now add aria keys to HI, AR, PT (JA already has them)
# Find HI auth_env_setup_notice line
HI_ARIA = {
    'hi': "  aria_select_language: 'भाषा चुनें',\n  aria_language_options: 'भाषा विकल्प',\n",
    'ar': "  aria_select_language: 'اختر اللغة',\n  aria_language_options: 'خيارات اللغة',\n",
    'pt': "  aria_select_language: 'Selecionar idioma',\n  aria_language_options: 'Opções de idioma',\n",
}

# For HI, insert after auth_env_setup_notice value + comma
HI_ENV = "  auth_env_setup_notice: '<code>.env.local</code> में OAuth क्रेडेंशियल्स सेट करें ताकि साइन अप सक्षम हो।',"
AR_ENV = "  auth_env_setup_notice: 'قم بتعيين بيانات اعتماد OAuth في <code>.env.local</code> لتمكين التسجيل.',"
PT_ENV = "  auth_env_setup_notice: 'Configure as credenciais OAuth em <code>.env.local</code> para ativar o registo.',"

for lang, aria in HI_ARIA.items():
    if lang == 'hi':
        env = HI_ENV
    elif lang == 'ar':
        env = AR_ENV
    else:
        env = PT_ENV
    if env in content:
        # Check if aria already present
        aria_key = f"aria_select_language: '{HI_ARIA[lang].split(chr(39))[1]}'"
        if f"aria_select_language: '{HI_ARIA[lang].split(chr(39))[1]}'" in content:
            print(f'  [{lang}] aria already present')
            continue
        idx = content.rfind(env)
        end = content.find('\n', idx)
        # Check what follows
        next_content = content[end:].strip()
        if next_content.startswith('aria_'):
            print(f'  [{lang}] aria already present (via next_content check)')
            continue
        content = content[:end+1] + '\n' + aria + content[end+1:]
        print(f'  [{lang}] aria inserted')
    else:
        print(f'  [{lang}] env_notice value NOT FOUND')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
f2 = open(FILE, encoding='utf-8')
c = f2.read()
f2.close()
aria_count = c.count('aria_select_language: string') + c.count("aria_select_language: '") + c.count('aria_select_language: "')
print(f'\nVerification: aria_select_language count = {aria_count} (expect 8 = 1 type + 7 values)')
