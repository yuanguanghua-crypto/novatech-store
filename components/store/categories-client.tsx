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
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t.categories_title}</h1>
        <p className="mt-2 text-gray-600">
          {t.categories_subtitle.replace('{count}', categories.length.toString())}
        </p>
      </div>

      <div className="space-y-10">
        {/* 有子分类的顶级分类 */}
        {categories.filter(c => c.children.length > 0).map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getCategoryName(cat.name, lang)}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {t.categories_products_count.replace('{count}', getTotalProducts(cat).toLocaleString())}
                </p>
              </div>
              <Link
                href={`/categories/${cat.slug}`}
                className="text-sm font-medium text-brand-700 hover:text-brand-800"
              >
                {t.categories_view_all}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {cat.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/categories/${child.slug}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-sm transition-all group"
                >
                  <div className="text-sm font-medium text-gray-800 group-hover:text-brand-700 leading-snug">
                    {getCategoryName(child.name, lang)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t.categories_products_count.replace('{count}', (child._count?.products?.toLocaleString() || '0'))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* 无子分类的独立分类 */}
        {categories.filter(c => c.children.length === 0).length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.categories_other}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {categories.filter(c => c.children.length === 0).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-sm transition-all group"
                >
                  <div className="text-sm font-medium text-gray-800 group-hover:text-brand-700 leading-snug">
                    {getCategoryName(cat.name, lang)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t.categories_products_count.replace('{count}', cat._count.products.toLocaleString())}
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
