'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Search, ShoppingCart, Menu, X, ChevronDown,
  User, Package, LogOut, Settings, FileText, Phone, Mail,
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
  const [hoveredCat, setHoveredCat] = useState<string | null>(null)
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
    return pathname.includes(`/categories/${slug}`)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* ===== Top Utility Bar ===== */}
      <div className="bg-[#0A2747] text-white text-xs" style={{ height: '32px' }}>
        <div className="container-custom flex justify-between items-center h-full">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline opacity-80">{t.nav_free_shipping}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="tel:+1-800-000-0000" className="flex items-center gap-1.5 hover:text-[#00A8B5] transition-colors">
              <Phone className="w-3 h-3" />
              <span className="hidden sm:inline">+1 (800) 000-0000</span>
            </a>
            <a href="mailto:sales@labprostore.com" className="flex items-center gap-1.5 hover:text-[#00A8B5] transition-colors">
              <Mail className="w-3 h-3" />
              <span className="hidden sm:inline">sales@labprostore.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* ===== Main Navbar ===== */}
      <div className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="container-custom flex items-center gap-6" style={{ height: '68px' }}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/logo.png" alt="LABPRO" className="h-10 w-auto" />
          </Link>

          {/* Search Bar - Pill Shape */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by SKU, product name, or specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
                  }
                }}
                className="w-full pl-4 pr-12 py-2.5 text-sm rounded-full
                           border transition-all duration-200
                           focus:outline-none focus:ring-3"
                style={{
                  borderColor: '#E2E8F0',
                }}
              />
              <button
                onClick={() => searchQuery.trim() && (window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`)}
                className="absolute right-0 top-0 bottom-0 px-4 text-white rounded-full
                           transition-colors duration-200"
                style={{ backgroundColor: '#0F4C81' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0A3A63'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F4C81'}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Quote Link */}
            <Link
              href="/quote"
              className="hidden md:flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: '#64748B' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0F4C81'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
            >
              <FileText className="w-5 h-5" />
              <span>{t.nav_get_quote}</span>
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-1.5 text-sm transition-colors"
                  style={{ color: '#64748B' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#0F4C81'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-dropdown
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
                     style={{ borderColor: '#E2E8F0' }}>
                  <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: '#1F2A44' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDF5FB'; e.currentTarget.style.color = '#0F4C81' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1F2A44' }}>
                    <User className="w-4 h-4" /> {t.nav_my_account}
                  </Link>
                  <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: '#1F2A44' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDF5FB'; e.currentTarget.style.color = '#0F4C81' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1F2A44' }}>
                    <Package className="w-4 h-4" /> {t.nav_orders}
                  </Link>
                  {(session.user as any)?.role === 'admin' && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: '#1F2A44' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDF5FB'; e.currentTarget.style.color = '#0F4C81' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1F2A44' }}>
                      <Settings className="w-4 h-4" /> Admin
                    </Link>
                  )}
                  <div className="my-1" style={{ borderTop: '1px solid #E2E8F0' }} />
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm w-full transition-colors"
                    style={{ color: '#EF4444' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut className="w-4 h-4" /> {t.nav_sign_out}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-sm transition-colors"
                style={{ color: '#64748B' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0F4C81'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
              >
                <User className="w-5 h-5" />
                <span className="hidden md:block">{t.nav_sign_in}</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: '#64748B' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0F4C81'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:block">{t.nav_cart}</span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-white text-xs rounded-full
                             w-5 h-5 flex items-center justify-center font-medium"
                  style={{ backgroundColor: '#00A8B5' }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-1.5 rounded-lg transition-colors"
              style={{ color: '#64748B' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Category Navigation ===== */}
      <nav className="bg-white border-b hidden md:block" style={{ borderColor: '#E2E8F0' }}>
        <div className="container-custom">
          <ul className="flex items-center gap-0">
            {/* All Products */}
            <li>
              <Link
                href="/products"
                className="nav-link-underline flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors duration-200"
                style={{
                  color: pathname === '/products' ? '#0F4C81' : '#1F2A44',
                }}
              >
                {t.nav_all_products}
              </Link>
            </li>

            {/* Category Links with Mega Menu */}
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="relative"
                onMouseEnter={() => setHoveredCat(cat.id)}
                onMouseLeave={() => setHoveredCat(null)}
              >
                <Link
                  href={`/categories/${cat.slug}`}
                  className="nav-link-underline flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                  style={{
                    color: isActive(cat.slug) || hoveredCat === cat.id ? '#0F4C81' : '#1F2A44',
                  }}
                >
                  {getCategoryName(cat.name, lang)}
                  {cat.children.length > 0 && <ChevronDown className="w-3 h-3 mt-0.5" />}
                </Link>

                {/* Mega Menu Dropdown */}
                {cat.children.length > 0 && hoveredCat === cat.id && (
                  <div
                    className="absolute left-0 top-full bg-white rounded-b-lg shadow-dropdown
                               min-w-[280px] z-50 py-3"
                    style={{ borderTop: '2px solid #00A8B5' }}
                  >
                    <div
                      className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wide mb-2"
                      style={{ color: '#64748B', borderBottom: '1px solid #E2E8F0' }}
                    >
                      {getCategoryName(cat.name, lang)}
                    </div>
                    {cat.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/categories/${child.slug}`}
                        className="flex items-center justify-between px-4 py-2 text-sm transition-colors"
                        style={{ color: '#1F2A44' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDF5FB'; e.currentTarget.style.color = '#0F4C81' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1F2A44' }}
                      >
                        <span>{getCategoryName(child.name, lang)}</span>
                        {child._count && (
                          <span className="text-xs" style={{ color: '#94A3B8' }}>{child._count.products.toLocaleString()}</span>
                        )}
                      </Link>
                    ))}
                    <div className="mt-1 pt-1" style={{ borderTop: '1px solid #E2E8F0' }}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="flex items-center px-4 py-2 text-sm font-medium transition-colors"
                        style={{ color: '#0F4C81' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDF5FB'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                className="nav-link-underline flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors duration-200"
                style={{
                  color: pathname === '/categories' ? '#0F4C81' : '#1F2A44',
                }}
              >
                {t.nav_all_categories}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* ===== Mobile Menu ===== */}
      {mobileOpen && (
        <div className="md:hidden bg-white animate-slide-down" style={{ borderTop: '1px solid #E2E8F0' }}>
          <div className="container-custom py-4 space-y-1">
            {/* Mobile Language Switcher */}
            <div className="py-2 px-2 mb-2" style={{ borderBottom: '1px solid #E2E8F0' }}>
              <LanguageSwitcher variant="compact" direction="down" />
            </div>

            <Link
              href="/products"
              className="block py-2.5 px-2 text-sm font-medium rounded-lg transition-colors"
              style={{ color: '#1F2A44' }}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDF5FB'; e.currentTarget.style.color = '#0F4C81' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1F2A44' }}
            >
              {t.nav_all_products}
            </Link>
            {categories.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="block py-2.5 px-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: '#1F2A44' }}
                  onClick={() => setMobileOpen(false)}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDF5FB'; e.currentTarget.style.color = '#0F4C81' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1F2A44' }}
                >
                  {getCategoryName(cat.name, lang)}
                </Link>
                {cat.children.length > 0 && (
                  <div className="pl-4 space-y-0">
                    {cat.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/categories/${child.slug}`}
                        className="block py-2 px-2 text-sm rounded-lg transition-colors"
                        style={{ color: '#64748B' }}
                        onClick={() => setMobileOpen(false)}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDF5FB'; e.currentTarget.style.color = '#0F4C81' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B' }}
                      >
                        {getCategoryName(child.name, lang)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="my-2" style={{ borderTop: '1px solid #E2E8F0' }} />
            <Link
              href="/categories"
              className="block py-2.5 px-2 text-sm font-medium rounded-lg transition-colors"
              style={{ color: '#1F2A44' }}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDF5FB'; e.currentTarget.style.color = '#0F4C81' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1F2A44' }}
            >
              {t.nav_all_categories}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
