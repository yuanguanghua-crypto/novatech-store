const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  const cats = await p.category.findMany({
    where: { isActive: true },
    select: { slug: true, name: true, parentId: true },
    orderBy: { name: 'asc' }
  })
  cats.forEach(c => console.log(c.slug, '|', c.name, '|', c.parentId ? 'child' : 'PARENT'))
  console.log('\nTotal:', cats.length)
}

main().finally(() => p.$disconnect())
