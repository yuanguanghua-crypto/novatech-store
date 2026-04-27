const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  const cats = await p.$queryRaw`
    SELECT slug, name, "parentId" 
    FROM "Category" 
    WHERE "isActive" = true AND "parentId" IS NULL 
    ORDER BY name
  `
  console.log('=== Top-level categories (parentId = null) ===')
  cats.forEach(c => console.log(c.slug, '|', c.name, '| products:', c.parentId))

  // Also check how many products each has
  for (const cat of cats) {
    const count = await p.$queryRaw`
      SELECT COUNT(*) as cnt 
      FROM "Product" 
      WHERE "categoryId" = ${cat.id} AND "isActive" = true
    `
    console.log('  -> direct products:', count[0]?.cnt || 0)
  }
}

main().finally(() => p.$disconnect())
