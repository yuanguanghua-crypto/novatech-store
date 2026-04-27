const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    select: { slug: true, sku: true, name: true, isActive: true },
    take: 10
  })
  console.log('=== 产品 Slug 示例 ===')
  products.forEach(p => {
    console.log(`slug: "${p.slug}" | sku: "${p.sku}" | name: "${p.name}" | active: ${p.isActive}`)
  })
  
  // 检查几个具体 slug
  const slugs = ['pulsafeeder-001', 'lmi-001', 'diaphragm-metering-pump-1', 'lmi-ghf7891']
  console.log('\n=== 查找特定 Slug ===')
  for (const slug of slugs) {
    const found = await prisma.product.findUnique({ where: { slug }, select: { slug: true, name: true } })
    console.log(`${slug}: ${found ? 'FOUND' : 'NOT FOUND'}`)
  }
  
  // 统计
  const total = await prisma.product.count()
  const active = await prisma.product.count({ where: { isActive: true } })
  console.log(`\n总计: ${total}, 活跃: ${active}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
