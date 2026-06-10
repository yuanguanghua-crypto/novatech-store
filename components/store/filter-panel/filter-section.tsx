'use client'

import { X } from 'lucide-react'

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface FilterSectionProps {
  title: string
  options: FilterOption[]
  selected: string[]
  onChange: (value: string) => void
  type?: 'checkbox' | 'button' | 'range'
}

export function FilterSection({ title, options, selected, onChange, type = 'checkbox' }: FilterSectionProps) {
  if (options.length === 0) return null

  return (
    <div className="py-3 border-b border-gray-100">
      <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>
        {title}
      </h4>
      <div className="space-y-1">
        {type === 'button' ? (
          <div className="flex flex-wrap gap-1.5">
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange(opt.value)}
                  className="px-3 py-1.5 text-xs rounded-lg transition-all duration-150"
                  style={{
                    backgroundColor: isSelected ? '#0F4C81' : '#F1F5F9',
                    color: isSelected ? 'white' : '#1F2A44',
                  }}
                >
                  {opt.label}
                  {opt.count !== undefined && (
                    <span className="ml-1 opacity-60">({opt.count})</span>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          options.map((opt) => {
            const isSelected = selected.includes(opt.value)
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2 py-1 cursor-pointer text-sm transition-colors rounded px-1"
                style={{ color: '#1F2A44' }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onChange(opt.value)}
                  className="w-3.5 h-3.5 rounded"
                  style={{ accentColor: '#0F4C81' }}
                />
                <span className="flex-1">{opt.label}</span>
                {opt.count !== undefined && (
                  <span className="text-xs" style={{ color: '#94A3B8' }}>{opt.count}</span>
                )}
              </label>
            )
          })
        )}
      </div>
    </div>
  )
}
