"""Add addr_* and quotes_* keys to zh/es/ja/hi/ar/pt language blocks."""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

ADDR_KEYS = [
    'addr_title', 'addr_subtitle', 'addr_add_address', 'addr_new_address',
    'addr_label', 'addr_first_name', 'addr_last_name', 'addr_address1',
    'addr_address2', 'addr_city', 'addr_state', 'addr_zip', 'addr_country',
    'addr_phone_optional', 'addr_save', 'addr_cancel', 'addr_no_addresses',
    'addr_add_first', 'addr_add_first_desc', 'addr_add_first_btn',
    'addr_default', 'addr_edit', 'addr_delete', 'addr_loading',
]

QUOTES_KEYS = [
    'quotes_title', 'quotes_subtitle', 'quotes_loading', 'quotes_no_quotes',
    'quotes_no_quotes_desc', 'quotes_request_new', 'quotes_request_quote',
    'quotes_quote_number', 'quotes_date', 'quotes_items', 'quotes_est_total',
    'quotes_status', 'quotes_status_pending', 'quotes_status_approved',
    'quotes_status_rejected',
]

# Translations for zh/es/ja/hi/ar/pt
TRANSLATIONS = {
    'zh': {
        'addr_title': '地址簿',
        'addr_subtitle': '管理您的收货和账单地址',
        'addr_add_address': '添加地址',
        'addr_new_address': '新地址',
        'addr_label': '地址标签',
        'addr_first_name': '名',
        'addr_last_name': '姓',
        'addr_address1': '地址行 1',
        'addr_address2': '地址行 2',
        'addr_city': '城市',
        'addr_state': '州/省',
        'addr_zip': '邮政编码',
        'addr_country': '国家',
        'addr_phone_optional': '电话（可选）',
        'addr_save': '保存地址',
        'addr_cancel': '取消',
        'addr_no_addresses': '暂无保存地址',
        'addr_add_first': '添加您的第一个地址',
        'addr_add_first_desc': '添加一个收货或账单地址以加快结账流程。',
        'addr_add_first_btn': '添加地址',
        'addr_default': '默认',
        'addr_edit': '编辑',
        'addr_delete': '删除',
        'addr_loading': '加载地址中...',
        'quotes_title': '我的报价',
        'quotes_subtitle': '查看您提交的报价请求',
        'quotes_loading': '加载报价中...',
        'quotes_no_quotes': '暂无报价',
        'quotes_no_quotes_desc': '当您提交报价请求后，将在此处显示。',
        'quotes_request_new': '申请报价',
        'quotes_request_quote': '申请报价',
        'quotes_quote_number': '报价单号',
        'quotes_date': '日期',
        'quotes_items': '商品数量',
        'quotes_est_total': '预估总额',
        'quotes_status': '状态',
        'quotes_status_pending': '待处理',
        'quotes_status_approved': '已批准',
        'quotes_status_rejected': '已拒绝',
    },
    'es': {
        'addr_title': 'Direcciones',
        'addr_subtitle': 'Gestione sus direcciones de envío y facturación',
        'addr_add_address': 'Añadir dirección',
        'addr_new_address': 'Nueva dirección',
        'addr_label': 'Etiqueta de dirección',
        'addr_first_name': 'Nombre',
        'addr_last_name': 'Apellido',
        'addr_address1': 'Dirección línea 1',
        'addr_address2': 'Dirección línea 2',
        'addr_city': 'Ciudad',
        'addr_state': 'Estado / Provincia',
        'addr_zip': 'Código postal',
        'addr_country': 'País',
        'addr_phone_optional': 'Teléfono (opcional)',
        'addr_save': 'Guardar dirección',
        'addr_cancel': 'Cancelar',
        'addr_no_addresses': 'Sin direcciones guardadas',
        'addr_add_first': 'Añade tu primera dirección',
        'addr_add_first_desc': 'Añade una dirección de envío o facturación para un pago más rápido.',
        'addr_add_first_btn': 'Añadir dirección',
        'addr_default': 'Por defecto',
        'addr_edit': 'Editar',
        'addr_delete': 'Eliminar',
        'addr_loading': 'Cargando direcciones...',
        'quotes_title': 'Mis Cotizaciones',
        'quotes_subtitle': 'Ver sus solicitudes de cotización enviadas',
        'quotes_loading': 'Cargando cotizaciones...',
        'quotes_no_quotes': 'Sin cotizaciones aún',
        'quotes_no_quotes_desc': 'Cuando envíe una solicitud de cotización, aparecerá aquí.',
        'quotes_request_new': 'Solicitar cotización',
        'quotes_request_quote': 'Solicitar cotización',
        'quotes_quote_number': 'Cotización #',
        'quotes_date': 'Fecha',
        'quotes_items': 'Artículos',
        'quotes_est_total': 'Total estimado',
        'quotes_status': 'Estado',
        'quotes_status_pending': 'Pendiente',
        'quotes_status_approved': 'Aprobada',
        'quotes_status_rejected': 'Rechazada',
    },
    'ja': {
        'addr_title': '住所簿',
        'addr_subtitle': '配送先と請求先住所の管理',
        'addr_add_address': '住所を追加',
        'addr_new_address': '新しい住所',
        'addr_label': '住所ラベル',
        'addr_first_name': '名',
        'addr_last_name': '姓',
        'addr_address1': '住所1',
        'addr_address2': '住所2',
        'addr_city': '市区町村',
        'addr_state': '都道府県',
        'addr_zip': '郵便番号',
        'addr_country': '国',
        'addr_phone_optional': '電話番号（任意）',
        'addr_save': '住所を保存',
        'addr_cancel': 'キャンセル',
        'addr_no_addresses': '保存された住所はありません',
        'addr_add_first': '最初の住所を追加',
        'addr_add_first_desc': '配送先または請求先住所を追加して、より迅速にチェックアウトしましょう。',
        'addr_add_first_btn': '住所を追加',
        'addr_default': 'デフォルト',
        'addr_edit': '編集',
        'addr_delete': '削除',
        'addr_loading': '住所を読み込み中...',
        'quotes_title': 'マイ見積',
        'quotes_subtitle': '提交した見積依頼を確認',
        'quotes_loading': '見積を読み込み中...',
        'quotes_no_quotes': '見積はまだありません',
        'quotes_no_quotes_desc': '見積を依頼すると、ここに表示されます。',
        'quotes_request_new': '見積を依頼',
        'quotes_request_quote': '見積を依頼',
        'quotes_quote_number': '見積番号',
        'quotes_date': '日付',
        'quotes_items': '商品数',
        'quotes_est_total': '見積合計',
        'quotes_status': 'ステータス',
        'quotes_status_pending': '保留中',
        'quotes_status_approved': '承認済み',
        'quotes_status_rejected': '却下',
    },
    'hi': {
        'addr_title': 'पता पुस्तिका',
        'addr_subtitle': 'अपने शिपिंग और बिलिंग पतों का प्रबंधन करें',
        'addr_add_address': 'पता जोड़ें',
        'addr_new_address': 'नया पता',
        'addr_label': 'पता लेबल',
        'addr_first_name': 'पहला नाम',
        'addr_last_name': 'अंतिम नाम',
        'addr_address1': 'पता पंक्ति 1',
        'addr_address2': 'पता पंक्ति 2',
        'addr_city': 'शहर',
        'addr_state': 'राज्य / प्रांत',
        'addr_zip': 'पिन कोड',
        'addr_country': 'देश',
        'addr_phone_optional': 'फोन (वैकल्पिक)',
        'addr_save': 'पता सहेजें',
        'addr_cancel': 'रद्द करें',
        'addr_no_addresses': 'कोई सहेजा गया पता नहीं',
        'addr_add_first': 'अपना पहला पता जोड़ें',
        'addr_add_first_desc': 'तेज़ चेकआउट के लिए शिपिंग या बिलिंग पता जोड़ें।',
        'addr_add_first_btn': 'पता जोड़ें',
        'addr_default': 'डिफ़ॉल्ट',
        'addr_edit': 'संपादित करें',
        'addr_delete': 'हटाएं',
        'addr_loading': 'पते लोड हो रहे हैं...',
        'quotes_title': 'मेरे उद्धरण',
        'quotes_subtitle': 'आपके जमा किए गए उद्धरण अनुरोध देखें',
        'quotes_loading': 'उद्धरण लोड हो रहे हैं...',
        'quotes_no_quotes': 'अभी तक कोई उद्धरण नहीं',
        'quotes_no_quotes_desc': 'जब आप उद्धरण अनुरोध जमा करेंगे, तो यह यहाँ दिखाई देगा।',
        'quotes_request_new': 'उद्धरण का अनुरोध करें',
        'quotes_request_quote': 'उद्धरण का अनुरोध करें',
        'quotes_quote_number': 'उद्धरण #',
        'quotes_date': 'तारीख',
        'quotes_items': 'आइटम',
        'quotes_est_total': 'अनुमानित कुल',
        'quotes_status': 'स्थिति',
        'quotes_status_pending': 'लंबित',
        'quotes_status_approved': 'स्वीकृत',
        'quotes_status_rejected': 'अस्वीकृत',
    },
    'ar': {
        'addr_title': 'دفتر العناوين',
        'addr_subtitle': 'إدارة عناوين الشحن والفوترة',
        'addr_add_address': 'إضافة عنوان',
        'addr_new_address': 'عنوان جديد',
        'addr_label': 'تسمية العنوان',
        'addr_first_name': 'الاسم الأول',
        'addr_last_name': 'اسم العائلة',
        'addr_address1': 'سطر العنوان 1',
        'addr_address2': 'سطر العنوان 2',
        'addr_city': 'المدينة',
        'addr_state': 'الولاية / المقاطعة',
        'addr_zip': 'الرمز البريدي',
        'addr_country': 'الدولة',
        'addr_phone_optional': 'الهاتف (اختياري)',
        'addr_save': 'حفظ العنوان',
        'addr_cancel': 'إلغاء',
        'addr_no_addresses': 'لا توجد عناوين محفوظة',
        'addr_add_first': 'أضف عنوانك الأول',
        'addr_add_first_desc': 'أضف عنوان شحن أو فوترة لإتمام عملية الشراء بشكل أسرع.',
        'addr_add_first_btn': 'إضافة عنوان',
        'addr_default': 'افتراضي',
        'addr_edit': 'تعديل',
        'addr_delete': 'حذف',
        'addr_loading': 'جاري تحميل العناوين...',
        'quotes_title': 'عروضي',
        'quotes_subtitle': 'عرض طلبات عروض الأسعار المقدمة',
        'quotes_loading': 'جاري تحميل العروض...',
        'quotes_no_quotes': 'لا توجد عروض بعد',
        'quotes_no_quotes_desc': 'عند تقديم طلب عرض أسعار، سيظهر هنا.',
        'quotes_request_new': 'طلب عرض أسعار',
        'quotes_request_quote': 'طلب عرض أسعار',
        'quotes_quote_number': 'عرض #',
        'quotes_date': 'التاريخ',
        'quotes_items': 'العناصر',
        'quotes_est_total': 'الإجمالي المقدر',
        'quotes_status': 'الحالة',
        'quotes_status_pending': 'قيد الانتظار',
        'quotes_status_approved': 'موافق عليه',
        'quotes_status_rejected': 'مرفوض',
    },
    'pt': {
        'addr_title': 'Livro de Endereços',
        'addr_subtitle': 'Gerencie seus endereços de entrega e cobrança',
        'addr_add_address': 'Adicionar Endereço',
        'addr_new_address': 'Novo Endereço',
        'addr_label': 'Rótulo do Endereço',
        'addr_first_name': 'Nome',
        'addr_last_name': 'Sobrenome',
        'addr_address1': 'Endereço Linha 1',
        'addr_address2': 'Endereço Linha 2',
        'addr_city': 'Cidade',
        'addr_state': 'Estado / Província',
        'addr_zip': 'CEP',
        'addr_country': 'País',
        'addr_phone_optional': 'Telefone (opcional)',
        'addr_save': 'Salvar Endereço',
        'addr_cancel': 'Cancelar',
        'addr_no_addresses': 'Nenhum endereço salvo',
        'addr_add_first': 'Adicione seu primeiro endereço',
        'addr_add_first_desc': 'Adicione um endereço de entrega ou cobrança para um checkout mais rápido.',
        'addr_add_first_btn': 'Adicionar Endereço',
        'addr_default': 'Padrão',
        'addr_edit': 'Editar',
        'addr_delete': 'Excluir',
        'addr_loading': 'Carregando endereços...',
        'quotes_title': 'Minhas Cotações',
        'quotes_subtitle': 'Veja suas solicitações de cotação enviadas',
        'quotes_loading': 'Carregando cotações...',
        'quotes_no_quotes': 'Nenhuma cotação ainda',
        'quotes_no_quotes_desc': 'Quando você enviar uma solicitação de cotação, ela aparecerá aqui.',
        'quotes_request_new': 'Solicitar Cotação',
        'quotes_request_quote': 'Solicitar Cotação',
        'quotes_quote_number': 'Cotação #',
        'quotes_date': 'Data',
        'quotes_items': 'Itens',
        'quotes_est_total': 'Total Estimado',
        'quotes_status': 'Status',
        'quotes_status_pending': 'Pendente',
        'quotes_status_approved': 'Aprovada',
        'quotes_status_rejected': 'Rejeitada',
    },
}

with open(r'E:\novatech-store\lib\i18n\translations.ts', encoding='utf-8') as f:
    lines = f.readlines()

def find_block_start(lang):
    for i, line in enumerate(lines):
        if re.match(f'^const {lang}:', line):
            return i
    return None

def find_block_end(start):
    depth = 0
    for j in range(start, len(lines)):
        line = lines[j]
        if j > start and re.match(r'^const \w+:', line):
            return j
        depth += line.count('{') - line.count('}')
        if j > start and depth <= 0:
            return j
    return len(lines)

for lang, trans in TRANSLATIONS.items():
    start = find_block_start(lang)
    if start is None:
        print(f'{lang}: NOT FOUND')
        continue

    # Get existing keys in this block
    existing = set()
    for line in lines[start:]:
        m = re.match(r'^\s+(\w+):', line)
        if m:
            existing.add(m.group(1))
        if re.match(r'^const \w+:', line) or re.match(r'^export const', line):
            break

    # Find missing keys
    missing_keys = [k for k in (ADDR_KEYS + QUOTES_KEYS) if k not in existing]
    if not missing_keys:
        print(f'{lang}: already complete')
        continue

    # Find insertion point - after checkout_request_quote
    insert_idx = None
    for i in range(start, len(lines)):
        m = re.match(r'^\s+(checkout_request_quote):', lines[i])
        if m:
            # Find the end of this line (may span multiple lines due to string)
            insert_idx = i + 1
            break

    if insert_idx is None:
        print(f'{lang}: checkout_request_quote not found!')
        continue

    # Build new lines
    new_lines = ['\n']
    for key in missing_keys:
        val = trans.get(key, f'[MISSING:{key}]')
        new_lines.append(f"  {key}: '{val}',\n")

    # Insert
    lines = lines[:insert_idx] + new_lines + lines[insert_idx:]
    print(f'{lang}: added {len(missing_keys)} keys')

with open(r'E:\novatech-store\lib\i18n\translations.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Done!')
