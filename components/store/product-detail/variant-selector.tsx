'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

interface SiblingVariant {
  variantId: string
  slug: string
  volumeMl: number | null
  materialFamily: string | null
  price: number
}

interface VariantSelectorProps {
  siblings: SiblingVariant[]
  currentSlug: string
}

export function VariantSelector({ siblings, currentSlug }: VariantSelectorProps) {
  // Group by volume
  const byVolume = siblings
    .filter((v) => v.volumeMl)
    .sort((a, b) => (a.volumeMl || 0) - (b.volumeMl || 0))

  if (byVolume.length <= 1) return null

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2" style={{ color: '#1F2A44' }}>
        Capacity
      </h4>
      <div className="flex flex-wrap gap-2">
        {byVolume.map((v) => {
          const isCurrent = v.slug === currentSlug
          return (
            <Link
              key={v.variantId}
              href={`/products/${v.slug}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isCurrent ? 'pointer-events-none' : 'hover:-translate-y-0.5'
              }`}
              style={{
                backgroundColor: isCurrent ? '#0F4C81' : '#F1F5F9',
                color: isCurrent ? 'white' : '#1F2A44',
                border: isCurrent ? '2px solid #0F4C81' : '2px solid transparent',
              }}
            >
              {v.volumeMl}ml
              {isCurrent && <Check className="w-3.5 h-3.5" />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
