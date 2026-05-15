'use client'

import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/hooks/use-cart'
import { useI18n } from '@/lib/i18n/context'
import { useToast } from '@/components/store/toast'
import { useState } from 'react'

interface AddToCartButtonProps {
  productId: string
  sku: string
  name: string
  price: number | string | null | undefined
  imageUrl?: string
}

export function AddToCartButton({ productId, sku, name, price, imageUrl }: AddToCartButtonProps) {
  const { addItem } = useCartStore()
  const { t } = useI18n()
  const { showToast } = useToast()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  // Safe price parsing — handle Prisma Decimal, string, null, undefined
  const safePrice = typeof price === 'number' ? price
    : typeof price === 'string' ? parseFloat(price) || 0
    : 0

  const handleAdd = () => {
    if (safePrice <= 0) {
      showToast('Please request a quote for this item', 'error')
      return
    }
    addItem({ productId, sku, name, price: safePrice, imageUrl, quantity: qty })
    setAdded(true)
    showToast(`${name} (${sku}) — ${t.cart_item_added}`, 'success')
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 flex-1">
      {/* Quantity Selector */}
      <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setQty(q => Math.max(1, q - 1))}
          className="px-3 py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-lg font-medium transition-colors"
        >
          −
        </button>
        <span className="px-4 py-2.5 text-sm font-semibold min-w-[48px] text-center border-x-2 border-gray-100">
          {qty}
        </span>
        <button
          onClick={() => setQty(q => q + 1)}
          className="px-3 py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-lg font-medium transition-colors"
        >
          +
        </button>
      </div>
      
      {/* Add to Cart Button */}
      <button
        onClick={handleAdd}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
          added
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            {t.cart_item_added}
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            {t.products_add_to_cart}
          </>
        )}
      </button>
    </div>
  )
}
