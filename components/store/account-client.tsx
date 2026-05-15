'use client'

import Link from 'next/link'
import { User, Package, FileText, ChevronRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface AccountClientProps {
  userName?: string | null
  userEmail?: string | null
}

export function AccountClient({ userName, userEmail }: AccountClientProps) {
  const { t } = useI18n()

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {t.account_title}
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/account/orders" className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow group" style={{ border: '1px solid var(--surface-200)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-100)' }}>
              <Package className="w-5 h-5" style={{ color: 'var(--brand-700)' }} />
            </div>
            <div>
              <h2 className="font-semibold group-hover:text-brand-700" style={{ color: 'var(--text-primary)' }}>{t.account_orders}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.account_orders_desc}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        </Link>

        <Link href="/account/quotes" className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow group" style={{ border: '1px solid var(--surface-200)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface-100)' }}>
              <FileText className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <h2 className="font-semibold group-hover:text-brand-700" style={{ color: 'var(--text-primary)' }}>{t.account_quotes}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.account_quotes_desc}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        </Link>

        <div className="bg-white rounded-xl p-6" style={{ border: '1px solid var(--surface-200)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-100)' }}>
              <User className="w-5 h-5" style={{ color: 'var(--brand-700)' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{userName || 'User'}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{userEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
