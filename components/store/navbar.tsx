'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Search, ShoppingCart, Menu, X, ChevronDown,
  User, Package, LogOut, Settings, FileText,
} from 'lucide-react'
import { useCartStore } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'
import { LanguageSwitcher } from './language-switcher'
import { getCategoryName } from '@/lib/i18n/category-translations'

interface NavCategory {
  id: string
  name: string
  slug: string
  _count: { products: number }
  children: { id: string; name: string; slug: string; _count?: { products: number } }[]
}

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<NavCategory[]>([])
  const { items } = useCartStore()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const { t, locale } = useI18n()
  const lang = locale as string

  // Fetch categories from API
  useEffect(() => {
    fetch('/api/categories?parent=true')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data)
        } else {
          return fetch('/api/categories').then(r => r.json())
        }
      })
      .then(data => {
        if (Array.isArray(data) && categories.length === 0) {
          setCategories(data.slice(0, 8))
        }
      })
      .catch(() => {})
  }, [])

  function isActive(slug: string) {
    return pathname.includes(`/categories/${slug}`) ||
           pathname.includes(`/brands/${slug}`)
  }

  function getTotalProducts(cat: NavCategory) {
    const directProducts = cat._count?.products || 0
    const childProducts = cat.children.reduce((sum, c) => sum + (c._count?.products || 0), 0)
    return directProducts + childProducts
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="bg-brand-800 text-white text-xs py-1.5">
        <div className="container-custom flex justify-between items-center">
          <span>{t.nav_free_shipping}</span>
          <div className="flex items-center gap-4">
            <a href="tel:+1-800-000-0000" className="hover:text-brand-200">+1 (800) 000-0000</a>
            <a href="mailto:sales@novatechstore.com" className="hover:text-brand-200">sales@novatechstore.com</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container-custom py-3 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/logo.png" alt="LabProGlobal" className="h-10 w-auto" />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder={t.nav_search_placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
                }
              }}
              className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                         transition-all duration-200"
            />
            <button
              onClick={() => searchQuery.trim() && (window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`)}
              className="absolute right-0 top-0 bottom-0 px-4 bg-blue-600 text-white rounded-r-lg
                         hover:bg-blue-700 transition-colors duration-200"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Quote Link */}
          <Link href="/quote" className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <FileText className="w-5 h-5" />
            <span>{t.nav_get_quote}</span>
          </Link>

          {/* User Menu */}
          {session ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden md:block">{session.user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-dropdown
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <User className="w-4 h-4" /> {t.nav_my_account}
                </Link>
                <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <Package className="w-4 h-4" /> {t.nav_orders}
                </Link>
                {(session.user as any)?.role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    <Settings className="w-4 h-4" /> Admin
                  </Link>
                )}
                <hr className="my-1" />
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-4 h-4" /> {t.nav_sign_out}
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden md:block">{t.nav_sign_in}</span>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:block">{t.nav_cart}</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full
                               w-5 h-5 flex items-center justify-center font-medium">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="border-t border-gray-100 hidden md:block">
        <div className="container-custom">
          <ul className="flex items-center gap-0">
            {/* All Products */}
            <li>
              <Link
                href="/products"
                className={cn(
                  'flex items-center gap-1 px-4 py-2.5 text-sm font-medium transition-colors duration-200',
                  pathname === '/products'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                )}
              >
                {t.nav_all_products}
              </Link>
            </li>

            {/* Category Links with Dropdowns */}
            {categories.map((cat) => (
              <li key={cat.id} className="relative group">
                <Link
                  href={`/categories/${cat.slug}`}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap',
                    isActive(cat.slug)
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  )}
                >
                  {getCategoryName(cat.name, lang)}
                  {cat.children.length > 0 && <ChevronDown className="w-3 h-3 mt-0.5" />}
                </Link>

                {/* Dropdown Menu */}
                {cat.children.length > 0 && (
                  <div className="absolute left-0 top-full bg-white border border-gray-200 rounded-lg shadow-dropdown
                                  min-w-[240px] opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                  transition-all duration-200 z-50 mt-0 py-2">
                    <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-1">
                      {getCategoryName(cat.name, lang)}
                    </div>
                    {cat.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/categories/${child.slug}`}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <span>{getCategoryName(child.name, lang)}</span>
                        {child._count && (
                          <span className="text-xs text-gray-400">{child._count.products.toLocaleString()}</span>
                        )}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        {t.nav_view_all} {getCategoryName(cat.name, lang)}
                        <ChevronDown className="w-3 h-3 rotate-[-90deg] ml-1" />
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}

            {/* View All Categories */}
            <li>
              <Link
                href="/categories"
                className={cn(
                  'flex items-center gap-1 px-4 py-2.5 text-sm font-medium transition-colors duration-200',
                  pathname === '/categories'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                )}
              >
                {t.nav_all_categories}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-slide-down">
          <div className="container-custom py-4 space-y-1">
            {/* Mobile Language Switcher */}
            <div className="py-2 px-2 border-b border-gray-100 mb-2">
              <LanguageSwitcher variant="compact" direction="down" />
            </div>

            <Link href="/products" className="block py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
              {t.nav_all_products}
            </Link>
            {categories.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="block py-2.5 px-2 text-sm font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {getCategoryName(cat.name, lang)}
                </Link>
                {cat.children.length > 0 && (
                  <div className="pl-4 space-y-0">
                    {cat.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/categories/${child.slug}`}
                        className="block py-2 px-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {getCategoryName(child.name, lang)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <hr className="my-2" />
            <Link href="/categories" className="block py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
              {t.nav_all_categories}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
