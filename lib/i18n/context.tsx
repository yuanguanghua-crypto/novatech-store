'use client'

import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from 'react'
import { translations, LOCALES, type Locale, type TranslationKeys } from './translations'

const STORAGE_KEY = 'lpg_locale'
const DEFAULT_LOCALE: Locale = 'en'

// ---- Context 类型 ----
interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
  dir: 'ltr' | 'rtl'
  isRTL: boolean
  isInitialized: boolean  // 标记是否已从 localStorage 读取
}

const I18nContext = createContext<I18nContextValue | null>(null)

// ---- Helper: 同步获取 localStorage（避免 hydration mismatch）----
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && saved in translations) return saved
  } catch {}
  return DEFAULT_LOCALE
}

// ---- Provider ----
export function I18nProvider({ children }: { children: ReactNode }) {
  // 初始化时同步读取 localStorage，避免 hydration mismatch
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale())
  const [isInitialized, setIsInitialized] = useState(false)

  // 组件挂载后标记初始化完成
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  // 切换语言时更新 document 的 lang 和 dir 属性
  useEffect(() => {
    const localeInfo = LOCALES.find(l => l.code === locale)
    const dir = localeInfo?.dir === 'rtl' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {}
  }, [])

  const localeInfo = LOCALES.find(l => l.code === locale)
  const dir = localeInfo?.dir === 'rtl' ? 'rtl' : 'ltr'

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t: translations[locale],
        dir,
        isRTL: dir === 'rtl',
        isInitialized,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

// ---- Hook ----
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
