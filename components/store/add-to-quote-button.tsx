'use client'

import { FileText } from 'lucide-react'
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
      className={`flex items-center justify-center gap-2 py-2.5 px-6 rounded-md font-medium text-sm border transition-colors ${
        added
          ? 'bg-green-50 border-green-500 text-green-700'
          : 'border-brand-700 text-brand-700 hover:bg-brand-50'
      }`}
    >
      <FileText className="w-4 h-4" />
      {added ? t.cart_item_added : t.products_request_quote}
    </button>
  )
}
