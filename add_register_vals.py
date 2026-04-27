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

# Find the English auth section: auth_demo_mode_setup: "..."
# Insert auth_join_desc and auth_env_setup_notice after auth_demo_mode_setup value
for lang, (join_desc, env_notice) in VALUES.items():
    val_needle = f"auth_join_desc:"
    if val_needle in content:
        print(f'  [{lang}] Already present, skipping')
        continue

    # Find the line with auth_demo_mode_setup value (after auth_demo_mode_notice value)
    # Look for auth_demo_mode_setup: followed by a quote
    pattern = "auth_demo_mode_setup:"
    idx = 0
    count = 0
    while True:
        idx = content.find(pattern, idx)
        if idx == -1:
            break
        count += 1
        if count >= 2:  # Skip type section (first occurrence)
            break
        idx += len(pattern)

    if count < 2 or idx == -1:
        print(f'  [{lang}] Could not find auth_demo_mode_setup value line')
        continue

    # Find end of this line
    line_end = content.find('\n', idx)
    # Check if multiline string - look for closing quote
    rest = content[idx:line_end]
    if '"' in rest or "'" in content[idx:idx+5]:
        # Single line value
        insert_pos = line_end + 1
    else:
        # Multiline - find next line's closing
        insert_pos = line_end + 1

    val_block = f'\n  auth_join_desc: {join_desc!r}\n  auth_env_setup_notice: {env_notice!r}'
    content = content[:insert_pos] + val_block + content[insert_pos:]
    print(f'  [{lang}] Inserted at position {insert_pos}')

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
f2 = open(FILE, encoding='utf-8')
c = f2.read()
f2.close()
type_count = c.count('auth_join_desc: string')
val_count = c.count("auth_join_desc: '") + c.count('auth_join_desc: "')
print(f'\nVerification: types={type_count}, values={val_count}')
