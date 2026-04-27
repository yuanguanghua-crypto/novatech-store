import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/products - 公开产品列表（供前端页面使用）
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 100)
  const offset = parseInt(searchParams.get('offset') || '0')
  const search = searchParams.get('search')
  const categorySlug = searchParams.get('category')
  const brandSlug = searchParams.get('brand')
  const sort = searchParams.get('sort') || 'name'
  const minPrice = parseFloat(searchParams.get('minPrice') || '0') || 0
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '9999999')

  const where: any = {
    isActive: true,
    ourPrice: { gte: minPrice, lte: maxPrice },
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { specsFlat: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (brandSlug) {
    where.brand = { slug: brandSlug }
  }

  const orderBy: any =
    sort === 'price_asc' ? { ourPrice: 'asc' } :
    sort === 'price_desc' ? { ourPrice: 'desc' } :
    sort === 'newest' ? { createdAt: 'desc' } :
    { name: 'asc' }

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
        brand: { select: { name: true, slug: true } },
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
