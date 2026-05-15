'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: Date
  items: { id: string; name: string; quantity: number; price: number }[]
}

interface Props {
  orders: Order[]
}

export function AccountOrdersClient({ orders }: Props) {
  const { t } = useI18n()

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{t.account_orders}</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
          <Package className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <h2 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{t.account_no_orders}</h2>
          <p className="mb-6" style={{ color: 'var(--text-tertiary)' }}>{t.account_orders_appear_here}</p>
          <Link href="/products" className="btn-primary px-6 py-2.5">
            {t.account_browse_products}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="rounded-xl p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>#{order.orderNumber}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{order.createdAt.toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`} style={!statusColors[order.status] ? { backgroundColor: 'var(--surface-100)', color: 'var(--text-primary)' } : undefined}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t.account_order_items.replace('{count}', order.items.length.toString())}
                </div>
                <div className="font-bold text-brand-700">${order.total.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
