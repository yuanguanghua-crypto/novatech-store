'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'payment_pending', label: 'Payment Pending', color: 'bg-orange-100 text-orange-800' },
  { value: 'paid', label: 'Paid', color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: 'Processing', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
]

const PAYMENT_STATUS_OPTIONS = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'paid', label: 'Paid' },
  { value: 'refunded', label: 'Refunded' },
]

interface OrderItem {
  id: string
  sku: string
  name: string
  quantity: number
  unitPrice: string
  total: string
  imageUrl?: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod?: string
  shippingMethod?: string
  trackingNumber?: string
  subtotal: string
  shippingCost: string
  taxAmount: string
  total: string
  currency: string
  customerName: string
  customerEmail: string
  customerCompany?: string
  shippingAddress: any
  createdAt: string
  shippedAt?: string
  deliveredAt?: string
  notes?: string
  items: OrderItem[]
  user?: { name?: string; email: string }
}

interface Props {
  order: Order
}

export function OrderDetailClient({ order }: Props) {
  const [status, setStatus] = useState(order.status)
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '')
  const [shippingMethod, setShippingMethod] = useState(order.shippingMethod || '')
  const [notes, setNotes] = useState(order.notes || '')
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [trackingSaved, setTrackingSaved] = useState(false)

  const currentStatusColor = STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-100'

  async function updateStatus(newStatus: string) {
    if (newStatus === status) return
    setUpdating(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus(newStatus)
        setMessage({ type: 'success', text: `Status updated to "${STATUS_OPTIONS.find(s => s.value === newStatus)?.label}"` })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Update failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' })
    } finally {
      setUpdating(false)
    }
  }

  async function updateTracking() {
    setUpdating(true)
    setTrackingSaved(false)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber, shippingMethod, notes }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: 'Shipping info saved' })
        setTrackingSaved(true)
        setTimeout(() => { setMessage(null); setTrackingSaved(false) }, 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Save failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' })
    } finally {
      setUpdating(false)
    }
  }

  const address = order.shippingAddress as any

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          ← Back to Orders
        </Link>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Items ({order.items.length})</h2>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-14 h-14 object-cover rounded-lg" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.quantity} × {formatPrice(item.unitPrice)}</p>
                    <p className="text-xs text-gray-500">{formatPrice(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-brand-700">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className={''}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tracking Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. 1Z999AA10123456784"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Shipping Method</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={shippingMethod}
                  onChange={e => setShippingMethod(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="ups_ground">UPS Ground</option>
                  <option value="ups_express">UPS Express</option>
                  <option value="fedex_ground">FedEx Ground</option>
                  <option value="fedex_express">FedEx Express</option>
                  <option value="usps">USPS</option>
                  <option value="dhl">DHL</option>
                  <option value="freight">Freight</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Admin Notes</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                rows={2}
                placeholder="Internal notes (not visible to customer)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
            <button
              onClick={updateTracking}
              disabled={updating}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 disabled:opacity-50"
            >
              {updating ? 'Saving...' : 'Save Shipping Info'}
            </button>

            {order.trackingNumber && (
              <p className="text-xs text-gray-500 mt-2">
                Shipped: {order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : 'N/A'}
                {order.deliveredAt && ` | Delivered: ${new Date(order.deliveredAt).toLocaleDateString()}`}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
            <div className="space-y-1">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateStatus(opt.value)}
                  disabled={updating || status === opt.value}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    status === opt.value
                      ? `${opt.color} font-medium`
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <span>{opt.label}</span>
                  {status === opt.value && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Payment Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={paymentStatus}
                  onChange={async e => {
                    const val = e.target.value
                    setPaymentStatus(val)
                    await fetch(`/api/admin/orders/${order.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ paymentStatus: val }),
                    })
                  }}
                >
                  {PAYMENT_STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {order.paymentMethod && (
                <div className="text-xs text-gray-500">
                  Method: <span className="text-gray-700 capitalize">{order.paymentMethod}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>{' '}
                <span className="text-gray-800">{order.customerName}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>{' '}
                <a href={`mailto:${order.customerEmail}`} className="text-brand-700 hover:underline">
                  {order.customerEmail}
                </a>
              </div>
              {order.customerCompany && (
                <div>
                  <span className="text-gray-500">Company:</span>{' '}
                  <span className="text-gray-800">{order.customerCompany}</span>
                </div>
              )}
              {order.user && (
                <div className="pt-1 border-t text-xs text-gray-400">
                  Registered user: {order.user.name || order.user.email}
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {address && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-sm text-gray-700 space-y-0.5">
                {address.firstName && <p className="font-medium">{address.firstName} {address.lastName}</p>}
                {address.company && <p className="text-gray-500">{address.company}</p>}
                <p>{address.address1}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>{address.city}{address.state ? `, ${address.state}` : ''} {address.postalCode}</p>
                <p>{address.country}</p>
                {address.phone && <p className="text-gray-500 pt-1">{address.phone}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
