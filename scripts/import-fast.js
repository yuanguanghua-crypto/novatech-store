const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const slugify = require('slugify');
const p = new PrismaClient();

const wb = XLSX.readFile('/Volumes/PC E/玻璃仪器数据/v32_sku_104_fixed.xlsx');
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {defval:''});
const sl = t => slugify(t,{lower:true,strict:true});
const x = v => v===''||v==='None'?null:v;
const xi = v => {if(v===''||v==null)return null;const n=Number(v);return isNaN(n)?null:n};

async function main() {
  // Clean
  for(const t of ['variant_supplier_map','erp_sku','variant','spu','supplier_master','category_group'])
    await p.$executeRawUnsafe('DELETE FROM "'+t+'"');
  
  // Suppliers & Categories
  await p.supplierMaster.create({data:{supplierId:'ENB',supplierName:'ENB',country:'CN',leadTimeDays:30}});
  const gn=['','Beakers','Flasks','','','Bottles & Jars','Cylinders','Condensers','Funnels','Adapters & Connectors','Analytical','Distillation Kits','Filtration Kits','Synthetic & Reaction'];
  const gs=['','beakers','flasks','','','bottles-jars','cylinders','condensers','funnels','adapters-connectors','analytical','distillation-kits','filtration-kits','synthetic-reaction'];
  const gc={'Griffin Beaker':1,'Tall Beaker':1,'Erlenmeyer Flask':2,'Round Bottom Flask':2,'Volumetric Flask':2,'Filtering Flask':2,'Media Bottle':5,'Graduated Cylinder':6,'Allihn Condenser':7,'Liebig Condenser':7,'Buchner Funnel':8,'Glass Funnel':8,'Adapter':9,'Burette':10,'Volumetric Pipette':10,'Distillation Kit':11,'Vacuum Filtration Kit':12,'Organic Synthesis Kit':13};
  for(let i=1;i<gn.length;i++){if(gn[i])await p.categoryGroup.create({data:{id:'cg-'+gs[i],name:gn[i],slug:gs[i],sortOrder:i}});}
  
  // Build data arrays
  const spuIds=new Set();
  const spuData=[], variantData=[], erpData=[], smData=[];
  
  for(const r of rows){
    const sid=r.SPU_ID;
    if(!spuIds.has(sid)){spuIds.add(sid);
      const ci=gc[r.Product_Family]||1;
      spuData.push({spuId:sid,productFamilyName:r.Product_Family,categoryL1:gn[ci],categoryGroupId:'cg-'+gs[ci],seoTitle:r.SEO_Product_Name,slug:sl(r.SPU_ID+"-"+r.Product_Family)});}
    const gm=typeof r.Gross_Margin==='number'?Math.round(r.Gross_Margin*100):null;
    variantData.push({variantId:r.Variant_ID,spuId:sid,variantName:(r.SEO_Product_Name||'').substring(0,200),volumeMl:xi(r.Volume_ml),lengthMm:xi(r.Length_mm),jointType:x(r.Joint_Type),jointSize:x(r.Joint_Size),wallType:x(r.Wall_Type),materialFamily:x(r.Material_Family),color:x(r.Color),accuracyClass:x(r.Accuracy_Class),sellingPriceUsd:r.Selling_Price_USD,costPriceUsd:r.Cost_Price_USD,grossMarginPct:gm,slug:sl(r.Variant_ID.toLowerCase())});
    erpData.push({erpSku:r.ERP_SKU,variantId:r.Variant_ID,businessSku:r.Business_SKU,initialStockQty:r.Initial_Stock||0,lowStockAlertQty:r.Low_Stock_Alert||0,stockHouston:500,stockChina:500});
    smData.push({variantId:r.Variant_ID,supplierId:'ENB',unitCostUsd:r.Cost_Price_USD,moq:100,leadTimeDays:25,isPreferred:true});
  }
  
  // Bulk insert using createMany
  await p.sPU.createMany({data:spuData});
  console.log('SPUs: '+spuData.length);
  
  await p.productVariant.createMany({data:variantData});
  console.log('Variants: '+variantData.length);
  
  await p.eRPSKU.createMany({data:erpData});
  console.log('SKUs: '+erpData.length);
  
  // Supplier maps - use raw SQL batch
  for(let i=0;i<smData.length;i+=50){
    const batch=smData.slice(i,i+50);
    const vals=batch.map((m,j)=>{const b=i*7+j*7+1;return '($'+(b)+',$'+(b+1)+',$'+(b+2)+',$'+(b+3)+',$'+(b+4)+',$'+(b+5)+',now(),now())';}).join(',');
    const flat=batch.flatMap(m=>[m.variantId,m.supplierId,m.unitCostUsd||0,m.moq,m.leadTimeDays,m.isPreferred?true:false]);
    await p.$executeRawUnsafe('INSERT INTO variant_supplier_map(variant_id,supplier_id,unit_cost_usd,moq,lead_time_days,is_preferred,created_at,updated_at)VALUES '+vals+' ON CONFLICT DO NOTHING',...flat);
  }
  console.log('SupplierMaps: '+smData.length);
  
  console.log('\\n✓ COMPLETE IN ONE SHOT!');
  await p.$disconnect();
}
main().catch(e=>{console.error(e.message.substring(0,600));process.exit(1);});
