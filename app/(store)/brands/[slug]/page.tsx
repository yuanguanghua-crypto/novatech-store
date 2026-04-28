import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { BrandDetailClient } from '@/components/store/brand-detail-client'
import { getBrandProfile } from '@/lib/brand-profiles'

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

type ProductItem = {
  id: string
  slug: string
  sku: string
  name: string
  ourPrice: any
  availability: string
  images: { url: string }[]
  category: { name: string; slug: string }
  brand: { name: string; slug: string }
}

const PAGE_SIZE = 24

async function getBrand(slug: string) {
  return prisma.brand.findUnique({ where: { slug } })
}

async function getProducts(brandSlug: string, searchParams: BrandPageProps['searchParams']) {
  const page = parseInt(searchParams.page || '1')
  const skip = (page - 1) * PAGE_SIZE

  const where: any = { isActive: true, brand: { slug: brandSlug, isActive: true } }
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
      select: {
        id: true,
        slug: true,
        sku: true,
        name: true,
        ourPrice: true,
        availability: true,
        images: { select: { url: true }, where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
      },
      orderBy,
      skip,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ])

  // Ensure brand is never null for the component
  const validProducts = products.filter(p => p.brand !== null) as ProductItem[]

  return { products: validProducts, total, page, pageSize: PAGE_SIZE }
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const brand = await getBrand(params.slug)
  if (!brand) return {}
  const profile = getBrandProfile(params.slug)
  return {
    title: `${brand.name} Products - ${profile?.specialty || 'Industrial Equipment'}`,
    description: profile?.description || `Browse ${brand.name} products - Industrial and laboratory equipment`,
  }
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const brand = await getBrand(params.slug)
  if (!brand) notFound()

  const { products, total, page, pageSize } = await getProducts(params.slug, searchParams)
  const totalPages = Math.ceil(total / pageSize)
  const brandProfile = getBrandProfile(params.slug)

  return (
    <BrandDetailClient
      brand={brand}
      products={products}
      total={total}
      page={page}
      pageSize={pageSize}
      totalPages={totalPages}
      currentSort={searchParams.sort}
      brandProfile={brandProfile}
    />
  )
}
