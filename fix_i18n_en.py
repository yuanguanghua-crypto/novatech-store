"""
修复 translations.ts 中缺失的英文和账户 key。
"""
filepath = r"E:\novatech-store\lib\i18n\translations.ts"
with open(filepath, encoding="utf-8") as f:
    content = f.read()

# ============================================================
# 1. 英文 auth keys: 在 auth_or_continue 之后、// Footer 之前插入
# ============================================================
en_auth = """
  auth_welcome_back: 'Welcome Back',
  auth_sign_in_subtitle: 'Sign in to manage your orders and quotes',
  auth_demo_credentials: 'Demo credentials',
  auth_demo_email: 'admin@labproglobal.com',
  auth_demo_password: 'Admin@1234',
  auth_invalid_credentials: 'Invalid email or password. Please try again.',
  auth_auth_failed: 'Authentication failed. Please try again.',
  auth_signing_in: 'Signing in...',
  auth_enter_password: 'Enter your password',
  auth_create_account_link: 'Create one',
  auth_company_optional: 'Company (optional)',
  auth_min_password: 'Min. 8 characters',
  auth_create_account_btn: 'Create Account',
  auth_already_have: 'Already have an account?',
  auth_sign_in_link: 'Sign in',
  auth_demo_mode: 'Demo Mode',
  auth_demo_mode_notice: 'Registration is not yet configured.',
  auth_demo_mode_setup: "Set up OAuth credentials in `.env.local` to enable sign up.",
"""

content = content.replace(
    "  auth_or_continue: 'Or continue with',\n\n  // Footer",
    "  auth_or_continue: 'Or continue with'," + en_auth + "\n\n  // Footer"
)

# ============================================================
# 2. 英文 addr/quote keys: 在 account_order_date: 'Date:', 之后
# ============================================================
en_addr = """
  addr_title: 'Address Book',
  addr_subtitle: 'Manage your shipping and billing addresses',
  addr_add_address: 'Add Address',
  addr_new_address: 'New Address',
  addr_label: 'Address Label',
  addr_first_name: 'First Name',
  addr_last_name: 'Last Name',
  addr_address1: 'Address Line 1',
  addr_address2: 'Address Line 2',
  addr_city: 'City',
  addr_state: 'State / Province',
  addr_zip: 'ZIP / Postal Code',
  addr_country: 'Country',
  addr_phone_optional: 'Phone (optional)',
  addr_save: 'Save Address',
  addr_cancel: 'Cancel',
  addr_no_addresses: 'No addresses saved',
  addr_add_first: 'Add Your First Address',
  addr_add_first_desc: 'Add a shipping or billing address for faster checkout.',
  addr_add_first_btn: 'Add Your First Address',
  addr_edit: 'Edit',
  addr_delete: 'Delete',
  addr_default: 'Default',
  addr_loading: 'Loading...',
"""

en_quotes = """
  quotes_title: 'My Quotes',
  quotes_subtitle: 'View and manage your quote requests',
  quotes_request_new: 'Request New Quote',
  quotes_quote_number: 'Quote #',
  quotes_date: 'Date',
  quotes_items: 'Items',
  quotes_est_total: 'Est. Total',
  quotes_status: 'Status',
  quotes_status_pending: 'Pending Review',
  quotes_status_approved: 'Approved',
  quotes_status_rejected: 'Rejected',
  quotes_no_quotes: 'No quotes yet',
  quotes_no_quotes_desc: 'Need a custom quote for bulk orders or hard-to-find items?',
  quotes_request_quote: 'Request a Quote',
  quotes_loading: 'Loading...',
"""

content = content.replace(
    "  account_order_date: 'Date:',\n\n  products_page_title",
    "  account_order_date: 'Date:'," + en_addr + en_quotes + "\n\n  products_page_title"
)

# ============================================================
# 3. 日语翻译 keys (从其他语言复制结构，简化)
# ============================================================
ja_auth = """
  auth_welcome_back: 'おかえりなさい',
  auth_sign_in_subtitle: 'ログインして注文と見積を管理',
  auth_demo_credentials: 'デモ資格情報',
  auth_demo_email: 'admin@labproglobal.com',
  auth_demo_password: 'Admin@1234',
  auth_invalid_credentials: 'メールアドレスまたはパスワードが無効です。',
  auth_auth_failed: '認証に失敗しました。もう一度お試しください。',
  auth_signing_in: 'ログイン中...',
  auth_enter_password: 'パスワードを入力',
  auth_create_account_link: 'アカウントを作成',
  auth_company_optional: '会社名（任意）',
  auth_min_password: '8文字以上',
  auth_create_account_btn: 'アカウント作成',
  auth_already_have: 'すでにアカウントをお持ちですか？',
  auth_sign_in_link: 'ログイン',
  auth_demo_mode: 'デモモード',
  auth_demo_mode_notice: '登録は 아직 구성되지 않았습니다.',
  auth_demo_mode_setup: '`.env.local`でOAuth資格情報を設定してください。',
"""

ja_addr = """
  addr_title: '住所録',
  addr_subtitle: '配送先と請求先の住所を管理',
  addr_add_address: '住所を追加',
  addr_new_address: '新しい住所',
  addr_label: '住所ラベル',
  addr_first_name: '名',
  addr_last_name: '姓',
  addr_address1: '住所1',
  addr_address2: '住所2',
  addr_city: '市区町村',
  addr_state: '都道府県',
  addr_zip: '郵便番号',
  addr_country: '国',
  addr_phone_optional: '電話番号（任意）',
  addr_save: '住所を保存',
  addr_cancel: 'キャンセル',
  addr_no_addresses: '保存された住所はありません',
  addr_add_first: '最初の住所を追加',
  addr_add_first_desc: '配送先または請求先住所を追加してチェックアウトを高速化',
  addr_add_first_btn: '最初の住所を追加',
  addr_edit: '編集',
  addr_delete: '削除',
  addr_default: 'デフォルト',
  addr_loading: '読み込み中...',
"""

ja_quotes = """
  quotes_title: '私の見積',
  quotes_subtitle: '見積リクエストの表示と管理',
  quotes_request_new: '新規見積を申請',
  quotes_quote_number: '見積番号',
  quotes_date: '日付',
  quotes_items: '商品数',
  quotes_est_total: '概算合計',
  quotes_status: 'ステータス',
  quotes_status_pending: '審査中',
  quotes_status_approved: '承認済み',
  quotes_status_rejected: '却下',
  quotes_no_quotes: '見積はまだありません',
  quotes_no_quotes_desc: '大量注文や特殊商品のカスタム見積が必要ですか？',
  quotes_request_quote: '見積を申請',
  quotes_loading: '読み込み中...',
"""

# 日语: auth_or_continue の後
content = content.replace(
    "  auth_or_continue: 'または次で続行',\n\n  footer_about",
    "  auth_or_continue: 'または次で続行'," + ja_auth + ja_addr + ja_quotes + "\n\n  footer_about"
)

# 日语 account_order_date の後 (日语的时间格式)
content = content.replace(
    "  account_order_date: '日付：',\n\n  products_page_title",
    "  account_order_date: '日付：'," + ja_addr + ja_quotes + "\n\n  products_page_title"
)

# ============================================================
# 4. 印地语
# ============================================================
hi_auth = """
  auth_welcome_back: 'वापसी पर स्वागत है',
  auth_sign_in_subtitle: 'अपने ऑर्डर और उद्धरण प्रबंधित करने के लिए साइन इन करें',
  auth_demo_credentials: 'डेमो क्रेडेंशियल्स',
  auth_demo_email: 'admin@labproglobal.com',
  auth_demo_password: 'Admin@1234',
  auth_invalid_credentials: 'ईमेल या पासवर्ड अमान्य। कृपया पुनः प्रयास करें।',
  auth_auth_failed: 'प्रमाणीकरण विफल। कृपया पुनः प्रयास करें।',
  auth_signing_in: 'साइन इन हो रहा है...',
  auth_enter_password: 'अपना पासवर्ड दर्ज करें',
  auth_create_account_link: 'खाता बनाएं',
  auth_company_optional: 'कंपनी (वैकल्पिक)',
  auth_min_password: 'न्यूनतम 8 वर्ण',
  auth_create_account_btn: 'खाता बनाएं',
  auth_already_have: 'पहले से खाता है?',
  auth_sign_in_link: 'साइन इन करें',
  auth_demo_mode: 'डेमो मोड',
  auth_demo_mode_notice: 'पंजीकरण अभी तक कॉन्फ़िगर नहीं है।',
  auth_demo_mode_setup: 'साइन अप सक्षम करने के लिए `.env.local` में OAuth क्रेडेंशियल्स सेट करें।',
"""

hi_addr = """
  addr_title: 'पता पुस्तिका',
  addr_subtitle: 'अपने शिपिंग और बिलिंग पते प्रबंधित करें',
  addr_add_address: 'पता जोड़ें',
  addr_new_address: 'नया पता',
  addr_label: 'पता लेबल',
  addr_first_name: 'पहला नाम',
  addr_last_name: 'अंतिम नाम',
  addr_address1: 'पता पंक्ति 1',
  addr_address2: 'पता पंक्ति 2',
  addr_city: 'शहर',
  addr_state: 'राज्य / प्रांत',
  addr_zip: 'डाक कोड',
  addr_country: 'देश',
  addr_phone_optional: 'फोन (वैकल्पिक)',
  addr_save: 'पता सहेजें',
  addr_cancel: 'रद्द करें',
  addr_no_addresses: 'कोई पता सहेजा नहीं गया',
  addr_add_first: 'अपना पहला पता जोड़ें',
  addr_add_first_desc: 'तेज चेकआउट के लिए शिपिंग या बिलिंग पता जोड़ें।',
  addr_add_first_btn: 'अपना पहला पता जोड़ें',
  addr_edit: 'संपादित करें',
  addr_delete: 'हटाएं',
  addr_default: 'डिफ़ॉल्ट',
  addr_loading: 'लोड हो रहा है...',
"""

hi_quotes = """
  quotes_title: 'मेरे उद्धरण',
  quotes_subtitle: 'अपने उद्धरण अनुरोध देखें और प्रबंधित करें',
  quotes_request_new: 'नया उद्धरण अनुरोध करें',
  quotes_quote_number: 'उद्धरण #',
  quotes_date: 'तारीख',
  quotes_items: 'आइटम',
  quotes_est_total: 'अनुमानित कुल',
  quotes_status: 'स्थिति',
  quotes_status_pending: 'समीक्षा लंबित',
  quotes_status_approved: 'स्वीकृत',
  quotes_status_rejected: 'अस्वीकृत',
  quotes_no_quotes: 'अभी तक कोई उद्धरण नहीं',
  quotes_no_quotes_desc: 'थोक ऑर्डर या दुर्लभ वस्तुओं के लिए कस्टम उद्धरण चाहिए?',
  quotes_request_quote: 'उद्धरण अनुरोध करें',
  quotes_loading: 'लोड हो रहा है...',
"""

content = content.replace(
    "  auth_or_continue: 'या जारी रखें',\n\n  footer_about",
    "  auth_or_continue: 'या जारी रखें'," + hi_auth + hi_addr + hi_quotes + "\n\n  footer_about"
)

content = content.replace(
    "  account_order_date: 'तारीख:',\n\n  products_page_title",
    "  account_order_date: 'तारीख:'," + hi_addr + hi_quotes + "\n\n  products_page_title"
)

# ============================================================
# 5. 阿拉伯语
# ============================================================
ar_auth = """
  auth_welcome_back: 'مرحبا بعودتك',
  auth_sign_in_subtitle: 'سجل الدخول لإدارة طلباتك وعروض الأسعار',
  auth_demo_credentials: 'بيانات الدخول التجريبية',
  auth_demo_email: 'admin@labproglobal.com',
  auth_demo_password: 'Admin@1234',
  auth_invalid_credentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  auth_auth_failed: 'فشل المصادقة. يرجى المحاولة مرة أخرى.',
  auth_signing_in: 'جاري تسجيل الدخول...',
  auth_enter_password: 'أدخل كلمة المرور',
  auth_create_account_link: 'إنشاء حساب',
  auth_company_optional: 'الشركة (اختياري)',
  auth_min_password: '8 أحرف على الأقل',
  auth_create_account_btn: 'إنشاء حساب',
  auth_already_have: 'لديك حساب بالفعل؟',
  auth_sign_in_link: 'تسجيل الدخول',
  auth_demo_mode: 'وضع التجريب',
  auth_demo_mode_notice: 'التسجيل غير مكون بعد.',
  auth_demo_mode_setup: 'قم بتعيين بيانات اعتماد OAuth في `.env.local` لتمكين التسجيل.',
"""

ar_addr = """
  addr_title: 'دفتر العناوين',
  addr_subtitle: 'إدارة عناوين الشحن والفواتير',
  addr_add_address: 'إضافة عنوان',
  addr_new_address: 'عنوان جديد',
  addr_label: 'علامة العنوان',
  addr_first_name: 'الاسم الأول',
  addr_last_name: 'اسم العائلة',
  addr_address1: 'سطر العنوان 1',
  addr_address2: 'سطر العنوان 2',
  addr_city: 'المدينة',
  addr_state: 'الولاية / المقاطعة',
  addr_zip: 'الرمز البريدي',
  addr_country: 'الدولة',
  addr_phone_optional: 'الهاتف (اختياري)',
  addr_save: 'حفظ العنوان',
  addr_cancel: 'إلغاء',
  addr_no_addresses: 'لا توجد عناوين محفوظة',
  addr_add_first: 'أضف عنوانك الأول',
  addr_add_first_desc: 'أضف عنوان شحن أو فاتورة لتسريع عملية الدفع.',
  addr_add_first_btn: 'أضف عنوانك الأول',
  addr_edit: 'تعديل',
  addr_delete: 'حذف',
  addr_default: 'افتراضي',
  addr_loading: 'جاري التحميل...',
"""

ar_quotes = """
  quotes_title: 'عروض السعر الخاصة بي',
  quotes_subtitle: 'عرض وإدارة طلبات عروض الأسعار',
  quotes_request_new: 'طلب عرض سعر جديد',
  quotes_quote_number: 'رقم العرض',
  quotes_date: 'التاريخ',
  quotes_items: 'المنتجات',
  quotes_est_total: 'الإجمالي التقديري',
  quotes_status: 'الحالة',
  quotes_status_pending: 'قيد المراجعة',
  quotes_status_approved: 'موافق عليه',
  quotes_status_rejected: 'مرفوض',
  quotes_no_quotes: 'لا توجد عروض أسعار بعد',
  quotes_no_quotes_desc: 'هل تحتاج عرض سعر مخصص للطلبات الكبيرة أو المنتجات النادرة؟',
  quotes_request_quote: 'طلب عرض سعر',
  quotes_loading: 'جاري التحميل...',
"""

content = content.replace(
    "  auth_or_continue: 'أو المتابعة بـ',\n\n  footer_about",
    "  auth_or_continue: 'أو المتابعة بـ'," + ar_auth + ar_addr + ar_quotes + "\n\n  footer_about"
)

content = content.replace(
    "  account_order_date: 'التاريخ:',\n\n  products_page_title",
    "  account_order_date: 'التاريخ:'," + ar_addr + ar_quotes + "\n\n  products_page_title"
)

# ============================================================
# 6. 葡萄牙语
# ============================================================
pt_auth = """
  auth_welcome_back: 'Bem-vindo de volta',
  auth_sign_in_subtitle: 'Inicie sessão para gerir os seus pedidos e cotações',
  auth_demo_credentials: 'Credenciais de demonstração',
  auth_demo_email: 'admin@labproglobal.com',
  auth_demo_password: 'Admin@1234',
  auth_invalid_credentials: 'E-mail ou palavra-passe inválidos. Tente novamente.',
  auth_auth_failed: 'Falha na autenticação. Tente novamente.',
  auth_signing_in: 'Iniciando sessão...',
  auth_enter_password: 'Digite a sua palavra-passe',
  auth_create_account_link: 'Crie uma',
  auth_company_optional: 'Empresa (opcional)',
  auth_min_password: 'Mín. 8 caracteres',
  auth_create_account_btn: 'Criar Conta',
  auth_already_have: 'Já tem uma conta?',
  auth_sign_in_link: 'Iniciar sessão',
  auth_demo_mode: 'Modo Demo',
  auth_demo_mode_notice: 'O registo ainda não está configurado.',
  auth_demo_mode_setup: 'Configure as credenciais OAuth em `.env.local` para ativar o registo.',
"""

pt_addr = """
  addr_title: 'Livro de Endereços',
  addr_subtitle: 'Gerir os seus endereços de envio e faturação',
  addr_add_address: 'Adicionar Endereço',
  addr_new_address: 'Novo Endereço',
  addr_label: 'Rótulo do Endereço',
  addr_first_name: 'Nome Próprio',
  addr_last_name: 'Apelido',
  addr_address1: 'Linha de Endereço 1',
  addr_address2: 'Linha de Endereço 2',
  addr_city: 'Cidade',
  addr_state: 'Estado / Província',
  addr_zip: 'Código Postal',
  addr_country: 'País',
  addr_phone_optional: 'Telefone (opcional)',
  addr_save: 'Guardar Endereço',
  addr_cancel: 'Cancelar',
  addr_no_addresses: 'Sem endereços guardados',
  addr_add_first: 'Adicionar o Seu Primeiro Endereço',
  addr_add_first_desc: 'Adicione um endereço de envio ou faturação para um checkout mais rápido.',
  addr_add_first_btn: 'Adicionar o Seu Primeiro Endereço',
  addr_edit: 'Editar',
  addr_delete: 'Eliminar',
  addr_default: 'Predefinido',
  addr_loading: 'A carregar...',
"""

pt_quotes = """
  quotes_title: 'As Minhas Cotações',
  quotes_subtitle: 'Ver e gerir os seus pedidos de cotação',
  quotes_request_new: 'Solicitar Nova Cotação',
  quotes_quote_number: 'Cotização #',
  quotes_date: 'Data',
  quotes_items: 'Artigos',
  quotes_est_total: 'Total Est.',
  quotes_status: 'Estado',
  quotes_status_pending: 'Em Revisão',
  quotes_status_approved: 'Aprovada',
  quotes_status_rejected: 'Rejeitada',
  quotes_no_quotes: 'Sem cotações ainda',
  quotes_no_quotes_desc: 'Precisa de uma cotação personalizada para encomendas grandes ou artigos difíceis de encontrar?',
  quotes_request_quote: 'Solicitar Cotação',
  quotes_loading: 'A carregar...',
"""

content = content.replace(
    "  auth_or_continue: 'Ou continuar com',\n\n  footer_about",
    "  auth_or_continue: 'Ou continuar com'," + pt_auth + pt_addr + pt_quotes + "\n\n  footer_about"
)

content = content.replace(
    "  account_order_date: 'Data:',\n\n  products_page_title",
    "  account_order_date: 'Data:'," + pt_addr + pt_quotes + "\n\n  products_page_title"
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

# 验证
count = content.count("auth_welcome_back:")
print(f"Done! auth_welcome_back 出现次数: {count} (应为 7)")
print(f"addr_title 出现次数: {content.count('addr_title:')}")
print(f"Final file size: {len(content)} chars")
