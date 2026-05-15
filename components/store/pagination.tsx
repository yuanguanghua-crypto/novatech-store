'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  page: number
  totalPages: number
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`/products?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {page > 1 && (
        <button
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 text-sm rounded-md transition-colors"
          style={{ border: '1px solid var(--surface-300)', color: 'var(--text-secondary)' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-50)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          ← Prev
        </button>
      )}
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        const p = page <= 4 ? i + 1 : page - 3 + i
        if (p < 1 || p > totalPages) return null
        return (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              p === page ? 'bg-brand-700 text-white' : ''
            }`}
            style={p !== page ? { border: '1px solid var(--surface-300)', color: 'var(--text-secondary)' } : undefined}
            onMouseEnter={p !== page ? e => { e.currentTarget.style.backgroundColor = 'var(--surface-50)' } : undefined}
            onMouseLeave={p !== page ? e => { e.currentTarget.style.backgroundColor = 'transparent' } : undefined}
          >
            {p}
          </button>
        )
      })}
      {page < totalPages && (
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 text-sm rounded-md transition-colors"
          style={{ border: '1px solid var(--surface-300)', color: 'var(--text-secondary)' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-50)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          Next →
        </button>
      )}
    </div>
  )
}
