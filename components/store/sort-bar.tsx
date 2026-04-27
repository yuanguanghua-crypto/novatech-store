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
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
      <p className="text-sm text-gray-500">
        Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total.toLocaleString()}
      </p>
      <SortSelector current={currentSort} />
    </div>
  )
}
