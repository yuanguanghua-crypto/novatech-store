import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

// GET /api/admin/products - List products
export async function GET(request: NextRequest) {

  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const brandId = searchParams.get('brandId') || ''
    const isActive = searchParams.get('isActive')
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (categoryId) where.categoryId = categoryId
    if (brandId) where.brandId = brandId
    if (isActive !== null && isActive !== '') where.isActive = isActive === 'true'

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
          _count: { select: { orderItems: true, quoteItems: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({ products, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('GET /api/admin/products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/products - Create product
const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  internalId: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  videoUrl: z.string().optional(),
  shippingMethods: z.array(z.any()).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional(),
  ourPrice: z.number().positive('Price must be positive'),
  listPrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  currency: z.string().default('USD'),
  availability: z.enum(['in_stock', 'out_of_stock', 'lead_time']).default('in_stock'),
  stockQty: z.number().int().min(0).default(0),
  leadTimeDays: z.number().int().positive().optional(),
  weight: z.number().positive().optional(),
  weightUnit: z.string().default('lbs'),
  dimension: z.string().optional(),
  specs: z.record(z.string()).optional(),
  sourceUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  images: z.array(z.object({
    url: z.string(),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createProductSchema.parse(body)

    // Generate slug
    const baseSlug = slugify(data.name)
    let slug = baseSlug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`
    }

    // Check SKU uniqueness
    const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } })
    if (existingSku) {
      return NextResponse.json({ error: `SKU "${data.sku}" already exists` }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        internalId: data.internalId,
        name: data.name,
        slug,
        description: data.description,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        videoUrl: data.videoUrl,
        shippingMethods: data.shippingMethods,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        ourPrice: data.ourPrice,
        listPrice: data.listPrice,
        costPrice: data.costPrice,
        currency: data.currency,
        availability: data.availability,
        stockQty: data.stockQty,
        leadTimeDays: data.leadTimeDays,
        weight: data.weight,
        weightUnit: data.weightUnit,
        dimension: data.dimension,
        specs: data.specs || {},
        sourceUrl: data.sourceUrl,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        images: data.images ? { create: data.images } : undefined,
      },
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('POST /api/admin/products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
export const dynamic = 'force-dynamic'
