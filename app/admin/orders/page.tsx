'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { useAdminI18n } from '@/components/admin/admin-i18n-provider'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  payment_pending: 'bg-orange-100 text-orange-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: string
  currency: string
  customerName: string
  customerEmail: string
  createdAt: string
  items: any[]
  user?: { name?: string; email: string }
}

export default function AdminOrdersPage() {
  const { t } = useAdminI18n()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const limit = 30

  const STATUS_FILTERS = [
    { value: '', labelKey: 'orders_all_status' as const },
    { value: 'pending', labelKey: 'orders_pending' as const },
    { value: 'paid', labelKey: 'orders_paid' as const },
    { value: 'processing', labelKey: 'orders_processing' as const },
    { value: 'shipped', labelKey: 'orders_shipped' as const },
    { value: 'delivered', labelKey: 'orders_delivered' as const },
    { value: 'cancelled', labelKey: 'orders_cancelled' as const },
  ]

  const loadOrders = useCallback(async (pageNum = 1, status = statusFilter, searchTerm = search) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(limit),
        ...(status ? { status } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
      })
      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
      setPage(pageNum)
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search])

  const [initialized, setInitialized] = useState(false)
  if (!initialized) {
    loadOrders(1, '', '')
    setInitialized(true)
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setStatusFilter(val)
    loadOrders(1, val, search)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    loadOrders(1, statusFilter, search)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.orders_title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t.orders_total.replace('{count}', total.toLocaleString())}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
          <input
            type="text"
            placeholder={t.orders_search_placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">
            {t.orders_search}
          </button>
        </form>
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          {STATUS_FILTERS.map(f => (
            <option key={f.value} value={f.value}>{t[f.labelKey]}</option>
          ))}
        </select>
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); loadOrders(1, '', '') }}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
          >
            {t.orders_clear}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.orders_order_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.orders_customer_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.orders_date_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.orders_items_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.orders_total_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.orders_status_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.orders_payment_col}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">{t.orders_loading}</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    {search || statusFilter ? t.orders_no_results : t.orders_no_orders}
                  </td>
                </tr>
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm font-medium text-brand-700 hover:underline">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{order.user?.name || order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.user?.email || order.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items.length}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-500">
              {t.orders_page_of
                .replace('{page}', String(page))
                .replace('{total}', String(totalPages))
                .replace('{count}', total.toLocaleString())}
            </span>
            <div className="flex gap-1">
              <button onClick={() => loadOrders(page - 1)} disabled={page <= 1}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-40">
                {t.orders_previous}
              </button>
              <button onClick={() => loadOrders(page + 1)} disabled={page >= totalPages}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-40">
                {t.orders_next}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
