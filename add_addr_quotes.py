# -*- coding: utf-8 -*-
"""Add missing addr_* and quotes_* keys to all language blocks"""

ADDR_QUOTES = {
    'zh': {
        'addr_title': '地址簿',
        'addr_subtitle': '管理您的收货和账单地址',
        'addr_add_address': '添加地址',
        'addr_new_address': '新地址',
        'addr_label': '地址标签',
        'addr_first_name': '名字',
        'addr_last_name': '姓氏',
        'addr_address1': '地址行1',
        'addr_address2': '地址行2',
        'addr_city': '城市',
        'addr_state': '省/州',
        'addr_zip': '邮政编码',
        'addr_country': '国家',
        'addr_phone_optional': '电话（选填）',
        'addr_save': '保存地址',
        'addr_cancel': '取消',
        'addr_no_addresses': '暂无保存的地址',
        'addr_add_first': '添加您的第一个地址',
        'addr_add_first_desc': '添加收货或账单地址以加快结算速度。',
        'addr_add_first_btn': '添加地址',
        'addr_default': '默认',
        'addr_edit': '编辑',
        'addr_delete': '删除',
        'addr_loading': '加载地址中...',
        'quotes_title': '我的报价',
        'quotes_subtitle': '查看您提交的报价请求',
        'quotes_loading': '加载报价中...',
        'quotes_no_quotes': '暂无报价',
        'quotes_no_quotes_desc': '提交报价请求后，将显示在这里。',
        'quotes_request_new': '请求报价',
        'quotes_request_quote': '请求报价',
        'quotes_quote_number': '报价单号',
        'quotes_date': '日期',
        'quotes_items': '产品',
        'quotes_est_total': '预估总额',
        'quotes_status': '状态',
        'quotes_status_pending': '待处理',
        'quotes_status_approved': '已批准',
        'quotes_status_rejected': '已拒绝',
        'quotes_subtitle': '查看您提交的报价请求',
    },
    'ja': {
        'addr_title': '住所録',
        'addr_subtitle': '配送・請求先住所を管理',
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
        'addr_no_addresses': '保存した住所はありません',
        'addr_add_first': '最初の住所を追加',
        'addr_add_first_desc': '素早いチェックアウトのために住所を追加してください。',
        'addr_add_first_btn': '住所を追加',
        'addr_default': 'デフォルト',
        'addr_edit': '編集',
        'addr_delete': '削除',
        'addr_loading': '住所を読み込み中...',
        'quotes_title': '見積もり一覧',
        'quotes_subtitle': '送信した見積もりリクエストを確認',
        'quotes_loading': '見積もりを読み込み中...',
        'quotes_no_quotes': '見積もりはありません',
        'quotes_no_quotes_desc': '見積もりリクエストを送信すると、ここに表示されます。',
        'quotes_request_new': '見積もりを依頼',
        'quotes_request_quote': '見積もり依頼',
        'quotes_quote_number': '見積もり番号',
        'quotes_date': '日付',
        'quotes_items': '商品',
        'quotes_est_total': '概算合計',
        'quotes_status': 'ステータス',
        'quotes_status_pending': '保留中',
        'quotes_status_approved': '承認済み',
        'quotes_status_rejected': '却下',
    },
    'hi': {
        'addr_title': 'पता पुस्तिका',
        'addr_subtitle': 'अपने शिपिंग और बिलिंग पते प्रबंधित करें',
        'addr_add_address': 'पता जोड़ें',
        'addr_new_address': 'नया पता',
        'addr_label': 'पता लेबल',
        'addr_first_name': 'पहला नाम',
        'addr_last_name': 'अंतिम नाम',
        'addr_address1': 'पता पंक्ति 1',
        'addr_address2': 'पता पंक्ति 2',
        'addr_city': 'शहर',
        'addr_state': 'राज्य / प्रांत',
        'addr_zip': 'डाक कोड',
        'addr_country': 'देश',
        'addr_phone_optional': 'फोन (वैकल्पिक)',
        'addr_save': 'पता सहेजें',
        'addr_cancel': 'रद्द करें',
        'addr_no_addresses': 'कोई पता सहेजा नहीं गया',
        'addr_add_first': 'अपना पहला पता जोड़ें',
        'addr_add_first_desc': 'तेज चेकआउट के लिए शिपिंग या बिलिंग पता जोड़ें।',
        'addr_add_first_btn': 'पता जोड़ें',
        'addr_default': 'डिफ़ॉल्ट',
        'addr_edit': 'संपादित करें',
        'addr_delete': 'हटाएं',
        'addr_loading': 'पते लोड हो रहे हैं...',
        'quotes_title': 'मेरे कोटेशन',
        'quotes_subtitle': 'अपने सबमिट किए गए कोटेशन अनुरोध देखें',
        'quotes_loading': 'कोटेशन लोड हो रहे हैं...',
        'quotes_no_quotes': 'कोई कोटेशन नहीं',
        'quotes_no_quotes_desc': 'कोटेशन अनुरोध सबमिट करने पर यहाँ दिखेगा।',
        'quotes_request_new': 'कोटेशन मांगें',
        'quotes_request_quote': 'कोटेशन मांगें',
        'quotes_quote_number': 'कोटेशन #',
        'quotes_date': 'तिथि',
        'quotes_items': 'आइटम',
        'quotes_est_total': 'अनुमानित कुल',
        'quotes_status': 'स्थिति',
        'quotes_status_pending': 'लंबित',
        'quotes_status_approved': 'स्वीकृत',
        'quotes_status_rejected': 'अस्वीकृत',
    },
    'ar': {
        'addr_title': 'دفتر العناوين',
        'addr_subtitle': 'إدارة عناوين الشحن والفواتير',
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
        'addr_add_first_desc': 'أضف عنوان شحن أو فواتير لإتمام الدفع بشكل أسرع.',
        'addr_add_first_btn': 'إضافة عنوان',
        'addr_default': 'افتراضي',
        'addr_edit': 'تعديل',
        'addr_delete': 'حذف',
        'addr_loading': 'جارٍ تحميل العناوين...',
        'quotes_title': 'عروض أسعاري',
        'quotes_subtitle': 'عرض طلبات عروض الأسعار المقدمة',
        'quotes_loading': 'جارٍ تحميل العروض...',
        'quotes_no_quotes': 'لا توجد عروض أسعار',
        'quotes_no_quotes_desc': 'عند تقديم طلب عرض سعر، سيظهر هنا.',
        'quotes_request_new': 'طلب عرض سعر',
        'quotes_request_quote': 'طلب عرض سعر',
        'quotes_quote_number': 'رقم العرض',
        'quotes_date': 'التاريخ',
        'quotes_items': 'المنتجات',
        'quotes_est_total': 'الإجمالي التقديري',
        'quotes_status': 'الحالة',
        'quotes_status_pending': 'قيد المعالجة',
        'quotes_status_approved': 'مقبول',
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
        'quotes_title': 'Meus Orçamentos',
        'quotes_subtitle': 'Veja suas solicitações de orçamento enviadas',
        'quotes_loading': 'Carregando orçamentos...',
        'quotes_no_quotes': 'Sem orçamentos',
        'quotes_no_quotes_desc': 'Quando você enviar uma solicitação de orçamento, ela aparecerá aqui.',
        'quotes_request_new': 'Solicitar Orçamento',
        'quotes_request_quote': 'Solicitar Orçamento',
        'quotes_quote_number': 'Orçamento Nº',
        'quotes_date': 'Data',
        'quotes_items': 'Itens',
        'quotes_est_total': 'Total Estimado',
        'quotes_status': 'Status',
        'quotes_status_pending': 'Pendente',
        'quotes_status_approved': 'Aprovado',
        'quotes_status_rejected': 'Rejeitado',
    },
}

import re

with open(r'E:\novatech-store\lib\i18n\translations.ts', encoding='utf-8') as f:
    lines = f.readlines()

# Find each language block end (the closing })
lang_ends = {}
for i, line in enumerate(lines):
    m = re.match(r'^const (\w+): TranslationKeys = \{', line)
    if m:
        lang = m.group(1)
        depth = 1
        for j in range(i+1, len(lines)):
            depth += lines[j].count('{') - lines[j].count('}')
            if depth <= 0:
                lang_ends[lang] = j  # line index of closing }
                break

print('Lang block ends:', {k: v+1 for k, v in lang_ends.items()})

# Get existing keys for each language to avoid duplicates
lang_keys = {}
for lang, end_idx in lang_ends.items():
    # Find start
    start = None
    for i, line in enumerate(lines):
        if re.match(f'^const {lang}: TranslationKeys', line):
            start = i; break
    keys = set()
    for line in lines[start:end_idx]:
        m = re.match(r'^\s+(\w+):', line)
        if m: keys.add(m.group(1))
    lang_keys[lang] = keys

# Insert missing keys before closing }
# Process in reverse order to preserve line numbers
insertions = []
for lang, data in ADDR_QUOTES.items():
    if lang not in lang_ends:
        print(f'{lang}: not found, skip')
        continue
    end_idx = lang_ends[lang]
    existing = lang_keys.get(lang, set())
    missing = {k: v for k, v in data.items() if k not in existing}
    if not missing:
        print(f'{lang}: no missing keys')
        continue
    lines_to_insert = []
    for k, v in missing.items():
        lines_to_insert.append(f"  {k}: '{v}',\n")
    insertions.append((end_idx, lines_to_insert, lang))
    print(f'{lang}: will insert {len(missing)} keys')

# Sort by line index descending to preserve positions
insertions.sort(key=lambda x: x[0], reverse=True)

for end_idx, new_lines, lang in insertions:
    lines[end_idx:end_idx] = new_lines
    print(f'{lang}: inserted {len(new_lines)} lines before line {end_idx+1}')

with open(r'E:\novatech-store\lib\i18n\translations.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Done.')
