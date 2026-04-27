const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

// 定义分类层级 - 基于数据库真实名称
// 结构: 父分类名 -> { slug, 子分类关键词列表(部分匹配) }
const CATEGORY_HIERARCHY = [
  {
    parent: 'Metering Pumps',
    slug: 'metering-pumps',
    children_keywords: [
      'Diaphragm Metering Pumps',
      'Peristaltic Metering Pumps',
      'Piston Metering Pumps',
    ]
  },
  {
    parent: 'Pump Accessories',
    slug: 'pump-accessories',
    children_keywords: [
      'Metering Pump Parts',
      'Preventive Maintenance Kits & KOPkits',
      'Discharge & Suction Valve Cartridges',
      'Liquid End Kits',
      'Chemical Feeders',
    ]
  },
  {
    parent: 'Water Quality',
    slug: 'water-quality',
    children_keywords: [
      'pH & ORP Controllers',
      'Conductivity Controllers',
      'Turbidity Meters',
      'Colorimeters',
      'Colorimeter Reagents Kits',
      'Dissolved Oxygen Meters',
      'Industrial & Pool Water Testing Kits',
    ]
  },
  {
    parent: 'Laboratory Equipment',
    slug: 'laboratory-equipment',
    children_keywords: [
      'Precision Balances',
      'Analytical Balances',
      'Bench Scales',
      'Platform Scales',
      'Floor Scales',
      'Anti Vibration Tables',
      'Compound Microscopes',
      'Stereo Microscopes',
      'Student Microscopes',
      'Autoclaves',
      'Centrifuge Tubes',
      'BOD Measurement Testing Equipment',
    ]
  },
  {
    parent: 'Lab Supplies',
    slug: 'lab-supplies',
    children_keywords: [
      'BOD Bottles',
      'Bottletop Dispensers',
      'Cell Culture Dishes',
      'Cell Strainers',
      'Pipettes',
      'Inoculating Turntables & Supplies',
      'Microbiology Equipment',
    ]
  },
  {
    parent: 'Temperature Control',
    slug: 'temperature-control',
    children_keywords: [
      'Temperature Controllers',
      'Boiler Controllers',
      'Cooling Tower Controllers',
      'Water Bath',
      'Hot Plate',
    ]
  },
  {
    parent: 'Industrial Measurement',
    slug: 'industrial-measurement',
    children_keywords: [
      'API Hydrometers',
      'Alcohol & Proof Hydrometers',
      'Baume Hydrometers',
      'Brix Hydrometers',
      'Dual Scale Hydrometers',
      'Plato Hydrometers',
      'Sodium Chloride (NaCl) Hydrometers',
      'Soil Hydrometers',
      'Specific Gravity Hydrometers',
      'Hydrometer Cases, Cylinders and Racks',
      'Anemometers',
      'Barometers',
      'Manometers',
      'Humidity Meters',
      'Dew Point Meters',
      'Light Meters',
      'Sound Meters',
      'Weather Measuring Instruments',
    ]
  },
]

async function main() {
  // 获取所有顶级分类
  const allCats = await p.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true, parentId: true },
  })

  console.log(`总分类: ${allCats.length}`)

  // 先清除现有的 parentId（重置）
  console.log('\n=== 重置所有 parentId ===')
  await p.category.updateMany({
    where: { parentId: { not: null } },
    data: { parentId: null },
  })
  console.log('  ✓ 已清除所有父子关系')

  // 删除之前可能创建的纯父分类（产品数为0的）
  console.log('\n=== 删除空父分类 ===')
  const hierarchyNames = CATEGORY_HIERARCHY.map(h => h.parent)
  for (const name of hierarchyNames) {
    const existing = allCats.find(c => c.name === name && c.parentId === null)
    if (existing) {
      const count = await p.product.count({ where: { categoryId: existing.id } })
      if (count === 0) {
        await p.category.delete({ where: { id: existing.id } })
        console.log(`  ✓ 删除: ${name}`)
      }
    }
  }

  // 创建新的父分类
  console.log('\n=== 创建/更新父分类 ===')
  const parentIds = {}
  for (const item of CATEGORY_HIERARCHY) {
    const existing = allCats.find(c => c.name === item.parent)
    let parentId
    if (existing && existing.parentId === null) {
      // 已有顶级分类，检查是否有产品
      const count = await p.product.count({ where: { categoryId: existing.id } })
      if (count > 0) {
        // 已有分类且有产品，保持不变，parentId 为空
        parentId = existing.id
        console.log(`  保留已有: ${item.parent} (${existing.id.slice(0,8)}...) - ${count} 产品`)
      } else {
        // 已有分类但无产品，删除后重建
        await p.category.delete({ where: { id: existing.id } })
        const created = await p.category.create({
          data: { name: item.parent, slug: item.slug, isActive: true, sortOrder: 0 }
        })
        parentId = created.id
        console.log(`  ✓ 重建: ${item.parent}`)
      }
    } else {
      // 新建父分类
      const created = await p.category.create({
        data: { name: item.parent, slug: item.slug, isActive: true, sortOrder: 0 }
      })
      parentId = created.id
      console.log(`  ✓ 新建: ${item.parent}`)
    }
    parentIds[item.parent] = parentId
  }

  // 建立子分类关系 - 使用精确名称匹配
  console.log('\n=== 建立子分类关系 ===')
  let matched = 0
  let unmatched = []

  for (const item of CATEGORY_HIERARCHY) {
    const parentId = parentIds[item.parent]
    for (const keyword of item.children_keywords) {
      const cat = allCats.find(c => c.name === keyword)
      if (cat && cat.parentId === null) {
        await p.category.update({
          where: { id: cat.id },
          data: { parentId },
        })
        console.log(`  ✓ ${cat.name} -> ${item.parent}`)
        matched++
      } else if (cat && cat.parentId !== null) {
        console.log(`  - 已归属: ${cat.name}`)
      } else {
        unmatched.push(keyword)
        console.log(`  ✗ 未找到: ${keyword}`)
      }
    }
  }

  console.log(`\n匹配: ${matched} | 未匹配: ${unmatched.length}`)
  if (unmatched.length > 0) {
    console.log('未匹配: ' + unmatched.join(', '))
  }

  // 最终统计
  console.log('\n=== 最终分类层级 ===')
  const parents = await p.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: {
        where: { isActive: true },
        select: { name: true, slug: true, _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      },
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  })

  const totalParents = parents.length
  const totalChildren = parents.reduce((sum, p) => sum + p.children.length, 0)
  console.log(`顶级分类: ${totalParents} | 子分类: ${totalChildren}\n`)

  parents.forEach(parent => {
    const childCount = parent.children.length
    const childProducts = parent.children.reduce((sum, c) => sum + (c._count?.products || 0), 0)
    if (childCount > 0) {
      console.log(`📁 ${parent.name} (${parent._count.products} 直接产品 + ${childProducts} 子分类产品)`)
      parent.children.forEach(c => {
        console.log(`   └─ ${c.name} (${c._count?.products || 0})`)
      })
    } else {
      console.log(`📄 ${parent.name} (${parent._count.products} 产品)`)
    }
  })
}

main().finally(() => p.$disconnect())
