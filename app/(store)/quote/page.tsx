'use client'

import { useState } from 'react'
import { useCartStore } from '@/hooks/use-cart'
import { useQuoteStore } from '@/hooks/use-quote'
import Link from 'next/link'
import { Send, Plus, Trash2, CheckCircle, ShoppingCart } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function QuotePage() {
  const cartItems = useCartStore(s => s.items)
  const quoteItems = useQuoteStore(s => s.items)
  const addToQuote = useQuoteStore(s => s.addItem)
  const removeFromQuote = useQuoteStore(s => s.removeItem)
  const updateQuoteItem = useQuoteStore(s => s.updateItem)
  const clearQuote = useQuoteStore(s => s.clearQuote)
  const { t } = useI18n()

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerCompany: '',
    customerPhone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [quoteNumber, setQuoteNumber] = useState('')

  const canSubmit = formData.customerName && formData.customerEmail && (quoteItems.length > 0 || cartItems.length > 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || submitting) return

    setSubmitting(true)
    setError('')

    const items = quoteItems.length > 0 ? quoteItems : cartItems.map(c => ({
      productId: c.productId,
      sku: c.sku,
      name: c.name,
      quantity: c.quantity,
    }))

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, items }),
      })

      if (res.ok) {
        const data = await res.json()
        setQuoteNumber(data.quoteNumber)
        setSubmitted(true)
        clearQuote()
        useCartStore.getState().clearCart()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to submit quote')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="container py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.quote_submitted_title}</h1>
        <p className="text-gray-500 mb-2">{t.quote_number_label} <strong>{quoteNumber}</strong></p>
        <p className="text-gray-500 mb-8">{t.quote_within_24h}</p>
        <Link href="/products" className="btn-primary px-8 py-3">
          {t.cart_continue_shopping}
        </Link>
      </div>
    )
  }

  const hasItems = quoteItems.length > 0 || cartItems.length > 0

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.quote_title}</h1>
        <p className="text-gray-500 mt-1">{t.quote_subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.quote_contact_info}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.quote_full_name_required}</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder={t.placeholder_name_example}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.quote_email_required}</label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder={t.placeholder_email_example}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.quote_company_optional}</label>
                <input
                  type="text"
                  value={formData.customerCompany}
                  onChange={e => setFormData({ ...formData, customerCompany: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder={t.placeholder_company_example}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.quote_phone_optional}</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.quote_notes}</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Shipping address, special requirements, etc."
              />
            </div>
          </div>

          {/* Quote Items from Cart */}
          {cartItems.length > 0 && quoteItems.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t.quote_cart_items.replace('{count}', cartItems.length.toString())}
                </h2>
                <button type="button" onClick={() => {
                  cartItems.forEach(item => addToQuote({
                    productId: item.productId,
                    sku: item.sku,
                    name: item.name,
                    quantity: item.quantity,
                  }))
                }} className="text-sm text-brand-700 hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> {t.quote_add_all}
                </button>
              </div>
              <div className="space-y-2">
                {cartItems.map(item => (
                  <div key={item.productId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={quoteItems.some(q => q.productId === item.productId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addToQuote({ productId: item.productId, sku: item.sku, name: item.name, quantity: item.quantity })
                          } else {
                            removeFromQuote(item.productId)
                          }
                        }}
                        className="w-4 h-4 text-brand-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{t.cart_sku_label} {item.sku}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {quoteItems.length > 0 && (
                <p className="text-sm text-brand-700 mt-3 font-medium">
                  {t.quote_items_selected.replace('{count}', quoteItems.length.toString())}
                </p>
              )}
            </div>
          )}

          {/* Quote Items */}
          {quoteItems.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t.quote_items_for.replace('{count}', quoteItems.length.toString())}
              </h2>
              <div className="space-y-3">
                {quoteItems.map(item => (
                  <div key={item.productId} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{t.cart_sku_label} {item.sku}</p>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => updateQuoteItem(item.productId, { quantity: parseInt(e.target.value) || 1 })}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromQuote(item.productId)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No items */}
          {!hasItems && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-4">{t.quote_no_items}</p>
              <Link href="/products" className="btn-primary px-6 py-2.5">
                {t.quote_browse_products}
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t.quote_sidebar_title}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.quote_items_label}</span>
                <span className="font-medium">{(quoteItems.length || cartItems.length).toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.quote_response_time}</span>
                <span className="text-green-600">{t.quote_response_value}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="mt-6 w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>{t.quote_submitting}</>
              ) : (
                <><Send className="w-4 h-4" /> {t.quote_submit}</>
              )}
            </button>

            {!canSubmit && (
              <p className="text-xs text-gray-400 mt-2 text-center">
                {!formData.customerName || !formData.customerEmail
                  ? t.quote_fill_required
                  : t.quote_select_product}
              </p>
            )}

            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
              {t.quote_review_msg}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
