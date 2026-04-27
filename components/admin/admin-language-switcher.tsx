'use client'

import { useAdminI18n } from './admin-i18n-provider'
import { ADMIN_LOCALES } from '@/lib/i18n/admin-translations'
import { Globe } from 'lucide-react'

export function AdminLanguageSwitcher() {
  const { locale, setLocale } = useAdminI18n()

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <select
        value={locale}
        onChange={e => setLocale(e.target.value as typeof locale)}
        className="text-sm border border-gray-200 rounded px-2 py-1 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
        aria-label="Select language"
      >
        {ADMIN_LOCALES.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  )
}
