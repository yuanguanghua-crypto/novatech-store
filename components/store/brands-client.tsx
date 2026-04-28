'use client'

import { useState, useEffect } from 'react'
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
  brands?: Brand[]
  grouped?: Record<string, Brand[]>
  letters?: string[]
}

export function BrandsClient({ brands: initialBrands = [], grouped: initialGrouped = {}, letters: initialLetters = [] }: BrandsClientProps) {
  const { t } = useI18n()
  const [brands, setBrands] = useState<Brand[]>(initialBrands.length > 0 ? initialBrands : [])
  const [grouped, setGrouped] = useState<Record<string, Brand[]>>(Object.keys(initialGrouped).length > 0 ? initialGrouped : {})
  const [letters, setLetters] = useState<string[]>(initialLetters.length > 0 ? initialLetters : [])
  const [loading, setLoading] = useState(initialBrands.length === 0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (brands.length > 0) return

    async function fetchBrands() {
      try {
        setLoading(true)
        const res = await fetch('/api/brands')
        if (!res.ok) throw new Error('Failed to fetch brands')
        const data = await res.json()
        
        // Group by first letter
        const grp: Record<string, Brand[]> = {}
        for (const brand of data) {
          const letter = brand.name.charAt(0).toUpperCase()
          if (!grp[letter]) grp[letter] = []
          grp[letter].push(brand)
        }
        const lets = Object.keys(grp).sort()
        
        setBrands(data)
        setGrouped(grp)
        setLetters(lets)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [brands.length])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-10">
          <h1 className="text-3xl font-bold text-gray-900 font-display">{t.brands_title}</h1>
          <p className="mt-2 text-gray-600">
            {t.brands_subtitle.replace('{count}', brands.length.toString())}
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-500">{error}</p>
          </div>
        ) : brands.length === 0 ? (
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
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200"
                >
                  {letter}
                </a>
              ))}
            </div>

            {/* Brands by letter */}
            <div className="space-y-12">
              {letters.map(letter => (
                <div key={letter} id={`letter-${letter}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-blue-600">{letter}</span>
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm text-gray-500">
                      {grouped[letter].length} {grouped[letter].length === 1 ? 'brand' : 'brands'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {grouped[letter].map(brand => (
                      <Link
                        key={brand.id}
                        href={`/brands/${brand.slug}`}
                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 hover:-translate-y-1 group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {brand.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-full">
                                📦 {brand._count?.products?.toLocaleString() || '0'} products
                              </span>
                              {brand.country && (
                                <span className="bg-gray-100 px-2 py-1 rounded-full">{brand.country}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors">
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
