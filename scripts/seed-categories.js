const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const categories = [
  { name: 'Basic Glassware', slug: 'basic-glassware', description: 'Beakers, flasks, test tubes, and other fundamental laboratory glassware for everyday use.', sortOrder: 1 },
  { name: 'Analytical Glassware', slug: 'analytical-glassware', description: 'Burettes, pipettes, volumetric flasks, and graduated cylinders for precise measurement and analysis.', sortOrder: 2 },
  { name: 'Storage Systems', slug: 'storage-systems', description: 'Media bottles, reagent bottles, desiccators, and storage containers for laboratory samples and chemicals.', sortOrder: 3 },
  { name: 'Reaction Systems', slug: 'reaction-systems', description: 'Round bottom flasks, condensers, distillation heads, and reaction vessels for chemical synthesis.', sortOrder: 4 },
  { name: 'Distillation Systems', slug: 'distillation-systems', description: 'Complete distillation setups including flasks, condensers, adapters, and collection vessels.', sortOrder: 5 },
  { name: 'Filtration Systems', slug: 'filtration-systems', description: 'Buchner funnels, filter flasks, vacuum filtration kits, and filtration apparatus.', sortOrder: 6 },
  { name: 'Kit Products', slug: 'kit-products', description: 'Pre-configured glassware kits for organic synthesis, distillation, and filtration applications.', sortOrder: 7 },
]

async function main() {
  console.log('Seeding categories...')
  for (const cat of categories) {
    const r = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder, isActive: true },
      create: { name: cat.name, slug: cat.slug, description: cat.description, sortOrder: cat.sortOrder, isActive: true },
    })
    console.log(`  ✓ ${r.name} (${r.slug})`)
  }
  const slugs = categories.map(c => c.slug)
  const d = await prisma.category.updateMany({ where: { slug: { notIn: slugs }, isActive: true }, data: { isActive: false } })
  console.log(`Deactivated ${d.count} old categories`)
  const b = await prisma.brand.upsert({
    where: { slug: 'novatech' },
    update: { name: 'NovaTech', description: 'Precision laboratory glassware manufacturer.', isActive: true },
    create: { name: 'NovaTech', slug: 'novatech', description: 'Precision laboratory glassware manufacturer.', country: 'USA', isActive: true },
  })
  console.log(`Brand: ${b.name}`)
  console.log('Done!')
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
