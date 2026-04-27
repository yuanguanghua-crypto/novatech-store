const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

// 定义分类层级结构
// 每个顶级分类 -> 包含哪些子分类关键词
const CATEGORY_HIERARCHY = {
  'Metering Pumps': {
    slug: 'metering-pumps',
    children: [
      'Diaphragm Metering Pumps',
      'Peristaltic Metering Pumps',
      'Piston Metering Pumps',
    ]
  },
  'Pump Accessories': {
    slug: 'pump-accessories',
    children: [
      'Metering Pump Parts',
      'Preventive Maintenance Kits & KOPkits',
      'Discharge & Suction Valve Cartridges',
      'Liquid End Kits',
    ]
  },
  'Water Quality': {
    slug: 'water-quality',
    children: [
      'pH Controllers',
      'Conductivity Controllers',
      'Turbidity Meters',
      'Colorimeters',
      'TDS Controllers',
      'ORP Controllers',
    ]
  },
  'Laboratory Equipment': {
    slug: 'laboratory-equipment',
    children: [
      'Precision Balances',
      'Analytical Balances',
      'Bench Scales',
      'Bench Protectors',
      'Anti Vibration Tables',
      'Centrifuges',
      'Autoclaves',
      'Microscopes',
    ]
  },
  'Lab Supplies': {
    slug: 'lab-supplies',
    children: [
      'Centrifuge Tubes',
      'BOD Bottles',
      'Lab Glassware',
      'Bottletop Dispensers',
      'Pipettes',
      'Thermometers',
    ]
  },
  'Temperature Control': {
    slug: 'temperature-control',
    children: [
      'Temperature Controllers',
      'Boiler Controllers',
      'Hot Plates',
      'Water Baths',
    ]
  },
  'Industrial Measurement': {
    slug: 'industrial-measurement',
    children: [
      'Hydrometers',
      'Anemometers',
      'Barometers',
      'API Hydrometers',
      'Alcohol & Proof Hydrometers',
      'Baume Hydrometers',
      'Brix Hydrometers',
    ]
  },
}

async function main() {
  // 获取所有顶级分类（parentId=null）
  const parents = await p.category.findMany({
    where: { isActive: true, parentId: null },
    select: { id: true, name: true, slug: true },
  })

  console.log('=== 现有顶级分类 ===')
  parents.forEach(c => console.log(`  ${c.name} (${c.slug})`))
  console.log(`共 ${parents.length} 个\n`)

  // 为每个大类创建顶级分类
  console.log('=== 创建父分类 ===')
  for (const [name, config] of Object.entries(CATEGORY_HIERARCHY)) {
    const existing = parents.find(p => p.name === name)
    if (existing) {
      console.log(`  已有: ${name}`)
      continue
    }
    const parent = await p.category.upsert({
      where: { slug: config.slug },
      update: {},
      create: {
        name,
        slug: config.slug,
        sortOrder: 0,
        isActive: true,
      }
    })
    console.log(`  ✓ 创建: ${name} (${config.slug})`)
  }

  // 更新子分类的 parentId
  console.log('\n=== 建立子分类关系 ===')
  for (const [parentName, config] of Object.entries(CATEGORY_HIERARCHY)) {
    const parent = await p.category.findUnique({ where: { slug: config.slug } })
    if (!parent) continue

    for (const childName of config.children) {
      const child = await p.category.findUnique({ where: { name: childName } })
      if (child && child.parentId === null) {
        await p.category.update({
          where: { id: child.id },
          update: { parentId: parent.id },
        })
        console.log(`  ✓ ${childName} -> ${parentName}`)
      }
    }
  }

  // 统计结果
  console.log('\n=== 更新后统计 ===')
  const total = await p.category.count({ where: { isActive: true } })
  const topLevel = await p.category.count({ where: { isActive: true, parentId: null } })
  const withChildren = await p.category.count({ where: { isActive: true, parentId: { not: null } } })
  console.log(`总分类: ${total}`)
  console.log(`顶级分类: ${topLevel}`)
  console.log(`子分类: ${withChildren}`)

  // 显示最终层级
  console.log('\n=== 最终层级 ===')
  const finalParents = await p.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: {
        where: { isActive: true },
        select: { name: true, slug: true },
      },
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  })

  for (const p of finalParents) {
    console.log(`\n${p.name} (${p._count.products} 产品) - ${p.slug}`)
    if (p.children.length > 0) {
      p.children.forEach(c => console.log(`  └─ ${c.name} (${c.slug})`))
    } else {
      console.log(`  (无子分类，将作为独立分类显示)`)
    }
  }

  // 对于没有子分类的顶级分类，需要设置 sortOrder
  console.log('\n=== 为独立分类设置 sortOrder ===')
  let sortOrder = 100
  for (const p of finalParents) {
    if (p.children.length === 0) {
      await p.category.update({
        where: { id: p.id },
        update: { sortOrder },
      })
      console.log(`  ✓ ${p.name} -> sortOrder: ${sortOrder}`)
      sortOrder++
    }
  }
}

main().finally(() => p.$disconnect())
