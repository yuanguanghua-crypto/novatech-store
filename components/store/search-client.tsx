'use client'

import Link from 'next/link'
import { Search as SearchIcon } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { ProductGrid } from '@/components/store/product-grid'
import { SortBar } from '@/components/store/sort-bar'
import { Pagination } from '@/components/store/pagination'

interface Product {
  id: string
  name: string
  slug: string
  sku: string
  ourPrice: any
  isFeatured: boolean
  availability: string
  images: { url: string; isPrimary: boolean }[]
  category?: { name: string; slug: string } | null
  brand: { name: string; slug: string } | null
}

interface SearchClientProps {
  q: string
  products: Product[]
  total: number
  page: number
  totalPages: number
  currentSort?: string
  PAGE_SIZE: number
}

export function SearchClient({
  q,
  products,
  total,
  page,
  totalPages,
  currentSort,
  PAGE_SIZE,
}: SearchClientProps) {
  const { t } = useI18n()

  if (!q) {
    return (
      <div className="container py-16 text-center">
        <SearchIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.search_title}</h1>
        <p style={{ color: 'var(--text-tertiary)' }}>{t.search_placeholder_hint}</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {t.search_results_for.replace('{query}', q)}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          {t.search_results_count.replace('{count}', total.toLocaleString())}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <SearchIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <p className="mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {t.search_no_results.replace('{query}', q)}
          </p>
          <Link href="/products" className="text-brand-600 hover:text-brand-800 font-medium">
            {t.search_browse_all}
          </Link>
        </div>
      ) : (
        <>
          <SortBar total={total} page={page} pageSize={PAGE_SIZE} currentSort={currentSort} />
          <ProductGrid products={products} />
          <Pagination page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  )
}
