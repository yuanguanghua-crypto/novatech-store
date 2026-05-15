'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import { ProductGrid } from '@/components/store/product-grid'
import { SortSelector } from '@/components/store/sort-selector'
import { ProductFilters } from '@/components/store/product-filters'
import { useI18n } from '@/lib/i18n/context'

interface Product {
  id: string
  slug: string
  sku: string
  name: string
  ourPrice: any
  availability: string
  brand: { name: string; slug: string } | null
  images: { url: string }[]
}

interface ProductsClientProps {
  products: Product[]
  total: number
  page: number
  pageSize: number
  searchParams: Record<string, string | undefined>
}

function Pagination({ page, totalPages, searchParams }: { page: number; totalPages: number; searchParams: Record<string, string | undefined> }) {
  const { t } = useI18n()
  const buildUrl = (p: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    params.set('page', String(p))
    return `/products?${params.toString()}`
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {page > 1 && (
        <a
          href={buildUrl(page - 1)}
          className="btn-secondary px-4 py-2 text-sm"
          style={{ borderColor: '#E2E8F0', color: '#1F2A44' }}
        >
          {t.products_prev}
        </a>
      )}
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        const p = page <= 4 ? i + 1 : page - 3 + i
        if (p < 1 || p > totalPages) return null
        return (
          <a
            key={p}
            href={buildUrl(p)}
            className="px-3 py-2 text-sm rounded-lg transition-all duration-200"
            style={{
              backgroundColor: p === page ? '#0F4C81' : 'white',
              color: p === page ? 'white' : '#1F2A44',
              border: p === page ? 'none' : '1px solid #E2E8F0',
            }}
          >
            {p}
          </a>
        )
      })}
      {page < totalPages && (
        <a
          href={buildUrl(page + 1)}
          className="btn-secondary px-4 py-2 text-sm"
          style={{ borderColor: '#E2E8F0', color: '#1F2A44' }}
        >
          {t.products_next}
        </a>
      )}
    </div>
  )
}

export function ProductsClient({ products, total, page, pageSize, searchParams }: ProductsClientProps) {
  const { t } = useI18n()
  const totalPages = Math.ceil(total / pageSize)
  const start = Math.min((page - 1) * pageSize + 1, total)
  const end = Math.min(page * pageSize, total)

  return (
    <div className="container py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display" style={{ color: '#1F2A44' }}>
          {t.products_page_title}
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          {t.products_results_count.replace('{count}', total.toLocaleString())}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters (280px) */}
        <aside className="hidden lg:block w-70 flex-shrink-0" style={{ width: '280px' }}>
          <ProductFilters searchParams={searchParams} />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid #E2E8F0' }}>
            <p className="text-sm" style={{ color: '#64748B' }}>
              {t.products_showing_range
                .replace('{start}', start.toLocaleString())
                .replace('{end}', end.toLocaleString())
                .replace('{total}', total.toLocaleString())}
            </p>
            <SortSelector current={searchParams.sort} />
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#CBD5E1' }} />
              <p className="text-lg font-medium" style={{ color: '#1F2A44' }}>{t.products_no_results}</p>
              <p className="text-sm mt-1" style={{ color: '#64748B' }}>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} searchParams={searchParams} />
          )}
        </div>
      </div>
    </div>
  )
}
