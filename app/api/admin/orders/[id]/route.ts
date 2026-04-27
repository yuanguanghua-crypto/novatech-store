import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'
export const dynamic = 'force-dynamic'


interface Props {
  params: Promise<{ id: string }>
}

// GET /api/admin/orders/[id]
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true, company: true } },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('GET /api/admin/orders/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/orders/[id] - Update order status
const updateOrderSchema = z.object({
  status: z.enum([
    'pending', 'payment_pending', 'paid', 'processing',
    'shipped', 'delivered', 'cancelled', 'refunded'
  ]).optional(),
  paymentStatus: z.enum(['unpaid', 'paid', 'refunded']).optional(),
  paymentMethod: z.string().optional(),
  shippingMethod: z.string().optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
})

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateOrderSchema.parse(body)

    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updateData: any = { ...data }

    // Set timestamps for specific status changes
    if (data.status === 'shipped') {
      updateData.shippedAt = new Date()
    }
    if (data.status === 'delivered') {
      updateData.deliveredAt = new Date()
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: { include: { product: true } },
        user: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('PUT /api/admin/orders/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
