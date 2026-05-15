'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SortSelector } from '@/components/store/sort-selector'

interface SortBarProps {
  total: number
  page: number
  pageSize: number
  currentSort?: string
}

export function SortBar({ total, page, pageSize, currentSort }: SortBarProps) {
  return (
    <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--surface-200)' }}>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Showing <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{Math.min((page - 1) * pageSize + 1, total)}</span>–
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{Math.min(page * pageSize, total)}</span> of{' '}
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{total.toLocaleString()}</span> products
      </p>
      <SortSelector current={currentSort} />
    </div>
  )
}
