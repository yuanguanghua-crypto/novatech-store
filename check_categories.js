const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const cats = await prisma.category.findMany({
    select: { slug: true, name: true, _count: { select: { products: { where: { isActive: true } } } } },
    orderBy: { name: 'asc' }
  })
  console.log(`共 ${cats.length} 个分类:\n`)
  cats.forEach(c => {
    console.log(`${c.slug} | ${c.name} | ${c._count.products} products`)
  })
  
  const brands = await prisma.brand.findMany({
    select: { slug: true, name: true, _count: { select: { products: { where: { isActive: true } } } } },
    orderBy: { name: 'asc' },
    take: 10
  })
  console.log(`\n前10个品牌:\n`)
  brands.forEach(b => {
    console.log(`${b.slug} | ${b.name} | ${b._count.products} products`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
