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
          <nav className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Link href="/categories" className="hover:underline" style={{ color: 'var(--brand-600)' }}>{t.categories_all_label}</Link>
            <span className="mx-2">/</span>
            <span style={{ color: 'var(--text-primary)' }}>{category.parent.name}</span>
          </nav>
        )}

        <div className="mb-2">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{category.name}</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            {t.categories_subcategories.replace('{count}', category.children.length.toString())}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/categories/${child.slug}`}
              className="p-5 rounded-lg transition-all group"
              style={{ border: '1px solid var(--surface-200)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-300)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,76,129,0.06)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--surface-200)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div className="text-sm font-semibold leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>
                {child.name}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {t.categories_products_count.replace('{count}', (child._count?.products?.toLocaleString() || '0'))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-50)' }}>
      {/* Category Header */}
      <div className="bg-white border-b" style={{ borderColor: 'var(--surface-200)' }}>
        <div className="container py-6">
          <nav className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Link href="/categories" className="hover:underline" style={{ color: 'var(--brand-600)' }}>{t.categories_all_label}</Link>
            {category.parent && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/categories/${category.parent.slug}`} className="hover:underline" style={{ color: 'var(--brand-600)' }}>
                  {category.parent.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span style={{ color: 'var(--text-primary)' }}>{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{category.name}</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
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
        <section className="border-b" style={{ background: 'linear-gradient(to right, var(--brand-50), var(--accent-50))', borderColor: 'var(--surface-200)' }}>
          <div className="container py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>About {category.name}</h2>
              <button
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="text-sm hover:underline"
                style={{ color: 'var(--brand-600)' }}
              >
                {showKnowledge ? 'Hide details' : 'Show details'}
              </button>
            </div>

            {showKnowledge && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-5">
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>What is {category.name}?</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{categoryProfile.definition}</p>
                  </div>
                  <div className="bg-white rounded-lg p-5">
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>How It Works</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{categoryProfile.howItWorks}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5">
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Key Selection Parameters</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categoryProfile.keyParameters.map((param, idx) => (
                      <div key={idx} className="rounded-lg p-3" style={{ border: '1px solid var(--surface-200)' }}>
                        <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{param.name}</div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--brand-700)' }}>{param.unit}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{param.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Common Industries</h3>
                    <div className="flex flex-wrap gap-2">
                      {categoryProfile.industries.map((industry, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white rounded-full text-xs" style={{ color: 'var(--text-primary)', border: '1px solid var(--surface-200)' }}>
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Applications</h3>
                    <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      {categoryProfile.commonApplications.slice(0, 4).map((app, idx) => (
                        <li key={idx}>• {app}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {categoryProfile.selectionTips.length > 0 && (
                  <div className="bg-white rounded-lg p-5">
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Selection Tips</h3>
                    <ul className="space-y-2">
                      {categoryProfile.selectionTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="mt-0.5" style={{ color: 'var(--accent-500)' }}>💡</span>
                          <span style={{ color: 'var(--text-primary)' }}>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={categoryProfile.relatedKnowledge}
                  className="inline-flex items-center gap-2 font-medium"
                  style={{ color: 'var(--brand-700)' }}
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
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>{t.categories_no_products}</p>
            <Link href="/products" className="mt-4 inline-block hover:underline" style={{ color: 'var(--brand-600)' }}>
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
                    className="px-4 py-2 rounded hover:bg-gray-50"
                    style={{ border: '1px solid var(--surface-200)' }}
                  >
                    {t.categories_prev}
                  </Link>
                )}
                <span className="px-4 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {t.categories_page_of
                    .replace('{page}', pageNum.toString())
                    .replace('{total}', totalPages.toString())}
                </span>
                {pageNum < totalPages && (
                  <Link
                    href={`/categories/${slug}?sort=${sort}&page=${pageNum + 1}`}
                    className="px-4 py-2 rounded hover:bg-gray-50"
                    style={{ border: '1px solid var(--surface-200)' }}
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
