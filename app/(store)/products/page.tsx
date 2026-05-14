import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { ProductsClient } from '@/components/store/products-client'
import { ProductCategoryExplain } from '@/components/store/product-category-explain'
import { generateOrganizationSchema } from '@/lib/structured-data'
import Script from 'next/script'

const BASE_URL = 'https://novatech-store-inky.vercel.app'

export const metadata: Metadata = {
  title: 'Industrial & Laboratory Equipment | NovaTech-USA',
  description:
    'Browse laboratory borosilicate glassware: beakers, flasks, cylinders, burettes, pipettes, condensers, and filtration systems. Precision instruments for analytical chemistry, research labs, and industrial QC.',
  keywords: [
    'laboratory glassware',
    'borosilicate 3.3',
    'beaker',
    'erlenmeyer flask',
    'graduated cylinder',
    'burette',
    'volumetric flask',
    'round bottom flask',
    'condenser',
    'filtration kit',
    'NovaTech',
    'laboratory equipment',
  ],
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
    searchParams.sort === 'price_asc'
      ? { ourPrice: 'asc' }
      : searchParams.sort === 'price_desc'
      ? { ourPrice: 'desc' }
      : searchParams.sort === 'newest'
      ? { createdAt: 'desc' }
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

async function getTopCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
      children: {
        where: { isActive: true },
        include: {
          _count: { select: { products: { where: { isActive: true } } } },
        },
        take: 5,
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
    take: 8,
  })
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [{ products, total, page, pageSize }, brands, categories] = await Promise.all([
    getProducts(searchParams),
    getBrands(),
    getTopCategories(),
  ])

  // Organization Schema for AEO
  const orgSchema = generateOrganizationSchema(BASE_URL)

  return (
    <>
      {/* Organization Schema */}
      <Script
        id="org-schema-products"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* AEO: Product Center Explanation Layer */}
      <ProductCategoryExplain totalProducts={total} categories={categories} />

      {/* Products List */}
      <ProductsClient
        products={products}
        brands={brands}
        total={total}
        page={page}
        pageSize={pageSize}
        searchParams={searchParams}
      />
    </>
  )
}
