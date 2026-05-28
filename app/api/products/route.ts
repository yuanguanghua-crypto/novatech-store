import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { buildProductWhereClause, buildProductOrderBy } from '@/lib/catalog-filters'

// GET /api/products - 公开产品列表（供前端页面使用）
export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 100)
  const offset = parseInt(searchParams.get('offset') || '0')
  const search = searchParams.get('search')
  const q = searchParams.get('q')
  const categorySlug = searchParams.get('category')
  const brandSlug = searchParams.get('brand')
  const sort = searchParams.get('sort') || 'name'
  const minPrice = parseFloat(searchParams.get('minPrice') || '0') || 0
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '9999999')
  const where: any = buildProductWhereClause({
    search: q || search || '',
    category: categorySlug || undefined,
    brand: brandSlug || undefined,
    availability: searchParams.get('availability') || undefined,
    featured: searchParams.get('featured') || undefined,
    minPrice: String(minPrice),
    maxPrice: String(maxPrice),
  })

  const orderBy: any =
    sort === 'name'
      ? { name: 'asc' }
      : buildProductOrderBy(sort)

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        ourPrice: true,
        listPrice: true,
        availability: true,
        stockQty: true,
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    total,
    offset,
    limit,
    hasMore: offset + limit < total,
  })
}
export const dynamic = 'force-dynamic'
