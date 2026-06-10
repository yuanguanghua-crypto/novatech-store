'use client'

import { X } from 'lucide-react'

interface FilterPill {
  label: string
  value: string
  onRemove: () => void
}

interface FilterPillsProps {
  pills: FilterPill[]
  onClearAll: () => void
}

export function FilterPills({ pills, onClearAll }: FilterPillsProps) {
  if (pills.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      {pills.map((pill) => (
        <span
          key={pill.label + pill.value}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: '#EDF5FB', color: '#0F4C81' }}
        >
          {pill.label}: {pill.value}
          <button onClick={pill.onRemove} className="hover:opacity-70">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs underline hover:no-underline"
        style={{ color: '#64748B' }}
      >
        清除全部
      </button>
    </div>
  )
}
