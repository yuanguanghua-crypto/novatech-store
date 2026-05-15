'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart, FileText,
  Users, Truck, BarChart2, Settings, LogOut, ChevronRight
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useAdminI18n } from './admin-i18n-provider'

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useAdminI18n()

  const NAV_ITEMS = [
    { href: '/admin', labelKey: 'nav_dashboard' as const, icon: LayoutDashboard, exact: true },
    { href: '/admin/products', labelKey: 'nav_products' as const, icon: Package },
    { href: '/admin/orders', labelKey: 'nav_orders' as const, icon: ShoppingCart },
    { href: '/admin/quotes', labelKey: 'nav_quotes' as const, icon: FileText },
    { href: '/admin/customers', labelKey: 'nav_customers' as const, icon: Users },
    { href: '/admin/suppliers', labelKey: 'nav_brands' as const, icon: Truck },
    { href: '/admin/analytics', labelKey: 'nav_analytics' as const, icon: BarChart2 },
    { href: '/admin/settings', labelKey: 'nav_settings' as const, icon: Settings },
  ]

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/logo.svg" alt="NovaTech" className="h-7 w-auto" />
          <div>
            <p className="font-bold text-sm text-gray-900">NovaTech</p>
            <p className="text-xs text-gray-400">{t.nav_admin_panel}</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {t[item.labelKey]}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-200">
        <Link href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
          <ChevronRight className="w-4 h-4" />
          {t.nav_view_store}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          {t.nav_sign_out}
        </button>
      </div>
    </aside>
  )
}
