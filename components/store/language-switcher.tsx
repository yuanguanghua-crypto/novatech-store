'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { LOCALES, type Locale } from '@/lib/i18n/translations'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  /** 显示样式：'icon-text'（默认）显示旗帜+名称，'compact' 只显示旗帜+代码 */
  variant?: 'icon-text' | 'compact'
  /** 下拉菜单方向：'down'（默认）向下展开，'up' 向上展开 */
  direction?: 'down' | 'up'
}

export function LanguageSwitcher({
  variant = 'icon-text',
  direction = 'down',
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LOCALES.find(l => l.code === locale)!

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 键盘 Escape 关闭
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function handleSelect(code: Locale) {
    setLocale(code)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.aria_select_language}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors',
          open ? 'text-brand-700' : 'text-secondary',
        )}
        style={open ? { backgroundColor: 'var(--brand-50)' } : undefined}
      >
        <Globe className="w-4 h-4 flex-shrink-0" />
        {variant === 'icon-text' ? (
          <>
            <span className="hidden sm:inline font-medium">{current.flag} {current.label}</span>
            <span className="sm:hidden font-medium">{current.flag}</span>
          </>
        ) : (
          <span>{current.flag} {current.code.toUpperCase()}</span>
        )}
        <ChevronDown
          className={cn('w-3 h-3 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* 下拉菜单 */}
      {open && (
        <div
          role="listbox"
          aria-label={t.aria_language_options}
          className={cn(
            'absolute right-0 z-[60] w-52 rounded-xl bg-white shadow-xl',
            'py-1.5 overflow-hidden',
            direction === 'up' ? 'bottom-full mb-1' : 'top-full mt-1',
          )}
          style={{ border: '1px solid var(--surface-200)' }}
        >
          {/* 标题 */}
          <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--surface-100)' }}>
            Language / 语言
          </div>

          {LOCALES.map(lang => (
            <button
              key={lang.code}
              role="option"
              aria-selected={lang.code === locale}
              onClick={() => handleSelect(lang.code)}
              className={cn(
                'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors',
                lang.code === locale
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-primary',
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-base leading-none">{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
              {lang.code === locale && (
                <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
