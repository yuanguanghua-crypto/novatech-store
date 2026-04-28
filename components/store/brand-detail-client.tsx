'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import { ProductGrid } from '@/components/store/product-grid'

interface ProductItem {
  id: string
  slug: string
  sku: string
  name: string
  ourPrice: string | number
  availability: string
  images: { url: string }[]
  category: { name: string; slug: string }
  brand: { name: string; slug: string }
}

interface Brand {
  id: string
  name: string
  slug: string
  country?: string | null
}

interface BrandProfile {
  founded?: string
  headquarters?: string
  specialty: string
  description: string
  advantage: string[]
  applications: string[]
  certifications?: string[]
  heroProducts?: string[]
  knowledgeUrl?: string
}

interface BrandDetailClientProps {
  brand: Brand
  products: ProductItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  currentSort?: string
  brandProfile?: BrandProfile
}

export function BrandDetailClient({
  brand,
  products,
  total,
  page,
  pageSize,
  totalPages,
  currentSort,
  brandProfile
}: BrandDetailClientProps) {
  const { t } = useI18n()
  const [showKnowledge, setShowKnowledge] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Header with Semantic Content */}
      <section className="bg-white border-b">
        <div className="container py-8 md:py-12">
          <div className="mb-4">
            <Link href="/brands" className="text-sm text-gray-500 hover:text-brand-600">
              ← {t.brands_browse_all}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {brand.name}
              </h1>
              {brand.country && (
                <p className="text-gray-500 mb-4">{brand.country}</p>
              )}
              <p className="text-gray-600 max-w-2xl">
                {brandProfile?.description || `Browse ${brand.name} products for industrial and laboratory applications.`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-brand-600">{total.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Products</div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Knowledge Section */}
      {brandProfile && (
        <section className="bg-gradient-to-r from-brand-50 to-cyan-50 border-b">
          <div className="container py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">About {brand.name}</h2>
              <button
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="text-sm text-brand-600 hover:underline"
              >
                {showKnowledge ? 'Hide details' : 'Show details'}
              </button>
            </div>

            {showKnowledge && (
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-sm">📍</span>
                    <h3 className="font-semibold text-gray-900">Company Info</h3>
                  </div>
                  <dl className="space-y-2 text-sm">
                    {brandProfile.founded && (
                      <>
                        <dt className="text-gray-500">Founded</dt>
                        <dd className="font-medium">{brandProfile.founded}</dd>
                      </>
                    )}
                    {brandProfile.headquarters && (
                      <>
                        <dt className="text-gray-500">Headquarters</dt>
                        <dd className="font-medium">{brandProfile.headquarters}</dd>
                      </>
                    )}
                    <dt className="text-gray-500">Specialty</dt>
                    <dd className="font-medium">{brandProfile.specialty}</dd>
                  </dl>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-sm">✓</span>
                    <h3 className="font-semibold text-gray-900">Key Advantages</h3>
                  </div>
                  <ul className="space-y-2">
                    {brandProfile.advantage.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 text-sm">🏭</span>
                    <h3 className="font-semibold text-gray-900">Applications</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {brandProfile.applications.map((app, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white rounded-full text-xs text-gray-700 border">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {brandProfile.certifications && brandProfile.certifications.length > 0 && (
              <div className="mt-6 pt-6 border-t border-brand-100">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-gray-500">Certifications:</span>
                  {brandProfile.certifications.map((cert, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white rounded text-xs font-medium text-brand-700 border border-brand-200">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {brandProfile.knowledgeUrl && (
              <div className="mt-6">
                <Link
                  href={brandProfile.knowledgeUrl}
                  className="inline-flex items-center gap-2 text-brand-700 hover:text-brand-800 font-medium"
                >
                  Learn more about {brand.name} technology →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Products Section */}
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {t.brand_detail_title.replace('{name}', brand.name)}
          </h2>
          <span className="text-sm text-gray-500">
            {t.products_showing_range
              .replace('{start}', ((page - 1) * pageSize + 1).toString())
              .replace('{end}', Math.min(page * pageSize, total).toString())
              .replace('{total}', total.toString())}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <p className="text-gray-500">{t.brand_detail_no_products}</p>
            <Link href="/products" className="btn-primary mt-4 inline-block">
              {t.brands_browse_all}
            </Link>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
