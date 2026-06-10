// @ts-nocheck - TODO: migrate to V3.2
import prisma from '@/lib/prisma'
import { DashboardClient } from '@/components/admin/dashboard-client'

async function getDashboardStats() {
  const [
    productCount, orderCount, quoteCount, customerCount,
    pendingOrders, pendingQuotes, recentOrders
  ] = await Promise.all([
    prisma.productVariant.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.quote.count(),
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.quote.count({ where: { status: 'pending' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
  ])

  return { productCount, orderCount, quoteCount, customerCount, pendingOrders, pendingQuotes, recentOrders }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  return <DashboardClient stats={stats as any} />
}
