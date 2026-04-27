const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Get all active categories
  const allCats = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true },
  })
  console.log(`Total categories: ${allCats.length}`)

  // Hierarchy mapping: parent name -> child keywords
  const HIERARCHY = {
    'Metering Pumps': {
      slug: 'metering-pumps',
      children: ['diaphragm', 'peristaltic', 'piston', 'dosing', 'drum', 'hydraulic', 'motor', 'spring'],
    },
    'Water Quality': {
      slug: 'water-quality',
      children: ['ph controller', 'ph monitor', 'orp', 'conductivity', 'turbidity', 'dissolved oxygen', 'colorimeter', 'spectrophotometer', 'photometer', 'reagent', 'buffer', 'electrode'],
    },
    'Laboratory Equipment': {
      slug: 'laboratory-equipment',
      children: ['balance', 'scale', 'microscope', 'centrifuge', 'autoclave', 'oven', 'incubator', 'pipette', 'dispenser', 'stopwatch', 'timer', 'spectrophotometer'],
    },
    'Lab Supplies': {
      slug: 'lab-supplies',
      children: ['glassware', 'plasticware', 'tube', 'bottle', 'flask', 'beaker', 'cylinder', 'pipet', 'filter', 'rack', 'stand', 'clamp'],
    },
    'Temperature Control': {
      slug: 'temperature-control',
      children: ['temperature controller', 'thermostat', 'heater', 'chiller', 'circulator', 'bath', 'probe', 'sensor'],
    },
    'Industrial Measurement': {
      slug: 'industrial-measurement',
      children: ['hydrometer', 'refractometer', 'density', 'viscosity', 'manometer', 'pressure gauge', 'flow meter', 'tachometer', 'stroboscope', 'anemometer'],
    },
    'Pump Accessories': {
      slug: 'pump-accessories',
      children: ['valve', 'fitting', 'connector', 'tubing', 'pipe', 'injection', 'back', 'relief', 'check valve', 'flow', 'level switch'],
    },
  }

  const nameLower = (name) => name.toLowerCase()

  let updated = 0
  for (const [parentName, config] of Object.entries(HIERARCHY)) {
    // Find the parent category
    const parent = allCats.find(c => 
      nameLower(c.name) === nameLower(parentName) || 
      c.slug === config.slug
    )
    if (!parent) {
      console.log(`[WARN] Parent not found: ${parentName}`)
      continue
    }

    // Find children
    for (const cat of allCats) {
      if (cat.id === parent.id) continue
      const catLower = nameLower(cat.name)
      const matched = config.children.some(kw => catLower.includes(kw.toLowerCase()))
      if (matched) {
        // Update parentId
        await prisma.category.update({
          where: { id: cat.id },
          data: { parentId: parent.id },
        })
        console.log(`  [OK] "${cat.name}" -> "${parentName}"`)
        updated++
      }
    }
  }

  console.log(`\nTotal updated: ${updated}`)
  
  // Verify
  const withParent = await prisma.$queryRaw`
    SELECT COUNT(*) as cnt FROM "Category" WHERE "isActive" = true AND "parentId" IS NOT NULL
  `
  console.log(`Categories with parent: ${withParent[0].cnt}`)
  const withoutParent = await prisma.$queryRaw`
    SELECT COUNT(*) as cnt FROM "Category" WHERE "isActive" = true AND "parentId" IS NULL
  `
  console.log(`Categories without parent: ${withoutParent[0].cnt}`)
}

main().finally(() => prisma.$disconnect())
