'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/hooks/use-cart'
import { useI18n } from '@/lib/i18n/context'
import { useState } from 'react'

interface AddToCartButtonProps {
  productId: string
  sku: string
  name: string
  price: number
  imageUrl?: string
}

export function AddToCartButton({ productId, sku, name, price, imageUrl }: AddToCartButtonProps) {
  const { addItem } = useCartStore()
  const { t } = useI18n()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({ productId, sku, name, price, imageUrl, quantity: qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex items-center border border-gray-300 rounded-md">
        <button
          onClick={() => setQty(q => Math.max(1, q - 1))}
          className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 text-lg font-medium"
        >
          −
        </button>
        <span className="px-4 py-2.5 text-sm font-medium min-w-[40px] text-center">{qty}</span>
        <button
          onClick={() => setQty(q => q + 1)}
          className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 text-lg font-medium"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAdd}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-6 rounded-md font-medium text-sm transition-colors ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-brand-700 text-white hover:bg-brand-800'
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        {added ? t.cart_item_added : t.products_add_to_cart}
      </button>
    </div>
  )
}
