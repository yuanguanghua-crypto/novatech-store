const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  const parents = await p.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: {
        where: { isActive: true },
        select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      },
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  })

  console.log(`=== 分类层级结构 ===\n`)
  console.log(`总分类: 136 | 顶级: ${parents.length} | 子分类: ${parents.reduce((sum, p) => sum + p.children.length, 0)}\n`)

  parents.forEach(parent => {
    const childCount = parent.children.length
    const childProducts = parent.children.reduce((sum, c) => sum + (c._count?.products || 0), 0)
    console.log(`[${parent.name}] ${parent._count.products} 产品`)
    if (childCount > 0) {
      parent.children.forEach(c => {
        console.log(`   └─ ${c.name} (${c._count?.products || 0} 产品)`)
      })
    }
    console.log('')
  })
}

main().finally(() => p.$disconnect())
