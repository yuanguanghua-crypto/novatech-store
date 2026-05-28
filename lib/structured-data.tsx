/**
 * JSON-LD Schema Generators for AEO (Answer Engine Optimization)
 *
 * Generates structured data for:
 * - Product Schema (Google Shopping, AI product understanding)
 * - FAQPage Schema (AI citation, featured snippets)
 * - BreadcrumbList Schema (SEO breadcrumb context)
 * - Organization Schema (company trust signals)
 */

import type { MetadataRoute } from 'next'

// ─── Product Schema ─────────────────────────────────────────────────────────

export interface ProductSchemaData {
  name: string
  sku: string
  description?: string | null
  brandName?: string | null
  imageUrl?: string
  price: string
  currency?: string
  availability: string // 'in_stock' | 'out_of_stock' | 'lead_time'
  slug: string
  categoryName?: string
  ratingValue?: string
  reviewCount?: string
  additionalProperties?: Array<{ name: string; value: string }>
}

export function generateProductSchema(product: ProductSchemaData, baseUrl: string) {
  const availabilityMap: Record<string, string> = {
    in_stock: 'https://schema.org/InStock',
    out_of_stock: 'https://schema.org/OutOfStock',
    lead_time: 'https://schema.org/PreOrder',
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.description || `${product.name} - Industrial ${product.categoryName || 'equipment'} from ${product.brandName || 'LABPRO'}`,
    image: product.imageUrl ? [product.imageUrl] : undefined,
    brand: {
      '@type': 'Brand',
      name: product.brandName || 'LABPRO',
    },
    category: product.categoryName,
    additionalProperty: product.additionalProperties?.map((property) => ({
      '@type': 'PropertyValue',
      name: property.name,
      value: property.value,
    })),
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: product.currency || 'USD',
      price: product.price,
      availability: availabilityMap[product.availability] || 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'LABPRO',
        url: baseUrl,
      },
    },
    aggregateRating: product.ratingValue
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.ratingValue,
          reviewCount: product.reviewCount || '50',
          bestRating: '5',
          worstRating: '1',
        }
      : undefined,
    ...(product.sku && { productID: product.sku }),
  }
}

// ─── FAQ Schema ──────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQSchema(faqs: FAQItem[], baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ─── Breadcrumb Schema ───────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  }
}

// ─── Organization Schema ────────────────────────────────────────────────────

export function generateOrganizationSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LABPRO',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'LABPRO manufactures precision borosilicate 3.3 laboratory glassware for analytical chemistry, research labs, and industrial quality control. From beakers and flasks to distillation and filtration systems.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressRegion: 'CA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@labpro.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'Chinese', 'Spanish', 'Japanese'],
    },
    sameAs: [
      'https://www.labpro.com',
    ],
  }
}

// ─── Knowledge Page Schema (HowTo) ──────────────────────────────────────────

export interface HowToStep {
  name: string
  text: string
}

export function generateHowToSchema(
  title: string,
  description: string,
  steps: HowToStep[],
  baseUrl: string,
  slug: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: description,
    url: `${baseUrl}/${slug}`,
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}/og-image.jpg`,
    },
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    totalTime: 'PT10M',
  }
}

// ─── Combined Page Schema Helper ─────────────────────────────────────────────

export interface PageSchemas {
  product?: ReturnType<typeof generateProductSchema>
  faq?: ReturnType<typeof generateFAQSchema>
  breadcrumb?: ReturnType<typeof generateBreadcrumbSchema>
  organization?: ReturnType<typeof generateOrganizationSchema>
}

/**
 * Render multiple JSON-LD schemas as script tags
 */
export function SchemaScripts({ schemas }: { schemas: PageSchemas }) {
  const schemaList = Object.entries(schemas)
    .filter(([_, schema]) => schema !== undefined)
    .map(([key, schema]) => ({
      key,
      schema,
    }))

  return (
    <>
      {schemaList.map(({ key, schema }) => (
        <script
          key={key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
