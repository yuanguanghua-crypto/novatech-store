'use client'

import { useState } from 'react'
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

interface CategoryProfile {
  definition: string
  howItWorks: string
  keyParameters: { name: string; unit: string; description: string }[]
  industries: string[]
  topBrands: string[]
  selectionTips: string[]
  commonApplications: string[]
  relatedKnowledge: string
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
  categoryProfile?: CategoryProfile
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
  categoryProfile
}: CategoryDetailClientProps) {
  const { t } = useI18n()
  const [showKnowledge, setShowKnowledge] = useState(true)

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
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
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

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {t.categories_products_count.replace('{count}', total.toLocaleString())}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SortSelector current={sort} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Knowledge Section */}
      {categoryProfile && (
        <section className="bg-gradient-to-r from-brand-50 to-cyan-50 border-b">
          <div className="container py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">About {category.name}</h2>
              <button
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="text-sm text-brand-600 hover:underline"
              >
                {showKnowledge ? 'Hide details' : 'Show details'}
              </button>
            </div>

            {showKnowledge && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">What is {category.name}?</h3>
                    <p className="text-sm text-gray-600">{categoryProfile.definition}</p>
                  </div>
                  <div className="bg-white rounded-lg p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
                    <p className="text-sm text-gray-600">{categoryProfile.howItWorks}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Key Selection Parameters</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categoryProfile.keyParameters.map((param, idx) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{param.name}</div>
                        <div className="text-sm font-semibold text-brand-700">{param.unit}</div>
                        <div className="text-xs text-gray-600 mt-1">{param.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Common Industries</h3>
                    <div className="flex flex-wrap gap-2">
                      {categoryProfile.industries.map((industry, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white rounded-full text-xs text-gray-700 border">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Applications</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {categoryProfile.commonApplications.slice(0, 4).map((app, idx) => (
                        <li key={idx}>• {app}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {categoryProfile.selectionTips.length > 0 && (
                  <div className="bg-white rounded-lg p-5">
                    <h3 className="font-semibold text-gray-900 mb-3">Selection Tips</h3>
                    <ul className="space-y-2">
                      {categoryProfile.selectionTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-brand-500 mt-0.5">💡</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={categoryProfile.relatedKnowledge}
                  className="inline-flex items-center gap-2 text-brand-700 hover:text-brand-800 font-medium"
                >
                  Learn more about {category.name} →</Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Products Section */}
      <div className="container py-8">
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
    </div>
  )
}
