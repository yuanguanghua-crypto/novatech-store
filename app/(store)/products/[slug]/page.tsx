import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ProductDetailV2 } from '@/components/store/product-detail/product-detail-v2'
import { formatPrice } from '@/lib/utils'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

interface PageProps {
  params: { slug: string }
}

// Fetch variant + SPU data for the given slug
async function getVariant(slug: string) {
  const variant = await prisma.productVariant.findFirst({
    where: { slug, isActive: true },
    include: {
      spu: {
        include: { categoryGroup: true },
      },
      erpSkus: { take: 1 },
    },
  })
  if (!variant) return null

  const spu = variant.spu
  const erpSku = variant.erpSkus[0]

  // Build specs
  const specs: { label: string; value: string }[] = []
  if (variant.volumeMl) specs.push({ label: 'Capacity', value: `${variant.volumeMl} ml` })
  if (variant.materialFamily) specs.push({ label: 'Material', value: variant.materialFamily })
  if (variant.wallType) specs.push({ label: 'Wall Type', value: variant.wallType })
  if (variant.jointType) specs.push({ label: 'Joint Type', value: variant.jointType })
  if (variant.jointSize) specs.push({ label: 'Joint Size', value: variant.jointSize })
  if (variant.accuracyClass) specs.push({ label: 'Accuracy Class', value: variant.accuracyClass })
  if (variant.lengthMm) specs.push({ label: 'Length', value: `${variant.lengthMm} mm` })
  if (variant.color) specs.push({ label: 'Color', value: variant.color })

  // Get sibling variants
  const siblings = await prisma.productVariant.findMany({
    where: { spuId: spu.spuId, isActive: true, variantId: { not: variant.variantId } },
    orderBy: { volumeMl: 'asc' },
  })

  return {
    variant: {
      id: variant.variantId,
      slug: variant.slug || slug,
      name: variant.variantName,
      sku: erpSku?.erpSku || '',
      description: spu.seoTitle || '',
      price: Number(variant.sellingPriceUsd),
      specs,
      stockHouston: erpSku?.stockHouston || 0,
      stockChina: erpSku?.stockChina || 0,
    },
    spu: {
      id: spu.spuId,
      name: spu.productFamilyName,
      categoryName: spu.categoryGroup?.name || spu.categoryL1,
      categorySlug: spu.categoryGroup?.slug || '',
    },
    siblingVariants: siblings.map((s) => ({
      variantId: s.variantId,
      slug: s.slug || '',
      volumeMl: s.volumeMl,
      materialFamily: s.materialFamily,
      price: Number(s.sellingPriceUsd),
    })),
  }
}

// SEO: Generate metadata from variant data
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getVariant(params.slug).catch(() => null)
  if (!data) return { title: 'Product Not Found' }

  return {
    title: `${data.variant.name} | ${data.spu.categoryName} | LabPro Store`,
    description: data.variant.specs
      .map((s) => `${s.label}: ${s.value}`)
      .join(', ') || data.variant.description,
    openGraph: {
      title: data.variant.name,
      description: `${formatPrice(data.variant.price)} - ${data.spu.name}`,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const data = await getVariant(params.slug)
  if (!data) notFound()

  return <ProductDetailV2
    variant={data.variant}
    spu={data.spu}
    siblingVariants={data.siblingVariants}
  />
}
