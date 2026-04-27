import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Package } from 'lucide-react'
import { AccountOrdersClient } from '@/components/store/account-orders-client'

export const metadata: Metadata = { title: 'My Orders' }

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login?callbackUrl=/account/orders')

  const userId = (session.user as any).id
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return <AccountOrdersClient orders={orders as any} />
}

