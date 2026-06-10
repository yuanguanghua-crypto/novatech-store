// @ts-nocheck - TODO: migrate to V3.2
import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { SearchClient } from '@/components/store/search-client'

interface SearchPageProps {
  searchParams: {
    q?: string
    page?: string
    sort?: string
  }
}

const PAGE_SIZE = 24

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  return {
    title: searchParams.q ? `"${searchParams.q}" - Search Results` : 'Search',
  }
}

async function searchProducts(q: string, page: number, sort?: string) {
  const skip = (page - 1) * PAGE_SIZE
  const where: any = {
    isActive: true,
    OR: [
      { name: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { brand: { name: { contains: q, mode: 'insensitive' } } },
    ],
  }

  const orderBy: any =
    sort === 'price_asc' ? { ourPrice: 'asc' }
    : sort === 'price_desc' ? { ourPrice: 'desc' }
    : sort === 'newest' ? { createdAt: 'desc' }
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

  return { products, total }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.trim() || ''
  const page = parseInt(searchParams.page || '1')

  if (!q) {
    return <SearchClient q="" products={[]} total={0} page={1} totalPages={1} PAGE_SIZE={PAGE_SIZE} />
  }

  const { products, total } = await searchProducts(q, page, searchParams.sort)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <SearchClient
      q={q}
      products={products}
      total={total}
      page={page}
      totalPages={totalPages}
      currentSort={searchParams.sort}
      PAGE_SIZE={PAGE_SIZE}
    />
  )
}
