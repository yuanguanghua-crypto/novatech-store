const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  // 查看顶级分类（有子分类的）
  const parents = await p.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      _count: { select: { products: true } },
      children: {
        where: { isActive: true },
        select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
      },
    },
    take: 10,
  })

  console.log('=== 顶级分类 (有子分类的) ===')
  parents.forEach(cat => {
    console.log(`\n${cat.name} (${cat.slug}) - ${cat._count.products} 产品`)
    if (cat.children.length > 0) {
      cat.children.forEach(child => {
        console.log(`  └─ ${child.name} (${child.slug}) - ${child._count.products} 产品`)
      })
    } else {
      console.log(`  (无子分类)`)
    }
  })

  // 统计
  const totalCats = await p.category.count({ where: { isActive: true } })
  const totalParents = await p.category.count({ where: { isActive: true, parentId: null } })
  const totalChildren = await p.category.count({ where: { isActive: true, parentId: { not: null } } })
  
  console.log(`\n=== 统计 ===`)
  console.log(`总分类数: ${totalCats}`)
  console.log(`顶级分类: ${totalParents}`)
  console.log(`子分类数: ${totalChildren}`)
}

main().finally(() => p.$disconnect())
