import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/v2/products/[slug] — single product variant with SPU siblings
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  // Find variant by slug
  const variant = await prisma.productVariant.findFirst({
    where: { slug, isActive: true },
    include: {
      spu: {
        include: {
          categoryGroup: true,
          variants: {
            where: { isActive: true },
            include: {
              erpSkus: { take: 1 },
            },
            orderBy: { volumeMl: 'asc' as const },
          },
        },
      },
      erpSkus: true,
      supplierMaps: {
        include: { supplier: true },
      },
    },
  })

  if (!variant) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const spu = variant.spu

  // Build specs array from structured fields
  const specs: { label: string; value: string }[] = []
  if (variant.volumeMl) specs.push({ label: 'Capacity', value: `${variant.volumeMl} ml` })
  if (variant.materialFamily) specs.push({ label: 'Material', value: variant.materialFamily })
  if (variant.wallType) specs.push({ label: 'Wall Type', value: variant.wallType })
  if (variant.jointType) specs.push({ label: 'Joint Type', value: variant.jointType })
  if (variant.jointSize) specs.push({ label: 'Joint Size', value: variant.jointSize })
  if (variant.accuracyClass) specs.push({ label: 'Accuracy Class', value: variant.accuracyClass })
  if (variant.lengthMm) specs.push({ label: 'Length', value: `${variant.lengthMm} mm` })
  if (variant.color) specs.push({ label: 'Color', value: variant.color })

  const erpSku = variant.erpSkus[0]

  return NextResponse.json({
    variant: {
      id: variant.variantId,
      name: variant.variantName,
      slug: variant.slug,
      sku: erpSku?.erpSku || '',
      description: spu.seoTitle || '',
      price: Number(variant.sellingPriceUsd),
      costPrice: Number(variant.costPriceUsd),
      specs,
      stockHouston: erpSku?.stockHouston || 0,
      stockChina: erpSku?.stockChina || 0,
      volumeMl: variant.volumeMl,
      materialFamily: variant.materialFamily,
      wallType: variant.wallType,
    },
    spu: {
      id: spu.spuId,
      name: spu.productFamilyName,
      categoryName: spu.categoryGroup?.name || spu.categoryL1,
      categorySlug: spu.categoryGroup?.slug || '',
    },
    siblingVariants: spu.variants.map((v) => ({
      variantId: v.variantId,
      slug: v.slug,
      volumeMl: v.volumeMl,
      materialFamily: v.materialFamily,
      price: Number(v.sellingPriceUsd),
      erpSku: v.erpSkus[0]?.erpSku || '',
      stockHouston: v.erpSkus[0]?.stockHouston || 0,
      stockChina: v.erpSkus[0]?.stockChina || 0,
    })),
  })
}

export const dynamic = 'force-dynamic'
