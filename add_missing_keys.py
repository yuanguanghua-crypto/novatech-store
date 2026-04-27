# -*- coding: utf-8 -*-
"""Add missing keys to all language blocks"""

with open(r'E:\novatech-store\lib\i18n\translations.ts', encoding='utf-8') as f:
    content = f.read()

# For each language, find 'privacy_item4:' line and insert keys after it
lang_data = {
    'zh': {
        'privacy_item4_match': "  privacy_item4: '如有关于隐私的咨询，请联系我们的数据保护官：',",
        'privacies': """  privacy_item5: '所有数据存储在加密服务器上。',
  privacy_item6: '您可以随时请求删除账户和数据。',
  privacy_item7: '我们遵守适用的数据保护法律，包括 GDPR。',
  placeholder_name_example: '张三',
  placeholder_company_example: '您的公司名称',
  placeholder_email_example: 'your@email.com',
  placeholder_phone_example: '+86 138 0000 0000',
  placeholder_notes_example: '在此处添加备注...',
  placeholder_search_example: '搜索产品...',""",
    },
    'es': {
        'privacy_item4_match': "  privacy_item4: 'Para consultas relacionadas con la privacidad, contacte a nuestro Oficial de Protección de Datos en',",
        'privacies': """  privacy_item5: 'Todos los datos se almacenan en servidores cifrados.',
  privacy_item6: 'Puede solicitar la eliminación de su cuenta y datos en cualquier momento.',
  privacy_item7: 'Cumplimos con las leyes de protección de datos aplicables, incluido el RGPD.',
  placeholder_name_example: 'Juan García',
  placeholder_company_example: 'Su Empresa S.A.',
  placeholder_email_example: 'su@email.com',
  placeholder_phone_example: '+34 600 000 000',
  placeholder_notes_example: 'Añada notas adicionales aquí...',
  placeholder_search_example: 'Buscar productos...',""",
    },
    'ja': {
        'privacy_item4_match': "  privacy_item4: 'プライバシーに関するご質問は、数据保护官员まで联系我们：',",
        'privacies': """  privacy_item5: 'すべてのデータは暗号化されたサーバーに安全に保管されます。',
  privacy_item6: 'いつでもアカウントとデータの削除をリクエストできます。',
  privacy_item7: 'GDPR を含む適用されるデータ保護法を遵守しています。',
  placeholder_name_example: '山田 太郎',
  placeholder_company_example: '株式会社サンプル',
  placeholder_email_example: 'your@email.com',
  placeholder_phone_example: '+81 90-0000-0000',
  placeholder_notes_example: 'こちらに追加メモを入力してください...',
  placeholder_search_example: '製品を検索...',""",
    },
    'hi': {
        'privacy_item4_match': "  privacy_item4: 'गोपनीयता पूछताछ के लिए:',",
        'privacies': """  privacy_item5: 'सभी डेटा एन्क्रिप्टेड सर्वर पर सुरक्षित है।',
  privacy_item6: 'आप किसी भी समय अपना खाता और डेटा हटाने का अनुरोध कर सकते हैं।',
  privacy_item7: 'हम GDPR सहित लागू डेटा सुरक्षा कानूनों का पालन करते हैं।',
  placeholder_name_example: 'राम शर्मा',
  placeholder_company_example: 'आपकी कंपनी',
  placeholder_email_example: 'your@email.com',
  placeholder_phone_example: '+91 98000 00000',
  placeholder_notes_example: 'यहाँ अतिरिक्त नोट जोड़ें...',
  placeholder_search_example: 'उत्पाद खोजें...',""",
    },
    'ar': {
        'privacy_item4_match': "  privacy_item4: 'لاستفسارات الخصوصية:',",
        'privacies': """  privacy_item5: 'تُخزَّن جميع البيانات بأمان على خوادم مشفرة.',
  privacy_item6: 'يمكنك طلب حذف حسابك وبياناتك في أي وقت.',
  privacy_item7: 'نلتزم بقوانين حماية البيانات المعمول بها بما في ذلك GDPR.',
  placeholder_name_example: 'محمد أحمد',
  placeholder_company_example: 'اسم شركتك',
  placeholder_email_example: 'your@email.com',
  placeholder_phone_example: '+966 50 000 0000',
  placeholder_notes_example: 'أضف ملاحظات إضافية هنا...',
  placeholder_search_example: 'ابحث عن منتجات...',""",
    },
    'pt': {
        'privacy_item4_match': "  privacy_item4: 'Para consultas de privacidade:',",
        'privacies': """  privacy_item5: 'Todos os dados são armazenados com segurança em servidores criptografados.',
  privacy_item6: 'Você pode solicitar a exclusão da sua conta e dados a qualquer momento.',
  privacy_item7: 'Cumprimos as leis de proteção de dados aplicáveis, incluindo o RGPD.',
  placeholder_name_example: 'João Silva',
  placeholder_company_example: 'Sua Empresa Ltda.',
  placeholder_email_example: 'your@email.com',
  placeholder_phone_example: '+55 11 90000-0000',
  placeholder_notes_example: 'Adicione notas adicionais aqui...',
  placeholder_search_example: 'Pesquisar produtos...',""",
    },
}

for lang, data in lang_data.items():
    match = data['privacy_item4_match']
    if match in content:
        idx = content.index(match)
        line_end = content.index('\n', idx)
        insert = '\n' + data['privacies']
        content = content[:line_end+1] + insert + '\n' + content[line_end+1:]
        print(f'[{lang}] inserted')
    else:
        print(f'[{lang}] NOT FOUND: {repr(match[:60])}')

with open(r'E:\novatech-store\lib\i18n\translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done.')
