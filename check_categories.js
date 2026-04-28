const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 检查所有分类
  const allCategories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
      isActive: true,
      _count: { select: { products: true } }
    }
  })
  
  console.log('=== 所有分类 (前10个) ===')
  console.log(JSON.stringify(allCategories.slice(0, 10), null, 2))
  
  // 统计顶级分类和子分类
  const topLevel = allCategories.filter(c => c.parentId === null)
  const withChildren = allCategories.filter(c => c.parentId === null && 
    allCategories.some(c2 => c2.parentId === c.id))
  
  console.log('\n=== 统计 ===')
  console.log('总分类数:', allCategories.length)
  console.log('顶级分类 (parentId=null):', topLevel.length)
  console.log('有子分类的顶级分类:', withChildren.length)
  
  // 显示顶级分类
  console.log('\n=== 顶级分类 ===')
  console.log(JSON.stringify(topLevel.slice(0, 15), null, 2))
  
  // 显示一个分类的详情
  if (allCategories.length > 0) {
    const firstTop = topLevel[0]
    if (firstTop) {
      const children = await prisma.category.findMany({
        where: { parentId: firstTop.id },
        select: { id: true, name: true, slug: true }
      })
      console.log('\n=== 第一个顶级分类的子分类 ===')
      console.log(JSON.stringify(children, null, 2))
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
