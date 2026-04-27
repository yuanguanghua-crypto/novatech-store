'use client'

import Link from 'next/link'
import {
  Package, ShoppingCart, FileText, Users,
  Clock, AlertCircle
} from 'lucide-react'
import { useAdminI18n } from './admin-i18n-provider'
import { formatPrice } from '@/lib/utils'

interface DashboardClientProps {
  stats: {
    productCount: number
    orderCount: number
    quoteCount: number
    customerCount: number
    pendingOrders: number
    pendingQuotes: number
    recentOrders: Array<{
      id: string
      orderNumber: string
      status: string
      total: number
      customerName: string
      items: Array<{ id: string }>
    }>
  }
}

export function DashboardClient({ stats }: DashboardClientProps) {
  const { t } = useAdminI18n()

  const STAT_CARDS = [
    { labelKey: 'dashboard_total_products' as const, value: stats.productCount, icon: Package, color: 'blue', href: '/admin/products' },
    { labelKey: 'dashboard_total_orders' as const, value: stats.orderCount, icon: ShoppingCart, color: 'green', href: '/admin/orders' },
    { labelKey: 'dashboard_quote_requests' as const, value: stats.quoteCount, icon: FileText, color: 'purple', href: '/admin/quotes' },
    { labelKey: 'dashboard_customers' as const, value: stats.customerCount, icon: Users, color: 'orange', href: '/admin/customers' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.dashboard_title}</h1>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card) => (
          <Link key={card.labelKey} href={card.href} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${card.color}-100 text-${card.color}-600`}><card.icon className="w-6 h-6" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-0.5">{t[card.labelKey]}</p>
          </Link>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {stats.pendingOrders > 0 && (
          <Link href="/admin/orders?status=pending" className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 hover:bg-yellow-100">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">{stats.pendingOrders} {t.dashboard_pending_orders}</p>
              <p className="text-sm text-yellow-600">{t.dashboard_require_attention}</p>
            </div>
          </Link>
        )}
        {stats.pendingQuotes > 0 && (
          <Link href="/admin/quotes?status=pending" className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 hover:bg-blue-100">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">{stats.pendingQuotes} {t.dashboard_quote_requests}</p>
              <p className="text-sm text-blue-600">{t.dashboard_awaiting_review}</p>
            </div>
          </Link>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{t.dashboard_recent_orders}</h2>
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-700">{t.dashboard_view_all}</Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">{t.dashboard_no_orders}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="text-left px-5 py-3">{t.dashboard_order_col}</th>
                <th className="text-left px-5 py-3">{t.dashboard_customer_col}</th>
                <th className="text-left px-5 py-3">{t.dashboard_items_col}</th>
                <th className="text-left px-5 py-3">{t.dashboard_total_col}</th>
                <th className="text-left px-5 py-3">{t.dashboard_status_col}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm text-brand-600 hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{order.customerName}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">{formatPrice(order.total.toString())}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${
                      order.status === 'delivered' ? 'badge-green' :
                      order.status === 'shipped' ? 'badge-blue' :
                      order.status === 'paid' ? 'badge-blue' :
                      order.status === 'cancelled' ? 'badge-red' : 'badge-yellow'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
