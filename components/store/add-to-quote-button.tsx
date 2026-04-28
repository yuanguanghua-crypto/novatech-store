'use client'

import { FileText, Check } from 'lucide-react'
import { useQuoteStore } from '@/hooks/use-quote'
import { useI18n } from '@/lib/i18n/context'
import { useState } from 'react'

interface AddToQuoteButtonProps {
  productId: string
  sku: string
  name: string
}

export function AddToQuoteButton({ productId, sku, name }: AddToQuoteButtonProps) {
  const { addItem } = useQuoteStore()
  const { t } = useI18n()
  const [added, setAdded] = useState(false)

  const handle = () => {
    addItem({ productId, sku, name, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handle}
      className={`flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg font-semibold text-sm border-2 transition-all duration-200 ${
        added
          ? 'bg-green-50 border-green-500 text-green-700'
          : 'border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-[0.98]'
      }`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          {t.cart_item_added}
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          {t.products_request_quote}
        </>
      )}
    </button>
  )
}
