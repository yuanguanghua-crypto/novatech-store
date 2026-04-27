const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    const count = await prisma.product.count();
    console.log('Current product count:', count);
    const catCount = await prisma.category.count();
    console.log('Current category count:', catCount);
    const brandCount = await prisma.brand.count();
    console.log('Current brand count:', brandCount);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
})();
