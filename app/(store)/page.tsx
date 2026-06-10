import prisma from '@/lib/prisma'
import { HomeClient } from '@/components/store/home-client'

export const dynamic = 'force-dynamic'

async function getFeaturedProducts() {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { isActive: true },
      include: {
        spu: { select: { productFamilyName: true, categoryGroup: { select: { name: true, slug: true } } } },
        erpSkus: { take: 1 },
      },
      orderBy: { sellingPriceUsd: 'desc' },
      take: 8,
    })

    return variants.map((v) => ({
      id: v.variantId,
      slug: v.slug || v.variantId.toLowerCase(),
      name: v.variantName,
      sku: v.erpSkus[0]?.erpSku || v.variantId,
      ourPrice: v.sellingPriceUsd.toString(),
      listPrice: null as string | null,
      availability: (v.erpSkus[0]?.stockHouston ?? 0) > 0 ? 'in_stock' as const : 'out_of_stock' as const,
      brand: { name: v.spu.productFamilyName },
      category: v.spu.categoryGroup ? { name: v.spu.categoryGroup.name, slug: v.spu.categoryGroup.slug } : null,
      images: [] as { url: string }[],
    }))
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const groups = await prisma.categoryGroup.findMany({
      where: { isActive: true },
      include: { _count: { select: { spus: true } } },
      orderBy: { sortOrder: 'asc' },
    })

    return groups.map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      icon: '',
      totalProducts: g._count.spus,
    }))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return <HomeClient featuredProducts={featuredProducts} categories={categories as any} />
}
