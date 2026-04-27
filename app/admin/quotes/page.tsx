'use client'

import { useState, useEffect } from 'react'
import { useAdminI18n } from '@/components/admin/admin-i18n-provider'

interface Quote {
  id: string
  quoteNumber: string
  customerEmail: string
  customerName: string
  customerCompany: string | null
  status: string
  quotedPrice: string | null
  createdAt: string
  items: { id: string }[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  quoted: 'bg-green-100 text-green-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  declined: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800',
}

const STATUS_TABS = [
  { value: 'all', labelKey: 'quotes_all' as const },
  { value: 'pending', labelKey: 'quotes_pending' as const },
  { value: 'reviewing', labelKey: 'quotes_reviewing' as const },
  { value: 'quoted', labelKey: 'quotes_quoted' as const },
  { value: 'accepted', labelKey: 'quotes_accepted' as const },
  { value: 'declined', labelKey: 'quotes_declined' as const },
]

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function AdminQuotesPage() {
  const { t } = useAdminI18n()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/quotes?limit=50')
      .then(r => r.json())
      .then(data => {
        setQuotes(data.quotes || [])
        setLoading(false)
      })
  }, [])

  const filtered = quotes.filter(q => {
    const matchStatus = filter === 'all' || q.status === filter
    const matchSearch = !search ||
      q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName.toLowerCase().includes(search.toLowerCase()) ||
      q.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      (q.customerCompany?.toLowerCase().includes(search.toLowerCase()) ?? false)
    return matchStatus && matchSearch
  })

  const statusCounts = quotes.reduce((acc, q) => {
    acc[q.status] = (acc[q.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.quotes_title}</h1>
        <span className="text-sm text-gray-500">
          {t.quotes_of_requests
            .replace('{shown}', String(filtered.length))
            .replace('{total}', String(quotes.length))}
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t.quotes_search_placeholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {STATUS_TABS.map(s => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${filter === s.value ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {t[s.labelKey]}{statusCounts[s.value] ? ` (${statusCounts[s.value]})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.quotes_quote_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.quotes_customer_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.quotes_date_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.quotes_items_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.quotes_status_col}</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">{t.quotes_quote_price_col}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="animate-spin w-6 h-6 border-3 border-brand-600 border-t-transparent rounded-full" />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">{t.quotes_no_requests}</td>
                </tr>
              ) : filtered.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/admin/quotes/${quote.id}`}>
                  <td className="px-4 py-3 font-mono text-sm font-medium text-brand-700">
                    {quote.quoteNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{quote.customerName}</div>
                    <div className="text-xs text-gray-500">{quote.customerEmail}</div>
                    {quote.customerCompany && (
                      <div className="text-xs text-gray-400">{quote.customerCompany}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(quote.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-600">{quote.items.length}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[quote.status] || 'bg-gray-100'}`}>
                      {t[`quotes_${quote.status}` as keyof typeof t] as string || capitalize(quote.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {quote.quotedPrice ? (
                      <span className="font-semibold text-gray-900">${parseFloat(quote.quotedPrice).toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
