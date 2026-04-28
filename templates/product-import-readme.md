# 产品批量导入模板说明

## 文件格式
Excel (.xlsx) 格式，UTF-8 编码

## 表头说明 (第1行为表头)

| 列名 | 必填 | 说明 | 示例 |
|------|------|------|------|
| sku | 是 | 产品SKU（唯一） | LDA-742-21T |
| name | 是 | 产品名称 | Pulsafeeder LMI Pump |
| description | 否 | 产品描述 | High precision metering pump... |
| brand | 否 | 品牌名称 | Pulsafeeder |
| parent_category | 否 | 父分类名称 | Pumps |
| child_category | 是 | 子分类名称 | Metering Pumps |
| our_price | 是 | 售价 | 299.99 |
| list_price | 否 | 标价 | 399.99 |
| cost_price | 否 | 成本价 | 199.99 |
| availability | 否 | 库存状态 | in_stock / out_of_stock / lead_time |
| stock_qty | 否 | 库存数量 | 100 |
| lead_time_days | 否 | 交货期(天) | 14 |
| weight | 否 | 重量 | 5.5 |
| weight_unit | 否 | 重量单位 | lbs / kg / oz |
| dimension_length | 否 | 长度 | 12 |
| dimension_width | 否 | 宽度 | 8 |
| dimension_height | 否 | 高度 | 6 |
| dimension_unit | 否 | 尺寸单位 | in / cm |
| spec_key_1 ~ spec_key_10 | 否 | 规格名称 | Max Flow |
| spec_value_1 ~ spec_value_10 | 否 | 规格值 | 100 GPH |
| image_url_1 ~ image_url_5 | 否 | 图片URL | https://... |
| video_url | 否 | 视频URL | https://... |
| meta_title | 否 | SEO标题 | Product SEO Title |
| meta_description | 否 | SEO描述 | Product meta description... |
| is_active | 否 | 是否上架 | TRUE / FALSE / 1 / 0 |
| is_featured | 否 | 是否推荐 | TRUE / FALSE |
| is_new | 否 | 是否新品 | TRUE / FALSE |
| source_url | 否 | 来源URL | https://... |

## 填写示例

```
sku,name,brand,parent_category,child_category,our_price,list_price,availability,stock_qty
SKU-001,Pulsafeeder LMI Pump,Pulsafeeder,Pumps,Metering Pumps,299.99,399.99,in_stock,100
SKU-002,Hach Turbidity Meter,Hach,Analyzers,pH Meters,599.00,,in_stock,50
SKU-003,Ohaus Balance Premium,Ohaus,Balances,Precision Balances,1299.00,1599.00,in_stock,25
```

## 规格参数填写

规格参数需要成对填写 (key 和 value)：

```
spec_key_1,spec_value_1,spec_key_2,spec_value_2
Max Flow,100 GPH,Max Pressure,150 PSI
Voltage,120V,Material,Stainless Steel
```

## 图片填写

最多支持5张图片，用完整URL填写：

```
image_url_1,image_url_2,image_url_3
https://example.com/img1.jpg,https://example.com/img2.jpg,https://example.com/img3.jpg
```

## 导入规则

1. **SKU 唯一性**: SKU 必须唯一，重复的SKU会覆盖已有产品
2. **分类匹配**: 如果 `child_category` 不存在，会自动创建
3. **品牌匹配**: 如果 `brand` 不存在，会自动创建
4. **数值验证**: 价格、库存等数值字段会自动验证格式
5. **布尔值**: is_active/is_featured/is_new 接受 TRUE/FALSE/1/0

## 注意事项

1. **编码**: 确保文件使用 UTF-8 编码，否则中文可能显示乱码
2. **日期格式**: 不要在Excel中自动转换日期格式
3. **图片URL**: 必须使用完整的有效URL
4. **数量限制**: 单次导入建议不超过 500 条产品
5. **必填字段**: sku、name、child_category、our_price 为必填

## 下载模板

请下载 `product-import-template.xlsx` 文件作为导入模板。
