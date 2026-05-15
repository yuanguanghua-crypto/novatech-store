'use client'

import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'

export function SortSelector({ current }: { current?: string }) {
  const router = useRouter()
  const { t } = useI18n()

  return (
    <select
      value={current || 'featured'}
      onChange={(e) => {
        const params = new URLSearchParams(window.location.search)
        params.set('sort', e.target.value)
        params.delete('page')
        router.push(`/products?${params.toString()}`)
      }}
      className="text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
      style={{ border: '1px solid var(--surface-300)', color: 'var(--text-primary)', backgroundColor: '#FFFFFF' }}
    >
      <option value="featured">{t.products_sort_featured}</option>
      <option value="newest">{t.products_sort_newest}</option>
      <option value="price_asc">{t.products_sort_price_asc}</option>
      <option value="price_desc">{t.products_sort_price_desc}</option>
    </select>
  )
}
