import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form-new'
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
      category: true,
    },
  })

  if (!product) notFound()

  // Get parent category if this is a child category
  let parentCategory = null
  if (product.category.parentId) {
    parentCategory = await prisma.category.findUnique({
      where: { id: product.category.parentId },
    })
  }

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
          categoryId: parentCategory?.id || product.categoryId,
          subcategoryId: parentCategory ? product.categoryId : '',
          brandId: product.brandId || '',
          ourPrice: Number(product.ourPrice),
          listPrice: product.listPrice ? Number(product.listPrice) : '',
          costPrice: product.costPrice ? Number(product.costPrice) : '',
          currency: product.currency,
          availability: product.availability as 'in_stock' | 'out_of_stock' | 'lead_time',
          stockQty: product.stockQty.toString(),
          leadTimeDays: product.leadTimeDays?.toString() || '',
          weight: product.weight ? Number(product.weight).toString() : '',
          weightUnit: (product.weightUnit || 'lbs') as 'lbs' | 'kg' | 'oz',
          dimension: product.dimension || '',
          specs: (product.specs as Record<string, string>) || {},
          sourceUrl: product.sourceUrl || '',
          metaTitle: product.metaTitle || '',
          metaDesc: product.metaDesc || '',
          videoUrl: product.videoUrl || '',
          shippingMethods: (product.shippingMethods as any[]) || [],
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
