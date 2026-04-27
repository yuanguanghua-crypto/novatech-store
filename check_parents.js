const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  // 查看所有分类，看看有没有 parentId 字段
  const cats = await p.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true, parentId: true },
    orderBy: { name: 'asc' },
    take: 20,
  })

  console.log('前20个分类:')
  cats.forEach(c => console.log(`  ${c.id} | parentId:${c.parentId} | ${c.name}`))

  const withParent = await p.category.count({ where: { isActive: true, parentId: { not: null } } })
  const noParent = await p.category.count({ where: { isActive: true, parentId: null } })
  console.log(`\n有父分类: ${withParent}`)
  console.log(`无父分类(顶级): ${noParent}`)
}

main().finally(() => p.$disconnect())
