const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function slugify(text) {
  return String(text || '').toLowerCase().trim()
    .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

(async () => {
  const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'novatech_nova_products.json'), 'utf-8'));
  const allProducts = rawData.products || rawData;
  console.log('Total products:', allProducts.length);
  console.log('First product keys:', Object.keys(allProducts[0]));
  console.log('First product:', JSON.stringify(allProducts[0]).slice(0, 300));

  // Build category mapping like the original script does
  const categoriesMap = new Map();
  for (const p of allProducts) {
    if (p.category) {
      if (!categoriesMap.has(p.category)) {
        categoriesMap.set(p.category, {
          name: p.category,
          slug: slugify(p.category),
          count: 0,
        });
      }
      categoriesMap.get(p.category).count++;
    }
  }
  console.log('\nUnique categories in data:', categoriesMap.size);

  // Get DB categories
  const dbCats = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
  const categoryIds = new Map();
  for (const cat of categoriesMap.values()) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug, sortOrder: 0, isActive: true },
    });
    categoryIds.set(cat.name, record.id);
  }
  console.log('Category IDs map size:', categoryIds.size);
  
  // Check match
  const sampleProducts = allProducts.slice(0, 5);
  for (const p of sampleProducts) {
    const catId = categoryIds.get(p.category);
    console.log(`"${p.category}" -> ${catId ? 'FOUND' : 'NOT FOUND'}`);
  }

  await prisma.$disconnect();
})();
