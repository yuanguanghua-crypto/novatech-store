'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
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

interface BrandDetailClientProps {
  brand: { id: string; name: string; slug: string; country?: string | null }
  products: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  currentSort?: string
}

export function BrandDetailClient({
  brand,
  products,
  total,
  page,
  pageSize,
  totalPages,
  currentSort,
}: BrandDetailClientProps) {
  const { t } = useI18n()

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-700">{t.product_home}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-brand-700">{t.product_products}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium">{brand.name}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t.brands_products.replace('{count}', total.toLocaleString())}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">{t.brands_no_products}</p>
          <Link href="/products" className="text-brand-600 hover:text-brand-800 mt-2 inline-block">
            {t.brands_browse_all}
          </Link>
        </div>
      ) : (
        <>
          <SortBar total={total} page={page} pageSize={pageSize} currentSort={currentSort} />
          <ProductGrid products={products} />
          <Pagination page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  )
}
