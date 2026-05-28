// Script: add-placeholder-images.js
// 为所有没有图片的产品添加占位图片
// Usage: node scripts/add-placeholder-images.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PLACEHOLDER_URL = '/images/placeholder-product.png';
const PLACEHOLDER_ALT = 'LABPRO Laboratory Glassware - Placeholder Image';

async function main() {
  console.log('=== 为所有产品添加占位图片 ===\n');

  // 1. 获取所有没有图片的产品
  const productsWithoutImages = await prisma.product.findMany({
    where: {
      images: { none: {} },
      isActive: true
    },
    select: {
      id: true,
      name: true,
      sku: true,
      slug: true
    }
  });

  console.log(`找到 ${productsWithoutImages.length} 个没有图片的产品\n`);

  if (productsWithoutImages.length === 0) {
    console.log('所有产品已有图片，无需操作');
    return;
  }

  // 2. 为每个产品创建占位图片记录
  let successCount = 0;
  let errorCount = 0;

  for (const product of productsWithoutImages) {
    try {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: PLACEHOLDER_URL,
          altText: `${product.name} - ${PLACEHOLDER_ALT}`,
          sortOrder: 0,
          isPrimary: true
        }
      });
      successCount++;
      if (successCount % 10 === 0) {
        console.log(`  进度: ${successCount}/${productsWithoutImages.length}`);
      }
    } catch (error) {
      errorCount++;
      console.error(`  ❌ 失败: ${product.sku} - ${error.message}`);
    }
  }

  // 3. 验证结果
  const totalImages = await prisma.productImage.count();
  const productsWithImages = await prisma.product.count({
    where: { images: { some: {} } }
  });
  const totalProducts = await prisma.product.count();

  console.log('\n=== 结果 ===');
  console.log(`✅ 成功添加: ${successCount} 张图片`);
  if (errorCount > 0) {
    console.log(`❌ 失败: ${errorCount} 个`);
  }
  console.log(`\n数据库统计:`);
  console.log(`  - 总产品数: ${totalProducts}`);
  console.log(`  - 有图片的产品: ${productsWithImages}`);
  console.log(`  - 总图片数: ${totalImages}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
