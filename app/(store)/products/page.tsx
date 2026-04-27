import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { ProductsClient } from '@/components/store/products-client'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse 15,000+ industrial and laboratory products',
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface ProductsPageProps {
  searchParams: {
    page?: string
    sort?: string
    brand?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    availability?: string
    featured?: string
  }
}

const PAGE_SIZE = 24

async function getProducts(searchParams: ProductsPageProps['searchParams']) {
  const page = parseInt(searchParams.page || '1')
  const skip = (page - 1) * PAGE_SIZE

  const where: any = { isActive: true }
  if (searchParams.brand) where.brand = { slug: searchParams.brand }
  if (searchParams.category) where.category = { slug: searchParams.category }
  if (searchParams.featured === 'true') where.isFeatured = true
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

async function getBrands() {
  return prisma.brand.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
    orderBy: { name: 'asc' },
  })
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [{ products, total, page, pageSize }, brands] = await Promise.all([
    getProducts(searchParams),
    getBrands(),
  ])

  return (
    <ProductsClient
      products={products}
      brands={brands}
      total={total}
      page={page}
      pageSize={pageSize}
      searchParams={searchParams}
    />
  )
}
