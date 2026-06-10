// @ts-nocheck - TODO: migrate to V3.2
import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

const BASE_URL = 'https://novatech-store-inky.vercel.app'

// AEO: Knowledge pages for AI reference and SEO
const knowledgePages: MetadataRoute.Sitemap = [
  // What-is pages
  {
    url: `${BASE_URL}/knowledge/what-is/graduated-cylinder`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/knowledge/what-is/distillation`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/knowledge/what-is/vacuum-pump`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/knowledge/what-is/glassware-care`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  // How-to-choose pages
  {
    url: `${BASE_URL}/knowledge/how-to-choose/laboratory-glassware`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  // Compare pages
  {
    url: `${BASE_URL}/knowledge/compare/borosilicate-vs-soda-lime`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/knowledge/compare/class-a-vs-class-b`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/quote`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/quote`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Get dynamic product pages
  try {
    const variants = await prisma.productVariant.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 1000, // Limit for performance
    })

    const productPages: MetadataRoute.Sitemap = variants.map((product) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Get category pages
    const categories = await prisma.categoryGroup.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })

    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${BASE_URL}/categories/${category.slug}`,
      lastModified: new Date(category.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...knowledgePages, ...productPages, ...categoryPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
