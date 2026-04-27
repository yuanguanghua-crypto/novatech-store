import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ProductDetailClient } from '@/components/store/product-detail-client'

interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
      brand: true,
    },
  })
}

async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      brand: { select: { name: true } },
    },
    take: 4,
    orderBy: { isFeatured: 'desc' },
  })
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return {}
  return {
    title: `${product.sku} - ${product.name}`,
    description: product.description?.slice(0, 160) || `${product.name} by ${product.brand?.name}`,
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product.categoryId, product.id)

  return <ProductDetailClient product={product} related={related} />
}
