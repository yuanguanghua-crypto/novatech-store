'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface Brand {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

interface ProductFiltersProps {
  brands: Brand[]
  searchParams: Record<string, string | undefined>
}

export function ProductFilters({ brands, searchParams }: ProductFiltersProps) {
  const { t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()

  const updateFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams as any)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  return (
    <div className="space-y-6">
      {/* Availability */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t.filter_availability}</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={searchParams.availability === 'in_stock'}
              onChange={(e) => updateFilter('availability', e.target.checked ? 'in_stock' : null)}
              className="w-4 h-4 rounded border-gray-300 text-brand-600"
            />
            <span className="text-sm text-gray-700">{t.filter_in_stock_only}</span>
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t.filter_price_range}</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={t.filter_min}
            defaultValue={searchParams.minPrice || ''}
            onBlur={(e) => updateFilter('minPrice', e.target.value || null)}
            className="input w-full"
            min="0"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder={t.filter_max}
            defaultValue={searchParams.maxPrice || ''}
            onBlur={(e) => updateFilter('maxPrice', e.target.value || null)}
            className="input w-full"
            min="0"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[['< $100', '0', '100'], ['$100–$500', '100', '500'],
            ['$500–$2K', '500', '2000'], ['$2K+', '2000', '']].map(([label, min, max]) => (
            <button
              key={label}
              onClick={() => {
                updateFilter('minPrice', min || null)
                updateFilter('maxPrice', max || null)
              }}
              className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-50 text-gray-600"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t.filter_brand}</h3>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={searchParams.brand === brand.slug}
                  onChange={(e) => updateFilter('brand', e.target.checked ? brand.slug : null)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-600"
                />
                <span className="text-sm text-gray-700 group-hover:text-brand-700">{brand.name}</span>
              </div>
              <span className="text-xs text-gray-400">({brand._count.products})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {Object.values(searchParams).some(Boolean) && (
        <button
          onClick={() => router.push(pathname)}
          className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2 border border-red-200 rounded-md hover:bg-red-50"
        >
          {t.filter_clear_all}</button>
      )}
    </div>
  )
}
