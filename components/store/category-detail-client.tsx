'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { ProductGrid } from '@/components/store/product-grid'
import { SortSelector } from '@/components/store/sort-selector'

interface Product {
  id: string
  name: string
  slug: string
  sku: string
  ourPrice: any
  isFeatured: boolean
  availability: string
  images: { url: string; isPrimary: boolean }[]
  brand: { name: string; slug: string } | null
}

interface SubCategory {
  id: string
  name: string
  slug: string
  _count?: { products: number }
}

interface CategoryDetailClientProps {
  category: {
    id: string
    name: string
    slug: string
    children: SubCategory[]
    parent?: { id: string; name: string; slug: string } | null
    _count?: { products: number }
  }
  products?: Product[]
  total?: number
  pageNum?: number
  totalPages?: number
  sort?: string
  slug: string
  isParent: boolean
}

export function CategoryDetailClient({
  category,
  products = [],
  total = 0,
  pageNum = 1,
  totalPages = 1,
  sort = 'featured',
  slug,
  isParent,
}: CategoryDetailClientProps) {
  const { t } = useI18n()

  if (isParent) {
    return (
      <div className="container py-8">
        {category.parent && (
          <nav className="mb-4 text-sm text-gray-500">
            <Link href="/categories" className="hover:text-brand-700">{t.categories_all_label}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{category.parent.name}</span>
          </nav>
        )}

        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="mt-1 text-gray-600">
            {t.categories_subcategories.replace('{count}', category.children.length.toString())}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/categories/${child.slug}`}
              className="p-5 border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-md transition-all group"
            >
              <div className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 leading-snug mb-2">
                {child.name}
              </div>
              <div className="text-xs text-gray-500">
                {t.categories_products_count.replace('{count}', (child._count?.products?.toLocaleString() || '0'))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/categories" className="hover:text-brand-700">{t.categories_all_label}</Link>
        {category.parent && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/categories/${category.parent.slug}`} className="hover:text-brand-700">
              {category.parent.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-800">{category.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {t.categories_products_count.replace('{count}', total.toLocaleString())}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SortSelector current={sort} />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">{t.categories_no_products}</p>
          <Link href="/products" className="mt-4 inline-block text-brand-700 hover:underline">
            {t.categories_browse_all}
          </Link>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {pageNum > 1 && (
                <Link
                  href={`/categories/${slug}?sort=${sort}&page=${pageNum - 1}`}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  {t.categories_prev}
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-600">
                {t.categories_page_of
                  .replace('{page}', pageNum.toString())
                  .replace('{total}', totalPages.toString())}
              </span>
              {pageNum < totalPages && (
                <Link
                  href={`/categories/${slug}?sort=${sort}&page=${pageNum + 1}`}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  {t.categories_next}
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
