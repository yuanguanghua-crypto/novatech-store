'use client'

import { useI18n } from '@/lib/i18n/context'

export function TermsClient() {
  const { t } = useI18n()

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.terms_title}</h1>

      <div className="card p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
        <p><strong className="text-gray-800">{t.terms_last_updated}</strong> April 2026</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.terms_section1}</h2>
        <p>{t.terms_item1}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.terms_section2}</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t.terms_item2}</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900">{t.terms_section3}</h2>
        <p>{t.terms_item3}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.terms_section4}</h2>
        <p>{t.terms_item4}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.terms_section5}</h2>
        <p>{t.terms_item5}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.terms_section6}</h2>
        <p>{t.terms_item6}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.terms_section7}</h2>
        <p>{t.terms_item7}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.terms_section8}</h2>
        <p>{t.terms_item8}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.terms_section9}</h2>
        <p>{t.terms_item9}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.terms_section10}</h2>
        <p>{t.terms_item10} <a href="mailto:legal@novatechstore.com" className="text-brand-700 underline">legal@novatechstore.com</a>.</p>
      </div>
    </div>
  )
}
