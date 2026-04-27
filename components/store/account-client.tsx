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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t.account_title}
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/account/orders" className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 group-hover:text-brand-700">{t.account_orders}</h2>
              <p className="text-sm text-gray-500">{t.account_orders_desc}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>

        <Link href="/account/quotes" className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 group-hover:text-brand-700">{t.account_quotes}</h2>
              <p className="text-sm text-gray-500">{t.account_quotes_desc}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{userName || 'User'}</h2>
              <p className="text-sm text-gray-500">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
