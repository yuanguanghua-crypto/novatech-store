'use client'

import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { getCategoryName } from '@/lib/i18n/category-translations'

export function Footer() {
  const { t, locale } = useI18n()

  const productLinks = [
    ['Diaphragm Metering Pumps', '/categories/diaphragm-metering-pumps'],
    ['pH & ORP Controllers', '/categories/ph-orp-controllers'],
    ['Precision Balances', '/categories/precision-balances'],
    ['Autoclaves', '/categories/autoclaves'],
    ['Compound Microscopes', '/categories/compound-microscopes'],
  ]

  const serviceLinks = [
    [t.footer_request_quote, '/quote'],
    [t.footer_bulk_orders, '/quote?type=bulk'],
    [t.footer_technical_support, '/support'],
    [t.footer_returns_refunds, '/returns'],
    [t.footer_shipping_policy, '/shipping'],
  ]

  const accountLinks = [
    [t.footer_sign_in, '/auth/login'],
    [t.footer_create_account, '/auth/register'],
    [t.footer_my_orders, '/account/orders'],
    [t.footer_my_quotes, '/account/quotes'],
    [t.footer_address_book, '/account/addresses'],
  ]

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="Novatech" className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed">
              {t.footer_description}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (800) 000-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:sales@novatechstore.com" className="hover:text-white">
                  sales@novatechstore.com
                </a>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer_products_col}</h3>
            <ul className="space-y-2 text-sm">
              {productLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {getCategoryName(name, locale)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  {t.footer_all_products}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer_services_col}</h3>
            <ul className="space-y-2 text-sm">
              {serviceLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer_account_col}</h3>
            <ul className="space-y-2 text-sm">
              {accountLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} LabProGlobal. {t.footer_rights}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300">{t.footer_privacy}</Link>
            <Link href="/terms" className="hover:text-gray-300">{t.footer_terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
