import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/v2/variants — flat variant list for filter panel
export async function GET() {
  const variants = await prisma.productVariant.findMany({
    where: { isActive: true },
    include: {
      spu: {
        include: { categoryGroup: true },
      },
      erpSkus: { take: 1 },
    },
    orderBy: { sellingPriceUsd: 'asc' },
  })

  const data = variants.map((v) => ({
    variantId: v.variantId,
    spuId: v.spuId,
    spuName: v.spu.productFamilyName,
    categorySlug: v.spu.categoryGroup?.slug || '',
    variantName: v.variantName,
    slug: v.slug || v.variantId.toLowerCase(),
    volumeMl: v.volumeMl,
    materialFamily: v.materialFamily,
    wallType: v.wallType,
    jointType: v.jointType,
    jointSize: v.jointSize,
    accuracyClass: v.accuracyClass,
    color: v.color,
    sellingPriceUsd: Number(v.sellingPriceUsd),
    stockHouston: v.erpSkus[0]?.stockHouston || 0,
    stockChina: v.erpSkus[0]?.stockChina || 0,
  }))

  // Extract unique filter values for the panel
  const filterOptions = {
    volumes: Array.from(new Set(data.map((v) => v.volumeMl).filter((v): v is number => v !== null))).sort((a, b) => a - b),
    materials: Array.from(new Set(data.map((v) => v.materialFamily).filter(Boolean))),
    wallTypes: Array.from(new Set(data.map((v) => v.wallType).filter(Boolean))),
    jointTypes: Array.from(new Set(data.map((v) => v.jointType).filter(Boolean))),
    jointSizes: Array.from(new Set(data.map((v) => v.jointSize).filter(Boolean))),
    accuracyClasses: Array.from(new Set(data.map((v) => v.accuracyClass).filter(Boolean))),
    priceRange: {
      min: Math.min(...data.map((v) => v.sellingPriceUsd)),
      max: Math.max(...data.map((v) => v.sellingPriceUsd)),
    },
  }

  return NextResponse.json({ variants: data, filterOptions })
}

export const dynamic = 'force-dynamic'
