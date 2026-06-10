'use client'

import { useMemo, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export interface VariantFilterData {
  variantId: string
  spuId: string
  spuName: string
  categorySlug: string
  slug: string
  variantName: string
  volumeMl: number | null
  materialFamily: string | null
  wallType: string | null
  jointType: string | null
  jointSize: string | null
  accuracyClass: string | null
  color: string | null
  sellingPriceUsd: number
  stockHouston: number
  stockChina: number
}

export interface FilterState {
  volume: string | null
  material: string | null
  wall: string | null
  jointType: string | null
  jointSize: string | null
  accuracy: string | null
  minPrice: string | null
  maxPrice: string | null
}

const FILTER_KEYS: (keyof FilterState)[] = [
  'volume', 'material', 'wall', 'jointType', 'jointSize', 'accuracy', 'minPrice', 'maxPrice',
]

export function useProductFilters(variants: VariantFilterData[]) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse URL params → FilterState
  const filters: FilterState = useMemo(() => ({
    volume: searchParams.get('volume'),
    material: searchParams.get('material'),
    wall: searchParams.get('wall'),
    jointType: searchParams.get('jointType'),
    jointSize: searchParams.get('jointSize'),
    accuracy: searchParams.get('accuracy'),
    minPrice: searchParams.get('minPrice'),
    maxPrice: searchParams.get('maxPrice'),
  }), [searchParams])

  // Apply filters
  const filteredVariants = useMemo(() => {
    return variants.filter((v) => {
      // Volume: comma-separated, OR logic
      if (filters.volume) {
        const selected = filters.volume.split(',').map(Number)
        if (!v.volumeMl || !selected.includes(v.volumeMl)) return false
      }
      // Material: comma-separated, OR logic
      if (filters.material) {
        const selected = filters.material.split(',')
        if (!v.materialFamily || !selected.includes(v.materialFamily)) return false
      }
      // Wall Type: comma-separated, OR logic
      if (filters.wall) {
        const selected = filters.wall.split(',')
        if (!v.wallType || !selected.includes(v.wallType)) return false
      }
      // Joint Type
      if (filters.jointType) {
        const selected = filters.jointType.split(',')
        if (!v.jointType || !selected.includes(v.jointType)) return false
      }
      // Joint Size
      if (filters.jointSize) {
        const selected = filters.jointSize.split(',')
        if (!v.jointSize || !selected.includes(v.jointSize)) return false
      }
      // Accuracy Class
      if (filters.accuracy) {
        const selected = filters.accuracy.split(',')
        if (!v.accuracyClass || !selected.includes(v.accuracyClass)) return false
      }
      // Price range
      if (filters.minPrice && v.sellingPriceUsd < Number(filters.minPrice)) return false
      if (filters.maxPrice && v.sellingPriceUsd > Number(filters.maxPrice)) return false

      return true
    })
  }, [variants, filters])

  // Set a filter value (updates URL)
  const setFilter = useCallback((key: keyof FilterState, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  // Clear all filters
  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    FILTER_KEYS.forEach((k) => params.delete(k))
    router.replace(pathname, { scroll: false })
  }, [router, pathname, searchParams])

  // Check if any filter is active
  const hasActiveFilters = FILTER_KEYS.some((k) => filters[k] !== null)

  return { filters, filteredVariants, setFilter, clearFilters, hasActiveFilters }
}
