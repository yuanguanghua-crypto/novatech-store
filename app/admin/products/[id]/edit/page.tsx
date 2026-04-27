import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'
import { ProductHeaderClient } from '@/components/admin/product-header-client'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true },
  })
  return { title: product ? `Edit ${product.name} - Admin` : 'Edit Product - Admin' }
}

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
    },
  })

  if (!product) notFound()

  return (
    <div>
      <div className="mb-6">
        <ProductHeaderClient mode="edit" productName={product.name} productSku={product.sku} />
      </div>
      <ProductForm
        mode="edit"
        product={{
          id: product.id,
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          categoryId: product.categoryId,
          brandId: product.brandId || '',
          ourPrice: Number(product.ourPrice),
          listPrice: product.listPrice ? Number(product.listPrice) : 0,
          costPrice: product.costPrice ? Number(product.costPrice) : 0,
          currency: product.currency,
          availability: product.availability,
          stockQty: product.stockQty,
          leadTimeDays: product.leadTimeDays || 0,
          weight: product.weight ? Number(product.weight) : 0,
          weightUnit: product.weightUnit || 'lbs',
          dimension: product.dimension || '',
          specs: (product.specs as Record<string, string>) || {},
          sourceUrl: product.sourceUrl || '',
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          images: product.images.map(img => ({
            id: img.id,
            url: img.url,
            altText: img.altText || '',
            isPrimary: img.isPrimary,
          })),
        }}
      />
    </div>
  )
}
