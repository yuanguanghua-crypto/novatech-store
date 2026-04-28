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

async function getCategory(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug, isActive: true },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            _count: { select: { products: { where: { isActive: true } } } },
          },
          orderBy: { name: 'asc' },
        },
        parent: {
          select: { id: true, name: true, slug: true },
        },
      },
    })
  } catch {
    return null
  }
}

async function getCategoryProducts(slug: string, sort = 'featured', page = 1) {
  const PAGE_SIZE = 24
  const skip = (page - 1) * PAGE_SIZE

  let orderBy: any = { isFeatured: 'desc' }
  if (sort === 'price_asc') orderBy = { ourPrice: 'asc' }
  if (sort === 'price_desc') orderBy = { ourPrice: 'desc' }
  if (sort === 'newest') orderBy = { createdAt: 'desc' }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { category: { slug }, isActive: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        brand: { select: { name: true, slug: true } },
      },
      orderBy,
      skip,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where: { category: { slug }, isActive: true } }),
  ])

  return { products, total, pageSize: PAGE_SIZE }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = await getCategory(slug)
  if (!cat) return { title: 'Category Not Found' }
  const profile = getCategoryProfile(slug)
  return {
    title: `${cat.name} - ${profile?.keyParameters?.[0]?.name || 'Professional Equipment'}`,
    description: profile?.definition || `Browse ${cat.name} products. ${cat._count?.products || 0} products available.`,
  }
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
    return (
      <CategoryDetailClient
        category={category}
        slug={slug}
        isParent={true}
      />
    )
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
