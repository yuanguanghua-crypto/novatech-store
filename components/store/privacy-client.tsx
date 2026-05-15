'use client'

import { useI18n } from '@/lib/i18n/context'

export function PrivacyClient() {
  const { t } = useI18n()

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.privacy_title}</h1>

      <div className="card p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
        <p><strong className="text-gray-800">{t.privacy_last_updated}</strong> April 2026</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.privacy_section1}</h2>
        <p>{t.privacy_item1a}</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t.privacy_item1b}</li>
          <li>{t.privacy_item1c}</li>
          <li>{t.privacy_item1d}</li>
          <li>{t.privacy_item1e}</li>
          <li>{t.privacy_item1f}</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900">{t.privacy_section2}</h2>
        <p>{t.privacy_item2a}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.privacy_section3}</h2>
        <p>{t.privacy_item2b}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.privacy_section4}</h2>
        <p>{t.privacy_item2c}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.privacy_section5}</h2>
        <p>{t.privacy_item3}</p>

        <h2 className="text-lg font-semibold text-gray-900">{t.privacy_section6}</h2>
        <p>{t.privacy_item4} <a href="mailto:privacy@labprostore.com" className="text-brand-700 underline">privacy@labprostore.com</a>.</p>
      </div>
    </div>
  )
}
