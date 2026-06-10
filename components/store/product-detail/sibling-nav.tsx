'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SiblingVariant {
  variantId: string
  slug: string
  volumeMl: number | null
  materialFamily: string | null
  price: number
}

interface SiblingNavProps {
  siblings: SiblingVariant[]
  currentSlug: string
}

export function SiblingNav({ siblings, currentSlug }: SiblingNavProps) {
  const others = siblings.filter((v) => v.slug !== currentSlug)
  if (others.length === 0) return null

  return (
    <div>
      <h3 className="text-base font-bold mb-3" style={{ color: '#1F2A44' }}>
        Other Sizes
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {others.slice(0, 8).map((v) => (
          <Link
            key={v.variantId}
            href={`/products/${v.slug}`}
            className="flex items-center justify-between p-3 rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: '#FAFBFC',
              border: '1px solid #E2E8F0',
            }}
          >
            <div>
              <div className="font-medium" style={{ color: '#1F2A44' }}>{v.volumeMl}ml</div>
              <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                ${v.price.toFixed(2)}
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5" style={{ color: '#94A3B8' }} />
          </Link>
        ))}
      </div>
    </div>
  )
}
