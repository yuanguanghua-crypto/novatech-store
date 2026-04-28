'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import { getCategoryName } from '@/lib/i18n/category-translations'

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
  children: {
    id: string
    name: string
    slug: string
    _count?: { products: number }
  }[]
}

interface CategoriesClientProps {
  categories: Category[]
}

function getTotalProducts(cat: Category) {
  const direct = cat._count.products
  const children = cat.children.reduce((sum, c) => sum + (c._count?.products || 0), 0)
  return direct + children
}

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const { t, locale } = useI18n()
  const lang = locale as string

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-display">{t.categories_title}</h1>
        <p className="mt-2 text-gray-600">
          {t.categories_subtitle.replace('{count}', categories.length.toString())}
        </p>
      </div>

      <div className="space-y-12">
        {/* Parent categories with children */}
        {categories.filter(c => c.children.length > 0).map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-display">{getCategoryName(cat.name, lang)}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {t.categories_products_count.replace('{count}', getTotalProducts(cat).toLocaleString())} products
                </p>
              </div>
              <Link
                href={`/categories/${cat.slug}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {t.categories_view_all} →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {cat.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/categories/${child.slug}`}
                  className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
                >
                  <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 leading-snug">
                    {getCategoryName(child.name, lang)}
                  </div>
                  <div className="text-xs text-gray-400 mt-2 font-mono">
                    {child._count?.products?.toLocaleString() || '0'} products
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Standalone categories without children */}
        {categories.filter(c => c.children.length === 0).length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">{t.categories_other}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {categories.filter(c => c.children.length === 0).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
                >
                  <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 leading-snug">
                    {getCategoryName(cat.name, lang)}
                  </div>
                  <div className="text-xs text-gray-400 mt-2 font-mono">
                    {cat._count.products.toLocaleString()} products
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
