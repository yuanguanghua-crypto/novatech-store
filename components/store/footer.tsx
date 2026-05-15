'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { getCategoryName } from '@/lib/i18n/category-translations'

export function Footer() {
  const { t, locale } = useI18n()

  const productLinks = [
    ['Basic Glassware', '/categories/basic-glassware'],
    ['Analytical Glassware', '/categories/analytical-glassware'],
    ['Reaction Systems', '/categories/reaction-systems'],
    ['Distillation Systems', '/categories/distillation-systems'],
    ['Filtration Systems', '/categories/filtration-systems'],
    ['Storage Systems', '/categories/storage-systems'],
  ]

  const systemLinks = [
    ['Complete Distillation Kit', '/categories/distillation-systems'],
    ['Filtration Assembly', '/categories/filtration-systems'],
    ['Reaction Setup', '/categories/reaction-systems'],
    ['Storage Solution', '/categories/storage-systems'],
    ['Custom Configurations', '/quote'],
  ]

  const supportLinks = [
    [t.footer_request_quote, '/quote'],
    [t.footer_bulk_orders, '/quote?type=bulk'],
    [t.footer_technical_support, '/support'],
    [t.footer_returns_refunds, '/returns'],
    [t.footer_shipping_policy, '/shipping'],
  ]

  const resourceLinks = [
    ['Knowledge Base', '/knowledge'],
    ['Product Guides', '/knowledge/how-to-choose/laboratory-glassware'],
    ['Material Comparison', '/knowledge/compare/borosilicate-vs-soda-lime'],
    ['Care Instructions', '/knowledge/how-to-use/glassware-care'],
  ]

  const accountLinks = [
    [t.footer_sign_in, '/auth/login'],
    [t.footer_create_account, '/auth/register'],
    [t.footer_my_orders, '/account/orders'],
  ]

  return (
    <footer style={{ backgroundColor: '#061A30', color: '#94A3B8' }}>
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand Info (wider) */}
          <div className="lg:col-span-1.5">
            <div className="mb-5">
              <img src="/logo.png" alt="LABPRO" className="h-10 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#94A3B8' }}>
              Professional laboratory borosilicate glassware supplier. Precision instruments for analytical chemistry, research labs, and industrial QC.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#00A8B5' }} />
                <span>+1 (800) 000-0000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#00A8B5' }} />
                <a href="mailto:sales@labprostore.com" className="hover:text-white transition-colors">
                  sales@labprostore.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#00A8B5' }} />
                <span>United States</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {['facebook', 'twitter', 'linkedin', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F4C81'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  aria-label={social}
                >
                  <SocialIcon name={social} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h3 className="font-semibold text-white mb-4 font-display text-sm">{t.footer_products_col}</h3>
            <ul className="space-y-2.5 text-sm">
              {productLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors duration-200">
                    {getCategoryName(name, locale)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="font-medium transition-colors duration-200" style={{ color: '#00A8B5' }}>
                  {t.footer_all_products} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: System Solutions */}
          <div>
            <h3 className="font-semibold text-white mb-4 font-display text-sm">System Solutions</h3>
            <ul className="space-y-2.5 text-sm">
              {systemLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors duration-200">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="font-semibold text-white mb-4 font-display text-sm">{t.footer_services_col}</h3>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors duration-200">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Resources + Account */}
          <div>
            <h3 className="font-semibold text-white mb-4 font-display text-sm">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              {resourceLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors duration-200">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-white mt-6 mb-3 font-display text-sm">{t.footer_account_col}</h3>
            <ul className="space-y-2.5 text-sm">
              {accountLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors duration-200">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container-custom py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm" style={{ color: '#64748B' }}>
          <p>© {new Date().getFullYear()} LABPRO. {t.footer_rights}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">{t.footer_privacy}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t.footer_terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Simple SVG Social Icons
function SocialIcon({ name }: { name: string }) {
  const iconProps = { width: 16, height: 16, fill: 'currentColor', color: 'white' }
  switch (name) {
    case 'facebook':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      )
    case 'twitter':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#061A30"/>
        </svg>
      )
    default:
      return null
  }
}
