'use client'

import { useCartStore } from '@/hooks/use-cart'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const cartTotal = total()
  const { t } = useI18n()

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.cart_empty}</h1>
        <p className="text-gray-500 mb-8">{t.cart_empty_desc}</p>
        <Link href="/products" className="btn-primary px-8 py-3">
          {t.cart_browse_products}
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t.cart_items_count.replace('{count}', items.length.toString())}
        </h1>
        <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-700">
          {t.cart_clear}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
              {/* Image */}
              <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productId}`} className="text-sm font-medium text-gray-800 hover:text-brand-700 line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">{t.cart_sku_label} {item.sku}</p>
                <p className="text-sm font-semibold text-brand-700 mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity & Remove */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-gray-400 hover:text-red-600"
                  aria-label={t.cart_remove}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t.cart_order_summary}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.cart_subtotal}</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.cart_shipping}</span>
                <span className="text-green-600">{t.cart_shipping_free}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.cart_tax}</span>
                <span className="font-medium">{t.cart_tax_at_checkout}</span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between">
                <span className="font-bold text-gray-900">{t.cart_total}</span>
                <span className="font-bold text-brand-700">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {t.cart_checkout} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/quote" className="btn-outline w-full flex items-center justify-center gap-2 py-3 text-sm">
                {t.cart_request_quote}
              </Link>
              <Link href="/products" className="block text-center text-sm text-gray-500 hover:text-brand-700 mt-2">
                {t.cart_continue_shopping}
              </Link>
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded text-xs text-green-700">
              {t.cart_free_shipping_hint}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
