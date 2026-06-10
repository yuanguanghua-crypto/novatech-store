import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { CategoryDetailClient } from '@/components/store/category-detail-client'
import { getCategoryProfile } from '@/lib/category-profiles'
import { getCategoryName } from '@/lib/i18n/category-translations'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}

// Get CategoryGroup + SPU count (V3.2)
async function getCategory(slug: string) {
  try {
    const group = await prisma.categoryGroup.findUnique({
      where: { slug, isActive: true },
      include: {
        _count: { select: { spus: true } },
      },
    })
    if (!group) return null

    return {
      id: group.id,
      name: group.name,
      slug: group.slug,
      description: group.description,
      imageUrl: null as string | null,
      parentId: null as string | null,
      parent: null,
      children: [] as any[],
      sortOrder: group.sortOrder,
      isActive: group.isActive,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      _count: { products: group._count.spus },
    }
  } catch {
    return null
  }
}

// Get variants for a category (V3.2)
async function getCategoryProducts(slug: string, _sort = 'featured', page = 1) {
  const PAGE_SIZE = 24
  const skip = (page - 1) * PAGE_SIZE

  let orderBy: { sellingPriceUsd: 'asc' | 'desc' } = { sellingPriceUsd: 'asc' }
  if (_sort === 'price_desc') orderBy = { sellingPriceUsd: 'desc' as const }

  const [variants, total] = await Promise.all([
    prisma.productVariant.findMany({
      where: {
        isActive: true,
        spu: { categoryGroup: { slug } },
      },
      include: {
        spu: { select: { productFamilyName: true } },
        erpSkus: { take: 1 },
      },
      orderBy,
      skip,
      take: PAGE_SIZE,
    }),
    prisma.productVariant.count({
      where: {
        isActive: true,
        spu: { categoryGroup: { slug } },
      },
    }),
  ])

  const products = variants.map((v) => ({
    id: v.variantId,
    slug: v.slug || v.variantId.toLowerCase(),
    sku: v.erpSkus[0]?.erpSku || v.variantId,
    name: v.variantName,
    ourPrice: v.sellingPriceUsd,
    isFeatured: false,
    availability: v.erpSkus[0]?.stockHouston > 0 ? 'in_stock' as const : 'out_of_stock' as const,
    images: [] as { url: string; isPrimary: boolean }[],
    brand: { name: v.spu.productFamilyName, slug: v.spuId.toLowerCase() },
  }))

  return { products, total, pageSize: PAGE_SIZE }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = await getCategory(slug)
  return { title: cat?.name || 'Category' }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { sort = 'featured', page = '1' } = await searchParams

  const category = await getCategory(slug)
  if (!category) notFound()

  const pageNum = parseInt(page)
  const isParent = category.children.length > 0
  const categoryProfile = getCategoryProfile(slug)

  if (isParent) {
    return <CategoryDetailClient category={category} slug={slug} isParent={true} />
  }

  const { products, total, pageSize } = await getCategoryProducts(slug, sort, pageNum)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <CategoryDetailClient
      category={category}
      products={products}
      total={total}
      pageNum={pageNum}
      totalPages={totalPages}
      sort={sort}
      slug={slug}
      isParent={false}
      categoryProfile={categoryProfile}
    />
  )
}
