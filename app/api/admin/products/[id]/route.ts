import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

interface Props {
  params: Promise<{ id: string }>
}

// GET /api/admin/products/[id]
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('GET /api/admin/products/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/products/[id]
const updateProductSchema = z.object({
  sku: z.string().min(1).optional(),
  internalId: z.string().optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1).optional(),
  brandId: z.string().nullable().optional(),
  ourPrice: z.number().positive().optional(),
  listPrice: z.number().positive().nullable().optional(),
  costPrice: z.number().positive().nullable().optional(),
  currency: z.string().optional(),
  availability: z.enum(['in_stock', 'out_of_stock', 'lead_time']).optional(),
  stockQty: z.number().int().min(0).optional(),
  leadTimeDays: z.number().int().positive().nullable().optional(),
  weight: z.number().positive().nullable().optional(),
  weightUnit: z.string().optional(),
  dimension: z.string().nullable().optional(),
  specs: z.record(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  sourceUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
})

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateProductSchema.parse(body)

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check SKU uniqueness if changed
    if (data.sku && data.sku !== existing.sku) {
      const conflict = await prisma.product.findUnique({ where: { sku: data.sku } })
      if (conflict) {
        return NextResponse.json({ error: `SKU "${data.sku}" already exists` }, { status: 400 })
      }
    }

    // Update slug if name changed
    let slug = existing.slug
    if (data.name && data.name !== existing.name) {
      const baseSlug = slugify(data.name)
      let newSlug = baseSlug
      let counter = 1
      while (true) {
        const found = await prisma.product.findUnique({ where: { slug: newSlug } })
        if (!found || found.id === id) break
        newSlug = `${baseSlug}-${counter++}`
      }
      slug = newSlug
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        slug,
        brandId: data.brandId === null ? null : (data.brandId || existing.brandId),
      },
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('PUT /api/admin/products/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if product has orders
    const orderCount = await prisma.orderItem.count({ where: { productId: id } })
    if (orderCount > 0) {
      // Soft delete - just mark as inactive
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      })
      return NextResponse.json({ success: true, message: 'Product deactivated (has associated orders)' })
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/products/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
export const dynamic = 'force-dynamic'
