import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

const BASE_URL = 'https://novatech-store-inky.vercel.app'

// AEO: Knowledge pages for AI reference and SEO
const knowledgePages: MetadataRoute.Sitemap = [
  // What-is pages
  {
    url: `${BASE_URL}/knowledge/what-is/ph-meter`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/knowledge/what-is/dosing-pump`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/knowledge/what-is/conductivity-meter`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/knowledge/what-is/tds-meter`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  // How-to-choose pages
  {
    url: `${BASE_URL}/knowledge/how-to-choose/dosing-pump`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  // Compare pages
  {
    url: `${BASE_URL}/knowledge/compare/ph-meter-vs-orp-meter`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/knowledge/compare/digital-vs-analog-ph-meter`,
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
      url: `${BASE_URL}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
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
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 1000, // Limit for performance
    })

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Get category pages
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })

    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${BASE_URL}/categories/${category.slug}`,
      lastModified: new Date(category.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Get brand pages
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })

    const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
      url: `${BASE_URL}/brands/${brand.slug}`,
      lastModified: new Date(brand.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...knowledgePages, ...productPages, ...categoryPages, ...brandPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
