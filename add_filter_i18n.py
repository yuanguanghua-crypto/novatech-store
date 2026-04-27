"""Add filter translation values to translations.ts"""
filepath = r"E:\novatech-store\lib\i18n\translations.ts"
with open(filepath, encoding="utf-8") as f:
    content = f.read()

count = 0

def add_filter_values(old_str, new_str):
    global content, count
    if old_str in content:
        content = content.replace(old_str, new_str)
        count += 1
        return True
    return False

# English
add_filter_values(
    "  products_on_order: 'On Order',\n  products_sku: 'SKU',",
    "  products_on_order: 'On Order',\n  filter_availability: 'Availability',\n  filter_in_stock_only: 'In Stock Only',\n  filter_price_range: 'Price Range (USD)',\n  filter_min: 'Min',\n  filter_max: 'Max',\n  filter_brand: 'Brand',\n  products_sku: 'SKU',"
)

# Chinese
add_filter_values(
    "  products_on_order: '订购中',\n  products_sku: '产品编号',",
    "  products_on_order: '订购中',\n  filter_availability: '库存状态',\n  filter_in_stock_only: '仅显示有货',\n  filter_price_range: '价格区间 (USD)',\n  filter_min: '最低',\n  filter_max: '最高',\n  filter_brand: '品牌',\n  products_sku: '产品编号',"
)

# Spanish
add_filter_values(
    "  products_on_order: 'Sobre Pedido',\n  products_sku: 'SKU',",
    "  products_on_order: 'Sobre Pedido',\n  filter_availability: 'Disponibilidad',\n  filter_in_stock_only: 'Solo en Stock',\n  filter_price_range: 'Rango de Precio (USD)',\n  filter_min: 'Mín',\n  filter_max: 'Máx',\n  filter_brand: 'Marca',\n  products_sku: 'SKU',"
)

# Japanese
add_filter_values(
    "  products_on_order: '受注生産',\n  products_sku: 'SKU',",
    "  products_on_order: '受注生産',\n  filter_availability: '在庫状況',\n  filter_in_stock_only: '在庫のみ',\n  filter_price_range: '価格帯 (USD)',\n  filter_min: '最小',\n  filter_max: '最大',\n  filter_brand: 'ブランド',\n  products_sku: 'SKU',"
)

# Hindi
add_filter_values(
    "  products_on_order: 'ऑन ऑर्डर',\n  products_sku: 'SKU',",
    "  products_on_order: 'ऑन ऑर्डर',\n  filter_availability: 'उपलब्धता',\n  filter_in_stock_only: 'केवल स्टॉक में',\n  filter_price_range: 'मूल्य सीमा (USD)',\n  filter_min: 'न्यूनतम',\n  filter_max: 'अधिकतम',\n  filter_brand: 'ब्रांड',\n  products_sku: 'SKU',"
)

# Arabic
add_filter_values(
    "  products_on_order: 'عند الطلب',\n  products_sku: 'رمز المنتج',",
    "  products_on_order: 'عند الطلب',\n  filter_availability: 'التوفر',\n  filter_in_stock_only: 'في المخزون فقط',\n  filter_price_range: 'نطاق السعر (USD)',\n  filter_min: 'الحد الأدنى',\n  filter_max: 'الحد الأقصى',\n  filter_brand: 'العلامة التجارية',\n  products_sku: 'رمز المنتج',"
)

# Portuguese
add_filter_values(
    "  products_on_order: 'Sob Encomenda',\n  products_sku: 'SKU',",
    "  products_on_order: 'Sob Encomenda',\n  filter_availability: 'Disponibilidade',\n  filter_in_stock_only: 'Apenas em Stock',\n  filter_price_range: 'Intervalo de Preço (USD)',\n  filter_min: 'Mín',\n  filter_max: 'Máx',\n  filter_brand: 'Marca',\n  products_sku: 'SKU',"
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Replaced {count} sections")
print("filter_availability count:", content.count("filter_availability: '"))
