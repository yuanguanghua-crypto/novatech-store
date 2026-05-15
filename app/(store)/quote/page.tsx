'use client'

import { useState } from 'react'
import { useCartStore } from '@/hooks/use-cart'
import { useQuoteStore } from '@/hooks/use-quote'
import Link from 'next/link'
import { Send, Plus, Trash2, CheckCircle, ShoppingCart, Clock, Package, FileCheck, HelpCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

// AEO: Quote page knowledge content
const quoteKnowledgeContent = {
  whenNeedQuote: [
    { title: 'Bulk Orders', desc: 'Orders of 10+ units typically qualify for volume discounts' },
    { title: 'Industrial Projects', desc: 'Large-scale installations require specification verification' },
    { title: 'Custom Configurations', desc: 'Special interfaces, parameters, or non-standard options' },
    { title: 'International Shipping', desc: 'Export documentation, freight quotes, and customs handling' },
    { title: 'Contract Procurement', desc: 'Government, education, or corporate purchasing agreements' },
  ],
  processSteps: [
    { step: '1', title: 'Submit Request', desc: 'Select products and fill out the quote form' },
    { step: '2', title: 'Review', desc: 'Our sales team reviews your requirements within 24 hours' },
    { step: '3', title: 'Quote Generation', desc: 'Receive a detailed quotation with pricing and delivery' },
    { step: '4', title: 'Confirmation', desc: 'Approve the quote to proceed with your order' },
  ],
  deliveryTimes: [
    { category: 'Standard Products (Stock)', time: '3-7 business days' },
    { category: 'Brand Products (Require Sourcing)', time: '1-3 weeks' },
    { category: 'Large/Custom Orders', time: '2-4 weeks' },
    { category: 'International Shipments', time: '2-6 weeks' },
  ],
  faqs: [
    {
      q: 'What discounts are available for bulk orders?',
      a: 'Volume discounts typically start at 10+ units. Discount percentages vary by product category and quantity. Our sales team will provide specific pricing based on your requirements.'
    },
    {
      q: 'How long is the quote valid?',
      a: 'All quotes are valid for 30 days from the date of issue. After this period, prices may be subject to change due to market conditions or supplier updates.'
    },
    {
      q: 'Can I request expedited shipping?',
      a: 'Yes, expedited shipping options are available. Additional fees apply based on the shipping method and destination. Contact our sales team for specific options and pricing.'
    },
    {
      q: 'Do you accept purchase orders from organizations?',
      a: 'Yes, we accept purchase orders from verified businesses, educational institutions, and government agencies. Credit terms may be available subject to approval.'
    }
  ]
}

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
  const [showFaq, setShowFaq] = useState(false)

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
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.quote_submitted_title}</h1>
        <p className="mb-2" style={{ color: 'var(--text-tertiary)' }}>{t.quote_number_label} <strong>{quoteNumber}</strong></p>
        <p className="mb-8" style={{ color: 'var(--text-tertiary)' }}>{t.quote_within_24h}</p>
        <Link href="/products" className="btn-primary px-8 py-3">
          {t.cart_continue_shopping}
        </Link>
      </div>
    )
  }

  const hasItems = quoteItems.length > 0 || cartItems.length > 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-50)' }}>
      {/* AEO Knowledge Header */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-800 text-white">
        <div className="container py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.quote_title}</h1>
          <p className="text-brand-100 text-lg max-w-2xl">{t.quote_subtitle}</p>
        </div>
      </section>

      <div className="container py-8">
        {/* AEO: Knowledge Section */}
        <section className="mb-12 grid md:grid-cols-3 gap-6">
          {/* When You Need a Quote */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t.quote_when_need}</h2>
            </div>
            <ul className="space-y-3">
              {quoteKnowledgeContent.whenNeedQuote.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quote Process */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t.quote_process}</h2>
            </div>
            <div className="space-y-4">
              {quoteKnowledgeContent.processSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{step.title}</span>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Times */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t.quote_delivery}</h2>
            </div>
            <div className="space-y-3">
              {quoteKnowledgeContent.deliveryTimes.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 last:border-0" style={{ borderBottom: '1px solid var(--surface-100)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.category}</span>
                  <span className="text-sm font-medium text-brand-700">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Form Section */}
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t.quote_contact_info}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.quote_full_name_required}</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)' }}
                    placeholder={t.placeholder_name_example}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.quote_email_required}</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)' }}
                    placeholder={t.placeholder_email_example}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.quote_company_optional}</label>
                  <input
                    type="text"
                    value={formData.customerCompany}
                    onChange={e => setFormData({ ...formData, customerCompany: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)' }}
                    placeholder={t.placeholder_company_example}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.quote_phone_optional}</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)' }}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.quote_notes}</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)' }}
                  placeholder="Shipping address, special requirements, quantity needed, etc."
                />
              </div>
            </div>

            {/* Quote Items from Cart */}
            {cartItems.length > 0 && quoteItems.length === 0 && (
              <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
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
                    <div key={item.productId} className="flex items-center justify-between py-2 last:border-0" style={{ borderBottom: '1px solid var(--surface-100)' }}>
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
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t.cart_sku_label} {item.sku}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>${item.price.toFixed(2)}</span>
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
              <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {t.quote_items_for.replace('{count}', quoteItems.length.toString())}
                </h2>
                <div className="space-y-3">
                  {quoteItems.map(item => (
                    <div key={item.productId} className="flex items-center gap-3 py-2 last:border-0" style={{ borderBottom: '1px solid var(--surface-100)' }}>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t.cart_sku_label} {item.sku}</p>
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => updateQuoteItem(item.productId, { quantity: parseInt(e.target.value) || 1 })}
                        className="w-16 rounded px-2 py-1 text-sm text-center"
                        style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeFromQuote(item.productId)}
                        className="hover:text-red-600 p-1"
                        style={{ color: 'var(--text-tertiary)' }}
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
              <div className="rounded-xl p-8 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
                <ShoppingCart className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                <p className="mb-4" style={{ color: 'var(--text-tertiary)' }}>{t.quote_no_items}</p>
                <Link href="/products" className="btn-primary px-6 py-2.5">
                  {t.quote_browse_products}
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="rounded-xl p-6 sticky top-24" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.quote_sidebar_title}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>{t.quote_items_label}</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{(quoteItems.length || cartItems.length).toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>{t.quote_response_time}</span>
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
                <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-tertiary)' }}>
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

        {/* FAQ Section */}
        <section className="mt-12 rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--surface-200)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{t.quote_faq_title}</h2>
            <button
              onClick={() => setShowFaq(!showFaq)}
              className="text-sm text-brand-600 hover:underline"
            >
              {showFaq ? 'Hide FAQ' : 'Show FAQ'}
            </button>
          </div>
          {showFaq && (
            <div className="space-y-4">
              {quoteKnowledgeContent.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--surface-200)' }}>
                  <div className="px-4 py-3" style={{ backgroundColor: 'var(--surface-50)' }}>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{faq.q}</p>
                  </div>
                  <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
