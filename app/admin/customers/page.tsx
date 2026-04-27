import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { CustomersClient } from '@/components/admin/customers-client'

export const metadata: Metadata = { title: 'Customers - Admin' }

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'customer' },
    include: { _count: { select: { orders: true, quotes: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return <CustomersClient customers={customers} />
}
