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
        <h1 className="text-3xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{t.categories_title}</h1>
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
          {t.categories_subtitle.replace('{count}', categories.length.toString())}
        </p>
      </div>

      <div className="space-y-12">
        {/* Parent categories with children */}
        {categories.filter(c => c.children.length > 0).map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{getCategoryName(cat.name, lang)}</h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {t.categories_products_count.replace('{count}', getTotalProducts(cat).toLocaleString())} products
                </p>
              </div>
              <Link
                href={`/categories/${cat.slug}`}
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--brand-600)' }}
              >
                {t.categories_view_all} →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {cat.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/categories/${child.slug}`}
                  className="p-4 bg-white rounded-xl transition-all duration-200 hover:-translate-y-1 group"
                  style={{ border: '1px solid var(--surface-200)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-300)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,76,129,0.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--surface-200)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {getCategoryName(child.name, lang)}
                  </div>
                  <div className="text-xs mt-2 font-mono" style={{ color: 'var(--text-tertiary)' }}>
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
            <h2 className="text-xl font-bold mb-4 font-display" style={{ color: 'var(--text-primary)' }}>{t.categories_other}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {categories.filter(c => c.children.length === 0).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="p-4 bg-white rounded-xl transition-all duration-200 hover:-translate-y-1 group"
                  style={{ border: '1px solid var(--surface-200)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-300)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,76,129,0.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--surface-200)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {getCategoryName(cat.name, lang)}
                  </div>
                  <div className="text-xs mt-2 font-mono" style={{ color: 'var(--text-tertiary)' }}>
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
