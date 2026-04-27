import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { BrandDetailClient } from '@/components/store/brand-detail-client'

interface BrandPageProps {
  params: { slug: string }
  searchParams: {
    page?: string
    sort?: string
    category?: string
    availability?: string
    minPrice?: string
    maxPrice?: string
  }
}

const PAGE_SIZE = 24

async function getBrand(slug: string) {
  return prisma.brand.findUnique({ where: { slug } })
}

async function getProducts(brandSlug: string, searchParams: BrandPageProps['searchParams']) {
  const page = parseInt(searchParams.page || '1')
  const skip = (page - 1) * PAGE_SIZE

  const where: any = { isActive: true, brand: { slug: brandSlug } }
  if (searchParams.category) where.category = { slug: searchParams.category }
  if (searchParams.availability === 'in_stock') where.availability = 'in_stock'
  if (searchParams.minPrice || searchParams.maxPrice) {
    where.ourPrice = {}
    if (searchParams.minPrice) where.ourPrice.gte = parseFloat(searchParams.minPrice)
    if (searchParams.maxPrice) where.ourPrice.lte = parseFloat(searchParams.maxPrice)
  }

  const orderBy: any =
    searchParams.sort === 'price_asc' ? { ourPrice: 'asc' }
    : searchParams.sort === 'price_desc' ? { ourPrice: 'desc' }
    : searchParams.sort === 'newest' ? { createdAt: 'desc' }
    : { isFeatured: 'desc' }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
      },
      orderBy,
      skip,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ])

  return { products, total, page, pageSize: PAGE_SIZE }
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const brand = await getBrand(params.slug)
  if (!brand) return {}
  return {
    title: `${brand.name} Products`,
    description: `Browse ${brand.name} products - Industrial and laboratory equipment`,
  }
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const brand = await getBrand(params.slug)
  if (!brand) notFound()

  const { products, total, page, pageSize } = await getProducts(params.slug, searchParams)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <BrandDetailClient
      brand={brand}
      products={products}
      total={total}
      page={page}
      pageSize={pageSize}
      totalPages={totalPages}
      currentSort={searchParams.sort}
    />
  )
}
