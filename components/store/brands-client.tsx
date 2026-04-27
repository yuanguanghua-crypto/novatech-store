'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

interface Brand {
  id: string
  name: string
  slug: string
  country?: string | null
  _count: { products: number }
}

interface BrandsClientProps {
  brands: Brand[]
  grouped: Record<string, Brand[]>
  letters: string[]
}

export function BrandsClient({ brands, grouped, letters }: BrandsClientProps) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900">{t.brands_title}</h1>
          <p className="mt-2 text-gray-600">
            {t.brands_subtitle.replace('{count}', brands.length.toString())}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {brands.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔬</div>
            <p className="text-gray-500">{t.brands_no_brands}</p>
          </div>
        ) : (
          <>
            {/* Alphabet quick nav */}
            <div className="flex flex-wrap gap-2 mb-8">
              {letters.map(letter => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 transition"
                >
                  {letter}
                </a>
              ))}
            </div>

            {/* Brands by letter */}
            <div className="space-y-10">
              {letters.map(letter => (
                <div key={letter} id={`letter-${letter}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-brand-700">{letter}</span>
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm text-gray-500">
                      {t.brands_count.replace('{count}', grouped[letter].length.toString())}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {grouped[letter].map(brand => (
                      <Link
                        key={brand.id}
                        href={`/brands/${brand.slug}`}
                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-brand-300 transition group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition truncate">
                              {brand.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                {t.brands_products.replace('{count}', brand._count.products.toString())}
                              </span>
                              {brand.country && (
                                <span>{brand.country}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 w-5 h-5 text-gray-300 group-hover:text-brand-400 transition">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
