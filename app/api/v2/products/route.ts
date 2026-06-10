import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/v2/products — SPU-aggregated product list (V3.2)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '24'), 100)
  const offset = parseInt(searchParams.get('offset') || '0')
  const categorySlug = searchParams.get('category')

  const where: any = { isActive: true }
  if (categorySlug) {
    where.categoryGroup = { slug: categorySlug }
  }

  const [spus, total] = await Promise.all([
    prisma.sPU.findMany({
      where,
      include: {
        categoryGroup: true,
        variants: {
          where: { isActive: true },
          include: {
            erpSkus: { take: 1 },
          },
          orderBy: { sellingPriceUsd: 'asc' },
        },
      },
      orderBy: { productFamilyName: 'asc' },
      skip: offset,
      take: limit,
    }),
    prisma.sPU.count({ where }),
  ])

  // Transform to SPU-aggregated format
  const products = spus.map((spu) => {
    const prices = spu.variants
      .map((v) => Number(v.sellingPriceUsd))
      .filter(Boolean)
    const minPrice = prices.length ? Math.min(...prices) : 0
    const maxPrice = prices.length ? Math.max(...prices) : 0

    return {
      id: spu.spuId,
      name: spu.productFamilyName,
      slug: spu.slug || spu.spuId.toLowerCase(),
      categoryName: spu.categoryGroup?.name || spu.categoryL1,
      categorySlug: spu.categoryGroup?.slug || '',
      variantCount: spu.variants.length,
      priceRange: {
        min: minPrice,
        max: maxPrice,
        display: prices.length > 1
          ? `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`
          : `$${minPrice.toFixed(2)}`,
      },
      sizes: spu.variants.map((v) => ({
        variantId: v.variantId,
        volumeMl: v.volumeMl,
        materialFamily: v.materialFamily,
        price: Number(v.sellingPriceUsd),
        erpSku: v.erpSkus[0]?.erpSku || '',
        stockHouston: v.erpSkus[0]?.stockHouston || 0,
        stockChina: v.erpSkus[0]?.stockChina || 0,
      })),
    }
  })

  return NextResponse.json({
    products,
    total,
    offset,
    limit,
    hasMore: offset + limit < total,
  })
}

export const dynamic = 'force-dynamic'
