'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function CheckoutClient() {
  const { t } = useI18n()

  return (
    <div className="container py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.checkout_title}</h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>{t.checkout_not_configured}</p>
        <div className="bg-white rounded-xl p-6 text-left mb-6" style={{ border: '1px solid var(--surface-200)' }}>
          <h2 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{t.checkout_steps_title}</h2>
          <ol className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li className="flex gap-2">
              <span className="w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
              {t.checkout_step1}
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
              {t.checkout_step2}
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
              {t.checkout_step3}
            </li>
          </ol>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/cart" className="btn-outline px-6 py-2.5">
            {t.checkout_back_cart}
          </Link>
          <Link href="/quote" className="btn-primary px-6 py-2.5">
            {t.checkout_request_quote}
          </Link>
        </div>
      </div>
    </div>
  )
}
