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
  isInitialized: boolean  // 新增：标记是否已从 localStorage 读取
}

const I18nContext = createContext<I18nContextValue | null>(null)

// ---- Provider ----
export function I18nProvider({ children }: { children: ReactNode }) {
  // 用 null 表示"未初始化"，初始化后填入实际语言
  const [locale, setLocaleState] = useState<Locale | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // 初始化：从 localStorage 读取上次选择的语言
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (saved && saved in translations) {
        setLocaleState(saved)
      } else {
        setLocaleState(DEFAULT_LOCALE)
      }
    } catch {
      setLocaleState(DEFAULT_LOCALE)
    }
    setIsInitialized(true)
  }, [])

  // 切换语言时更新 document 的 lang 和 dir 属性
  useEffect(() => {
    if (!locale) return
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

  // 在 locale 初始化完成前，先渲染带 suppressHydrationWarning 的占位
  // 使用 DEFAULT_LOCALE 确保 SSR 和首屏一致
  const resolvedLocale = locale ?? DEFAULT_LOCALE
  const localeInfo = LOCALES.find(l => l.code === resolvedLocale)
  const dir = localeInfo?.dir === 'rtl' ? 'rtl' : 'ltr'

  return (
    <I18nContext.Provider
      value={{
        locale: resolvedLocale,
        setLocale,
        t: translations[resolvedLocale],
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
