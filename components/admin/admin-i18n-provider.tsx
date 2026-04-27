'use client'

import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from 'react'
import {
  adminTranslations, type AdminLocale, type AdminTranslationKeys
} from '@/lib/i18n/admin-translations'

const ADMIN_LOCALE_KEY = 'lpg_admin_locale'
const DEFAULT_LOCALE: AdminLocale = 'en'

interface AdminI18nContextValue {
  locale: AdminLocale
  setLocale: (locale: AdminLocale) => void
  t: AdminTranslationKeys
}

const AdminI18nContext = createContext<AdminI18nContextValue | null>(null)

export function AdminI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>(DEFAULT_LOCALE)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADMIN_LOCALE_KEY) as AdminLocale | null
      if (saved && saved in adminTranslations) {
        setLocaleState(saved)
      }
    } catch {}
  }, [])

  const setLocale = useCallback((newLocale: AdminLocale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(ADMIN_LOCALE_KEY, newLocale)
    } catch {}
  }, [])

  return (
    <AdminI18nContext.Provider value={{
      locale,
      setLocale,
      t: adminTranslations[locale],
    }}>
      {children}
    </AdminI18nContext.Provider>
  )
}

export function useAdminI18n(): AdminI18nContextValue {
  const ctx = useContext(AdminI18nContext)
  if (!ctx) throw new Error('useAdminI18n must be used within AdminI18nProvider')
  return ctx
}
