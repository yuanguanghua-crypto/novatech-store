const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

(async () => {
  // Load products
  const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'novatech_nova_products.json'), 'utf-8'));
  const allProducts = rawData.products || rawData;

  // Get categories from DB
  const dbCategories = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
  const categoryIds = new Map(dbCategories.map(c => [c.slug, c.id]));
  
  console.log('DB categories:', dbCategories.length);
  console.log('First 5 DB category slugs:', dbCategories.slice(0, 5).map(c => c.slug));

  // Get products with their category
  const sampleProducts = allProducts.slice(0, 10);
  for (const p of sampleProducts) {
    const catId = categoryIds.get(p.category);
    console.log(`Product "${p.category}" -> DB cat ID: ${catId || 'NOT FOUND'}`);
  }
  
  await prisma.$disconnect();
})();
