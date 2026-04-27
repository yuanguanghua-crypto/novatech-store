SELECT 'Products' as table_name, COUNT(*) as count FROM "Product"
UNION ALL
SELECT 'Categories', COUNT(*) FROM "Category"
UNION ALL
SELECT 'Brands', COUNT(*) FROM "Brand"
UNION ALL
SELECT 'ProductImages', COUNT(*) FROM "ProductImage";
