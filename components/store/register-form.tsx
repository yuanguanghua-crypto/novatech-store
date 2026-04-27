'use client'

import { useI18n } from '@/lib/i18n/context'

interface RegisterFormProps {
  tkey?: string
}

export function RegisterForm({ tkey }: RegisterFormProps) {
  const { t } = useI18n()

  if (tkey) return <>{t[tkey as keyof typeof t]}</>

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth_name}</label>
        <input
          type="text"
          placeholder={t.placeholder_name_example}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
          disabled
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth_company_optional}</label>
        <input
          type="text"
          placeholder={t.placeholder_company_example}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
          disabled
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth_email}</label>
        <input
          type="email"
          placeholder={t.placeholder_email_example}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
          disabled
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.auth_password}</label>
        <input
          type="password"
          placeholder={t.auth_min_password}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
          disabled
        />
      </div>
      <button
        disabled
        className="w-full bg-brand-700 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-brand-800 transition-colors cursor-not-allowed opacity-50"
      >
        {t.auth_create_account_btn}
      </button>
    </div>
  )
}
