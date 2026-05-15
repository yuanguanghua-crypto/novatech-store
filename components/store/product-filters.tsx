'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'

interface ProductFiltersProps {
  searchParams: Record<string, string | undefined>
}

export function ProductFilters({ searchParams }: ProductFiltersProps) {
  const { t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState({
    availability: true,
    price: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams as any)
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const updateFilter = useCallback((key: string, value: string | null) => {
    updateFilters({ [key]: value })
  }, [updateFilters])

  const hasActiveFilters = Object.values(searchParams).some(Boolean)

  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
      {/* Availability Filter */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-3"
        >
          <span>{t.filter_availability}</span>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            expandedSections.availability ? "rotate-180" : ""
          )} />
        </button>
        {expandedSections.availability && (
          <div className="space-y-2 animate-fade-in">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                searchParams.availability === 'in_stock'
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-300 group-hover:border-blue-400"
              )}>
                {searchParams.availability === 'in_stock' && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <input
                type="checkbox"
                checked={searchParams.availability === 'in_stock'}
                onChange={(e) => updateFilter('availability', e.target.checked ? 'in_stock' : null)}
                className="sr-only"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {t.filter_in_stock_only}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-3"
        >
          <span>{t.filter_price_range}</span>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            expandedSections.price ? "rotate-180" : ""
          )} />
        </button>
        {expandedSections.price && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={t.filter_min}
                defaultValue={searchParams.minPrice || ''}
                onBlur={(e) => updateFilter('minPrice', e.target.value || null)}
                className="input text-sm"
                min="0"
              />
              <span className="text-gray-400">–</span>
              <input
                type="number"
                placeholder={t.filter_max}
                defaultValue={searchParams.maxPrice || ''}
                onBlur={(e) => updateFilter('maxPrice', e.target.value || null)}
                className="input text-sm"
                min="0"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ['< $100', '0', '100'],
                ['$100–$500', '100', '500'],
                ['$500–$2K', '500', '2000'],
                ['$2K+', '2000', '']
              ].map(([label, min, max]) => (
                <button
                  key={label}
                  onClick={() => updateFilters({ minPrice: min || null, maxPrice: max || null })}
                  className={cn(
                    "text-xs border rounded-lg px-3 py-1.5 font-medium transition-all",
                    searchParams.minPrice === min && searchParams.maxPrice === max
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="p-4">
          <button
            onClick={() => router.push(pathname)}
            className="w-full btn-secondary text-sm"
          >
            {t.filter_clear_all}
          </button>
        </div>
      )}
    </div>
  )
}
