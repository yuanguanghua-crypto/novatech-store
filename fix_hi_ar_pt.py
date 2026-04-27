"""Fix missing commas and add aria keys for HI, AR, PT."""
FILE = r'E:\novatech-store\lib\i18n\translations.ts'
with open(FILE, encoding='utf-8') as f:
    content = f.read()

# Define what we need to add/fix for each language
LANGS = {
    'hi': {
        'join_desc': "  auth_join_desc: 'LabProGlobal से जुड़ें और ऑर्डर प्रबंधित करें तथा कोट्स का अनुरोध करें'",
        'env_notice': "  auth_env_setup_notice: '<code>.env.local</code> में OAuth क्रेडेंशियल्स सेट करें ताकि साइन अप सक्षम हो।'",
        'aria_sel': "  aria_select_language: 'भाषा चुनें',",
        'aria_opt': "  aria_language_options: 'भाषा विकल्प',",
    },
    'ar': {
        'join_desc': "  auth_join_desc: 'انضم إلى LabProGlobal لإدارة الطلبات وطلب عروض الأسعار'",
        'env_notice': "  auth_env_setup_notice: 'قم بتعيين بيانات اعتماد OAuth في <code>.env.local</code> لتمكين التسجيل.'",
        'aria_sel': "  aria_select_language: 'اختر اللغة',",
        'aria_opt': "  aria_language_options: 'خيارات اللغة',",
    },
    'pt': {
        'join_desc': "  auth_join_desc: 'Junte-se ao LabProGlobal para gerenciar pedidos e solicitar orçamentos'",
        'env_notice': "  auth_env_setup_notice: 'Configure as credenciais OAuth em <code>.env.local</code> para ativar o registo.'",
        'aria_sel': "  aria_select_language: 'Selecionar idioma',",
        'aria_opt': "  aria_language_options: 'Opções de idioma',",
    },
}

for lang, vals in LANGS.items():
    # Step 1: Fix join_desc missing comma
    old_jd = vals['join_desc']
    new_jd = old_jd + ','
    if old_jd in content:
        content = content.replace(old_jd, new_jd, 1)
        print(f'  [{lang}] join_desc comma: OK')
    else:
        print(f'  [{lang}] join_desc: NOT FOUND')

    # Step 2: Fix env_notice missing comma
    old_en = vals['env_notice']
    new_en = old_en + ','
    if old_en in content:
        content = content.replace(old_en, new_en, 1)
        print(f'  [{lang}] env_notice comma: OK')
    else:
        print(f'  [{lang}] env_notice: NOT FOUND')

    # Step 3: Add aria keys after env_notice (if not already present)
    # Extract the language name from aria_sel, e.g. 'भाषा चुनें' from "  aria_select_language: 'भाषा चुनें',"
    aria_parts = vals['aria_sel'].split(": '")
    aria_lang_name = aria_parts[1].rstrip(",'") if len(aria_parts) > 1 else ''
    if f"aria_select_language: '{aria_lang_name}'" in content or f'aria_select_language: "{aria_lang_name}"' in content:
        print(f'  [{lang}] aria: already present')
        continue
    # Insert after the fixed env_notice
    if new_en in content:
        idx = content.rfind(new_en)
        end = content.find('\n', idx)
        content = content[:end+1] + '\n' + vals['aria_sel'] + '\n' + vals['aria_opt'] + '\n' + content[end+1:]
        print(f'  [{lang}] aria: inserted')
    else:
        print(f'  [{lang}] aria: skipped (env_notice not found)')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

f2 = open(FILE, encoding='utf-8')
c = f2.read()
f2.close()
aria_count = c.count('aria_select_language: string') + c.count("aria_select_language: '") + c.count('aria_select_language: "')
print(f'\nVerification: aria_select_language count = {aria_count} (expect 8)')
