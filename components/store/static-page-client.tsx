'use client'

import Link from 'next/link'
import { RotateCcw, Package, Shield } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ReturnsClient() {
  const { t } = useI18n()

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.returns_title}</h1>
      <p className="text-gray-600 mb-8">{t.returns_subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="card p-6 text-center">
          <RotateCcw className="w-8 h-8 text-brand-700 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">{t.returns_30day}</h3>
          <p className="text-sm text-gray-500">{t.returns_30day_desc}</p>
        </div>
        <div className="card p-6 text-center">
          <Package className="w-8 h-8 text-brand-700 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">{t.returns_easy}</h3>
          <p className="text-sm text-gray-500">{t.returns_easy_desc}</p>
        </div>
        <div className="card p-6 text-center">
          <Shield className="w-8 h-8 text-brand-700 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">{t.returns_full}</h3>
          <p className="text-sm text-gray-500">{t.returns_full_desc}</p>
        </div>
      </div>

      <div className="card p-8 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">{t.returns_policy}</h2>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p><strong className="text-gray-800">Standard Products:</strong> {t.returns_policy_standard}</p>
          <p><strong className="text-gray-800">Special Orders & Custom Products:</strong> {t.returns_policy_special}</p>
          <p><strong className="text-gray-800">Defective Products:</strong> {t.returns_policy_defective}</p>
          <p><strong className="text-gray-800">Return Shipping:</strong> {t.returns_policy_shipping}</p>
        </div>

        <hr />

        <h2 className="text-xl font-bold text-gray-900">{t.returns_how}</h2>
        <ol className="space-y-3 text-sm text-gray-600">
          {[t.returns_step1, t.returns_step2, t.returns_step3, t.returns_step4, t.returns_step5, t.returns_step6].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-700 text-white text-xs rounded-full flex items-center justify-center font-medium">{i + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <div className="bg-brand-50 rounded-lg p-4">
          <p className="text-sm text-brand-800">
            <strong>{t.returns_need_help}</strong> {t.returns_contact}{' '}
            <a href="mailto:returns@novatechstore.com" className="underline">returns@novatechstore.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
