'use client'

import { Package, Truck, AlertTriangle } from 'lucide-react'

interface StockBadgeProps {
  houston: number
  china: number
}

export function StockBadge({ houston, china }: StockBadgeProps) {
  const bothEmpty = houston === 0 && china === 0

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2" style={{ color: '#1F2A44' }}>
        Shipping & Availability
      </h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: houston > 0 ? '#059669' : '#CBD5E1' }} />
          <Package className="w-3.5 h-3.5" style={{ color: '#64748B' }} />
          <span style={{ color: '#1F2A44' }}>
            Houston Warehouse: {houston > 0 ? `${houston} in stock` : 'Out of stock'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: china > 0 ? '#059669' : '#CBD5E1' }} />
          <Truck className="w-3.5 h-3.5" style={{ color: '#64748B' }} />
          <span style={{ color: '#1F2A44' }}>
            China Warehouse: {china > 0 ? `${china} in stock` : 'Out of stock'}
          </span>
        </div>
        {bothEmpty && (
          <div className="flex items-center gap-2 text-sm mt-2 p-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
            <AlertTriangle className="w-4 h-4" />
            <span>Please contact customer service for lead time</span>
          </div>
        )}
      </div>
    </div>
  )
}
