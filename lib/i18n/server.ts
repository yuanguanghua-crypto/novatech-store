/**
 * Server-side i18n utilities for use in Server Components (metadata, etc.)
 * Only supports locales that have been configured in the translations file.
 */
import { translations } from './translations'

const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'ja', 'hi', 'ar', 'pt'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]

/**
 * Get a translation value for a given key and locale.
 * Falls back to English if locale is not found.
 *
 * Usage in Server Components / metadata:
 *   import { getTranslation } from '@/lib/i18n/server'
 *   title: getTranslation('auth_register_title', locale)
 */
export function getTranslation(key: string, locale: string = 'en'): string {
  const validLocale = (SUPPORTED_LOCALES.includes(locale as Locale) ? locale : 'en') as Locale
  const langData = translations[validLocale]
  if (!langData) return key
  const value = langData[key as keyof typeof langData]
  return typeof value === 'string' ? value : key
}

/**
 * Get page metadata with i18n title and description.
 * Uses the 'en' locale by default for server components.
 */
export function getPageMetadata(titleKey: string, descriptionKey: string, locale: string = 'en') {
  return {
    title: getTranslation(titleKey, locale),
    description: getTranslation(descriptionKey, locale),
  }
}
