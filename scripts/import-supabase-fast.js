const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const slugify = require('slugify');
const p = new PrismaClient();
const rows = XLSX.utils.sheet_to_json(
  XLSX.readFile('/Volumes/PC E/玻璃仪器数据/v32_sku_104_fixed.xlsx').Sheets[
    XLSX.readFile('/Volumes/PC E/玻璃仪器数据/v32_sku_104_fixed.xlsx').SheetNames[0]
  ], {defval:''});

const sl = t => slugify(t,{lower:true,strict:true});
const x = v => v===''||v==='None'?null:v;
const xi = v => {if(v===''||v==null)return null;const n=Number(v);return isNaN(n)?null:n};
const gn = ['','Beakers','Flasks','','','Bottles & Jars','Cylinders','Condensers','Funnels','Adapters & Connectors','Analytical','Distillation Kits','Filtration Kits','Synthetic & Reaction'];
const gs = ['','beakers','flasks','','','bottles-jars','cylinders','condensers','funnels','adapters-connectors','analytical','distillation-kits','filtration-kits','synthetic-reaction'];
const gc = {'Griffin Beaker':1,'Tall Beaker':1,'Erlenmeyer Flask':2,'Round Bottom Flask':2,'Volumetric Flask':2,'Filtering Flask':2,'Media Bottle':5,'Graduated Cylinder':6,'Allihn Condenser':7,'Liebig Condenser':7,'Buchner Funnel':8,'Glass Funnel':8,'Adapter':9,'Burette':10,'Volumetric Pipette':10,'Distillation Kit':11,'Vacuum Filtration Kit':12,'Organic Synthesis Kit':13};

async function main() {
  for(const t of ['variant_supplier_map','erp_sku','variant','spu','supplier_master','category_group'])
    await p.$executeRawUnsafe('DELETE FROM "'+t+'"');
  
  await p.supplierMaster.create({data:{supplierId:'ENB',supplierName:'ENB',country:'CN',leadTimeDays:30}});
  for(let i=1;i<gn.length;i++){if(gn[i])await p.categoryGroup.create({data:{id:'cg-'+gs[i],name:gn[i],slug:gs[i],sortOrder:i}});}
  
  const spus={};
  for(const r of rows){
    const sid=r.SPU_ID;
    if(!spus[sid]){spus[sid]=sid;const ci=gc[r.Product_Family]||1;
      await p.$executeRawUnsafe('INSERT INTO spu(spu_id,product_family_name,category_l1,category_group_id,slug,seo_title,updated_at)VALUES($1,$2,$3,$4,$5,$6,now())ON CONFLICT DO NOTHING',
        sid,r.Product_Family,gn[ci],'cg-'+gs[ci],sl(r.Product_Family),r.SEO_Product_Name);}
    const gm=typeof r.Gross_Margin==='number'?Math.round(r.Gross_Margin*100):null;
    await p.productVariant.create({data:{variantId:r.Variant_ID,spuId:sid,variantName:(r.SEO_Product_Name||'').substring(0,200),volumeMl:xi(r.Volume_ml),lengthMm:xi(r.Length_mm),jointType:x(r.Joint_Type),jointSize:x(r.Joint_Size),wallType:x(r.Wall_Type),materialFamily:x(r.Material_Family),color:x(r.Color),accuracyClass:x(r.Accuracy_Class),sellingPriceUsd:r.Selling_Price_USD,costPriceUsd:r.Cost_Price_USD,grossMarginPct:gm,slug:sl(sid.toLowerCase()+'-'+(r.Volume_ml||'x'))}});
    await p.eRPSKU.create({data:{erpSku:r.ERP_SKU,variantId:r.Variant_ID,businessSku:r.Business_SKU,initialStockQty:r.Initial_Stock||0,lowStockAlertQty:r.Low_Stock_Alert||0,stockHouston:500,stockChina:500}});
    await p.variantSupplierMap.create({data:{variantId:r.Variant_ID,supplierId:'ENB',unitCostUsd:r.Cost_Price_USD,moq:100,leadTimeDays:25,isPreferred:true}});
  }
  console.log('✓ COMPLETE: '+Object.keys(spus).length+' SPUs, '+rows.length+' Variants');
  await p.$disconnect();
}
main().catch(e=>{console.error(e.message.substring(0,500));process.exit(1);});
