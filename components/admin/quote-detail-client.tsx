'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface QuoteItem {
  id: string
  quantity: number
  notes: string | null
  unitPrice: string | null
  product: {
    id: string
    name: string
    sku: string
    images: { url: string }[]
  }
}

interface Quote {
  id: string
  quoteNumber: string
  customerEmail: string
  customerName: string
  customerCompany: string | null
  customerPhone: string | null
  message: string | null
  status: string
  quotedPrice: string | null
  quotedAt: string | null
  expiresAt: string | null
  adminNotes: string | null
  createdAt: string
  updatedAt: string
  items: QuoteItem[]
  user: { name: string | null; email: string } | null
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'reviewing', label: 'Reviewing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'quoted', label: 'Quoted', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'accepted', label: 'Accepted', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { value: 'declined', label: 'Declined', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'expired', label: 'Expired', color: 'bg-gray-100 text-gray-800 border-gray-200' },
]

const statusColor = (s: string) => statusOptions.find(o => o.value === s)?.color || 'bg-gray-100 text-gray-800'

export default function QuoteDetailClient() {
  const { id } = useParams()
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'reply'>('details')

  // Reply form state
  const [replyStatus, setReplyStatus] = useState('')
  const [totalQuote, setTotalQuote] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [itemPrices, setItemPrices] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/api/admin/quotes/${id}`)
      .then(r => r.json())
      .then(data => {
        setQuote(data)
        setReplyStatus(data.status)
        setTotalQuote(data.quotedPrice || '')
        setAdminNotes(data.adminNotes || '')
        setExpiresAt(data.expiresAt ? new Date(data.expiresAt).toISOString().slice(0, 10) : '')
        const prices: Record<string, string> = {}
        data.items.forEach((item: QuoteItem) => {
          prices[item.id] = item.unitPrice || ''
        })
        setItemPrices(prices)
        setLoading(false)
      })
  }, [id])

  const handleSaveReply = async () => {
    setSaving(true)
    const total = parseFloat(totalQuote)
    const res = await fetch(`/api/admin/quotes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: replyStatus,
        quotedPrice: isNaN(total) ? undefined : total,
        expiresAt: expiresAt || undefined,
        adminNotes: adminNotes || undefined,
        items: Object.entries(itemPrices).map(([itemId, price]) => ({
          id: itemId,
          unitPrice: parseFloat(price) || undefined,
        })),
      }),
    })

    if (res.ok) {
      const updated = await res.json()
      setQuote(updated)
      setActiveTab('details')
      alert('Quote updated successfully!')
    } else {
      alert('Failed to update quote')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>Quote not found</p>
        <Link href="/admin/quotes" className="text-brand-600 hover:underline mt-2 inline-block">Back to quotes</Link>
      </div>
    )
  }

  const subtotal = quote.items.reduce((sum, item) => {
    const price = parseFloat(itemPrices[item.id]) || 0
    return sum + price * item.quantity
  }, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/quotes" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quote #{quote.quoteNumber}</h1>
            <p className="text-sm text-gray-500">
              Received {new Date(quote.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${statusColor(quote.status)}`}>
          {quote.status}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'details' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('reply')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'reply' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Reply & Quote
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Requested Items ({quote.items.length})</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {quote.items.map(item => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images[0] ? (
                        <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">SKU: {item.product.sku}</p>
                      <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                      {item.notes && <p className="text-xs text-gray-400 mt-1">Note: {item.notes}</p>}
                    </div>
                    {itemPrices[item.id] && (
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${parseFloat(itemPrices[item.id]).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">per unit</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {subtotal > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Quote</span>
                    <span className="text-xl font-bold text-brand-700">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Message */}
            {quote.message && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Customer Message</h2>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{quote.message}</p>
              </div>
            )}

            {/* Admin Notes */}
            {quote.adminNotes && (
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                <h2 className="font-semibold text-amber-800 mb-3">Admin Notes</h2>
                <p className="text-amber-900 text-sm whitespace-pre-wrap">{quote.adminNotes}</p>
              </div>
            )}
          </div>

          {/* Right: Customer & Status */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Customer Info</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Name</p>
                  <p className="font-medium text-gray-900">{quote.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <a href={`mailto:${quote.customerEmail}`} className="text-brand-600 hover:underline">{quote.customerEmail}</a>
                </div>
                {quote.customerCompany && (
                  <div>
                    <p className="text-gray-500 text-xs">Company</p>
                    <p className="font-medium text-gray-900">{quote.customerCompany}</p>
                  </div>
                )}
                {quote.customerPhone && (
                  <div>
                    <p className="text-gray-500 text-xs">Phone</p>
                    <p className="font-medium text-gray-900">{quote.customerPhone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Current Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
                {quote.quotedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quoted At</span>
                    <span className="text-gray-900">{new Date(quote.quotedAt).toLocaleDateString()}</span>
                  </div>
                )}
                {quote.expiresAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expires</span>
                    <span className="text-gray-900">{new Date(quote.expiresAt).toLocaleDateString()}</span>
                  </div>
                )}
                {quote.quotedPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quoted Price</span>
                    <span className="font-bold text-brand-700">${parseFloat(quote.quotedPrice).toFixed(2)}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveTab('reply')}
                className="mt-4 w-full bg-brand-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
              >
                Edit Reply
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Reply & Quote Tab */
        <div className="max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Status */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-3">Update Status</h2>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setReplyStatus(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${replyStatus === opt.value ? opt.color + ' border-current' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Item Pricing */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-3">Item Pricing</h2>
              <div className="space-y-3">
                {quote.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1 w-40">
                      <span className="text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={itemPrices[item.id]}
                        onChange={e => setItemPrices(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                      <span className="text-gray-500 text-sm">/ unit</span>
                    </div>
                  </div>
                ))}
              </div>
              {subtotal > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Calculated Total</span>
                  <span className="text-xl font-bold text-brand-700">${subtotal.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Quote Summary */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-3">Quote Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Total Quote Price</label>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Override calculated total"
                      value={totalQuote}
                      onChange={e => setTotalQuote(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Leave blank to auto-calculate from items</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Quote Valid Until</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={e => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-3">Admin Notes</h2>
              <textarea
                rows={3}
                placeholder="Internal notes (not visible to customer)..."
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Actions */}
            <div className="px-6 py-4 flex gap-3">
              <button
                onClick={() => setActiveTab('details')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReply}
                disabled={saving}
                className="flex-1 bg-brand-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-brand-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Quote Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
