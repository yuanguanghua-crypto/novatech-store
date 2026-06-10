'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { FilterSection } from './filter-section'
import { FilterPills } from './filter-pills'
import { useProductFilters, type FilterState, type VariantFilterData } from '@/hooks/use-product-filters'

interface FilterPanelProps {
  variants: VariantFilterData[]
  filterOptions: {
    volumes: number[]
    materials: string[]
    wallTypes: string[]
    jointTypes: string[]
    jointSizes: string[]
    accuracyClasses: string[]
    priceRange: { min: number; max: number }
  }
  children: (filtered: VariantFilterData[]) => React.ReactNode
}

export function FilterPanel({ variants: allVariants, filterOptions, children }: FilterPanelProps) {
  const { filters, filteredVariants, setFilter, clearFilters, hasActiveFilters } = useProductFilters(allVariants)
  const [mobileOpen, setMobileOpen] = useState(false)

  const selectedVolume = filters.volume ? filters.volume.split(',') : []
  const selectedMaterials = filters.material ? filters.material.split(',') : []
  const selectedWalls = filters.wall ? filters.wall.split(',') : []
  const selectedJoints = filters.jointType ? filters.jointType.split(',') : []
  const selectedSizes = filters.jointSize ? filters.jointSize.split(',') : []
  const selectedAccuracy = filters.accuracy ? filters.accuracy.split(',') : []

  const toggleMulti = (key: keyof FilterState, value: string, current: string[]) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setFilter(key, next.length > 0 ? next.join(',') : null)
  }

  // Generate pills
  const pills: { label: string; value: string; onRemove: () => void }[] = []
  selectedVolume.forEach((v) => pills.push({ label: '容量', value: `${v}ml`, onRemove: () => toggleMulti('volume', v, selectedVolume) }))
  selectedMaterials.forEach((m) => pills.push({ label: '材质', value: m, onRemove: () => toggleMulti('material', m, selectedMaterials) }))
  selectedWalls.forEach((w) => pills.push({ label: '壁厚', value: w, onRemove: () => toggleMulti('wall', w, selectedWalls) }))
  selectedJoints.forEach((j) => pills.push({ label: '磨口', value: j, onRemove: () => toggleMulti('jointType', j, selectedJoints) }))
  selectedAccuracy.forEach((a) => pills.push({ label: '精度', value: a, onRemove: () => toggleMulti('accuracy', a, selectedAccuracy) }))

  const filterContent = (
    <div>
      <FilterSection
        title="容量"
        type="button"
        options={filterOptions.volumes.map((v) => ({ label: `${v}ml`, value: String(v) }))}
        selected={selectedVolume}
        onChange={(v) => toggleMulti('volume', v, selectedVolume)}
      />
      <FilterSection
        title="材质"
        options={filterOptions.materials.map((m) => ({ label: m, value: m }))}
        selected={selectedMaterials}
        onChange={(v) => toggleMulti('material', v, selectedMaterials)}
      />
      <FilterSection
        title="壁厚"
        options={filterOptions.wallTypes.map((w) => ({ label: w, value: w }))}
        selected={selectedWalls}
        onChange={(v) => toggleMulti('wall', v, selectedWalls)}
      />
      <FilterSection
        title="磨口类型"
        options={filterOptions.jointTypes.map((j) => ({ label: j, value: j }))}
        selected={selectedJoints}
        onChange={(v) => toggleMulti('jointType', v, selectedJoints)}
      />
      <FilterSection
        title="精度等级"
        options={filterOptions.accuracyClasses.map((a) => ({ label: a, value: a }))}
        selected={selectedAccuracy}
        onChange={(v) => toggleMulti('accuracy', v, selectedAccuracy)}
      />
    </div>
  )

  return (
    <>
      {/* Mobile: Filter toggle */}
      <div className="lg:hidden flex items-center gap-3 mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ border: '1px solid #E2E8F0', color: '#1F2A44' }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          筛选
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
              style={{ backgroundColor: '#0F4C81' }}>
              {pills.length}
            </span>
          )}
        </button>
        <FilterPills pills={pills} onClearAll={clearFilters} />
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <FilterPills pills={pills} onClearAll={clearFilters} />
            {filterContent}
            <div className="mt-4 text-xs" style={{ color: '#94A3B8' }}>
              {filteredVariants.length} / {allVariants.length} 个产品
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {children(filteredVariants)}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: '#1F2A44' }}>筛选</h3>
              <button onClick={() => setMobileOpen(false)} style={{ color: '#64748B' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
            <button
              onClick={() => { setMobileOpen(false); clearFilters() }}
              className="w-full mt-4 py-2 rounded-lg text-sm font-medium"
              style={{ border: '1px solid #E2E8F0', color: '#1F2A44' }}
            >
              清除筛选
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-full mt-2 py-2.5 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: '#0F4C81' }}
            >
              应用 ({filteredVariants.length})
            </button>
          </div>
        </div>
      )}
    </>
  )
}
