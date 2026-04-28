const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const brandCount = await prisma.brand.count();
    
    console.log('=== Database Status ===');
    console.log('Products:', productCount);
    console.log('Categories:', categoryCount);
    console.log('Brands:', brandCount);
    
    // 获取一些示例产品
    if (productCount > 0) {
      const samples = await prisma.product.findMany({ take: 3, select: { sku: true, name: true, ourPrice: true } });
      console.log('\nSample products:');
      samples.forEach(p => console.log('  -', p.sku, '-', p.name, '- $' + p.ourPrice));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
