import prisma from '@/lib/prisma'
import { HomeClient } from '@/components/store/home-client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// 每个分类对应的 emoji 图标
const CATEGORY_ICONS: Record<string, string> = {
  'diaphragm-metering-pumps': '⚙️',
  'peristaltic-metering-pumps': '🔄',
  'piston-metering-pumps': '🎯',
  'ph-orp-controllers': '💧',
  'colorimeters': '🌈',
  'turbidity-meters': '🌫️',
  'conductivity-controllers': '⚡',
  'precision-balances': '⚖️',
  'analytical-balances': '🔬',
  'moisture-balances-scales': '💧',
  'compound-microscopes': '🔭',
  'stereo-microscopes': '👁️',
  'autoclaves': '🔥',
  'centrifuge-tubes': '🧪',
  'bottletop-dispensers': '💉',
  'temperature-controllers': '🌡️',
  'rtd-probes': '🌡️',
  'thermocouple-probes': '🌡️',
  'pal-refractometers': '🔷',
  'api-hydrometers': '📊',
  'manometers': '📏',
  'solenoidadapter-valves': '🔌',
  'solenoid-other-valves': '🔌',
  'flow-indicators': '➡️',
  'tds-conductivity-meters': '💧',
  'dissolved-oxygen-meters': '🫧',
  'ph-orp-buffers': '🧴',
  'liquid-reagents': '🧴',
  'powder-tablet-reagents': '💊',
  'balance-scale-accessories': '⚙️',
  'microscope-accessories': '🔧',
}

function getCategoryIcon(slug: string): string {
  return CATEGORY_ICONS[slug] || '📦'
}

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const parents = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            _count: { select: { products: { where: { isActive: true } } } },
          },
          orderBy: { name: 'asc' },
          take: 4,
        },
      },
      take: 6,
    })

    const childCats: { id: string; name: string; slug: string; icon: string; totalProducts: number }[] = []
    for (const parent of parents) {
      if (parent.children.length > 0) {
        childCats.push(
          ...parent.children.map(child => ({
            id: child.id,
            name: child.name,
            slug: child.slug,
            icon: getCategoryIcon(child.slug),
            totalProducts: child._count.products,
          }))
        )
      }
    }
    return childCats.slice(0, 12)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [rawProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  // 序列化 Decimal 为 string（Prisma Decimal 无法直接传给 Client Component）
  const featuredProducts = rawProducts.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    ourPrice: p.ourPrice.toString(),
    listPrice: p.listPrice?.toString() ?? null,
    availability: p.availability,
    brand: p.brand,
    category: p.category,
    images: p.images.map(img => ({ url: (img as any).url || '' })),
  }))

  return <HomeClient featuredProducts={featuredProducts} categories={categories} />
}
