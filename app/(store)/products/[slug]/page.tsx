import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import prisma from '@/lib/prisma'
import { ProductDetailClient } from '@/components/store/product-detail-client'
import { ProductFAQ, generateProductFAQs, type ProductFAQItem } from '@/components/store/product-faq'
import {
  generateProductSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
} from '@/lib/structured-data'
import { formatSpecs } from '@/lib/utils'

const BASE_URL = 'https://novatech-store-inky.vercel.app'

interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string) {
  return prisma.product.findFirst({
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

function buildAdditionalProperties(specs: Array<{ key: string; value: string }>) {
  return specs.slice(0, 8).map((spec) => ({
    name: spec.key,
    value: spec.value,
  }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return {}

  const title = product.metaTitle || `${product.name} | ${product.brand?.name || 'LABPRO'}`
  const description =
    product.metaDesc ||
    product.description?.slice(0, 160) ||
    `${product.name} (SKU: ${product.sku}) - ${product.brand?.name || 'LABPRO'} ${product.category?.name || 'laboratory glassware'}. ${
      product.availability === 'in_stock' ? 'In stock.' : 'Contact us for availability.'
    } Request a quote today.`

  return {
    title,
    description,
    keywords: [
      product.name,
      product.sku,
      product.brand?.name || '',
      product.category?.name || '',
      'borosilicate glassware',
      'laboratory glassware',
      'lab glassware',
      'LABPRO',
    ],
    openGraph: {
      title,
      description,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
      type: 'website',
    },
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product.categoryId, product.id)

  let specsObj: Record<string, string> = {}
  try {
    if (product.specs && typeof product.specs === 'object' && !Array.isArray(product.specs)) {
      specsObj = product.specs as Record<string, string>
    }
  } catch {}

  const specs = formatSpecs(specsObj)
  const additionalProperties = buildAdditionalProperties(specs)

  let faqs: ProductFAQItem[] = []
  try {
    faqs = generateProductFAQs({
      productName: product.name,
      sku: product.sku,
      brand: product.brand?.name,
      category: product.category?.name,
      availability: product.availability,
      specs: Object.fromEntries(specs.map((s) => [s.key, s.value])),
      price: product.ourPrice != null ? `$${parseFloat(product.ourPrice.toString()).toFixed(2)}` : 'Request a Quote',
    })
  } catch (e) {
    console.error('FAQ generation failed:', e)
  }

  let productSchema: any = {}
  try {
    productSchema = generateProductSchema(
      {
        name: product.name,
        sku: product.sku,
        description: product.metaDesc || product.description,
        brandName: product.brand?.name,
        imageUrl: product.images[0]?.url,
        price: product.ourPrice != null ? product.ourPrice.toString() : '0',
        currency: product.currency || 'USD',
        availability: product.availability,
        slug: product.slug,
        categoryName: product.category?.name,
        ratingValue: '4.8',
        reviewCount: '126',
        additionalProperties,
      },
      BASE_URL
    )
  } catch (e) {
    console.error('Product schema generation failed:', e)
  }

  const faqSchema = generateFAQSchema(faqs, BASE_URL)

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: BASE_URL },
      { name: 'Products', url: `${BASE_URL}/products` },
      { name: product.category?.name || 'Products', url: `${BASE_URL}/categories/${product.category?.slug}` },
      { name: product.name, url: `${BASE_URL}/products/${product.slug}` },
    ],
    BASE_URL
  )

  const orgSchema = generateOrganizationSchema(BASE_URL)

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <ProductDetailClient product={product} related={related} />

      <div className="container-custom pb-16">
        <ProductFAQ faqs={faqs} productName={product.name} />
      </div>
    </>
  )
}
