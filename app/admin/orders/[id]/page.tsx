import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { OrderDetailClient } from '@/components/admin/order-detail-client'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id }, select: { orderNumber: true } })
  return { title: order ? `Order #${order.orderNumber} - Admin` : 'Order Not Found - Admin' }
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
      user: { select: { id: true, name: true, email: true, company: true } },
    },
  })

  if (!order) notFound()

  // Serialize for client component
  const serializedOrder = {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod || undefined,
    shippingMethod: order.shippingMethod || undefined,
    trackingNumber: order.trackingNumber || undefined,
    subtotal: order.subtotal.toString(),
    shippingCost: order.shippingCost.toString(),
    taxAmount: order.taxAmount.toString(),
    total: order.total.toString(),
    currency: order.currency,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerCompany: order.customerCompany || undefined,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt.toISOString(),
    shippedAt: order.shippedAt?.toISOString(),
    deliveredAt: order.deliveredAt?.toISOString(),
    notes: order.notes || undefined,
    items: order.items.map(item => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      total: item.total.toString(),
      imageUrl: item.product.images[0]?.url || undefined,
    })),
    user: order.user ? {
      name: order.user.name || undefined,
      email: order.user.email,
    } : undefined,
  }

  return <OrderDetailClient order={serializedOrder} />
}
