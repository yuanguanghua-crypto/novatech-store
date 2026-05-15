'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

interface FAQ {
  question: string
  answer: string
}

interface KnowledgePageProps {
  title: string
  subtitle?: string
  category: string
  icon?: React.ReactNode
  sections: {
    title: string
    content: React.ReactNode
  }[]
  relatedProducts?: {
    name: string
    slug: string
    category: string
  }[]
  faqs?: FAQ[]
}

export function KnowledgePageTemplate({
  title,
  subtitle,
  category,
  icon,
  sections,
  relatedProducts,
  faqs = []
}: KnowledgePageProps) {
  const { t } = useI18n()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-50)' }}>
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-medium rounded-full">
              {category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {icon && <span className="mr-3">{icon}</span>}
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg max-w-3xl" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
          )}
        </div>
      </section>

      {/* Content Sections */}
      <div className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {sections.map((section, idx) => (
              <section key={idx} className="bg-white rounded-xl p-6 md:p-8" style={{ border: '1px solid var(--surface-200)' }}>
                <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {section.title}
                </h2>
                <div className="prose prose-gray max-w-none">
                  {section.content}
                </div>
              </section>
            ))}

            {/* FAQ Section */}
            {faqs.length > 0 && (
              <section className="bg-white rounded-xl p-6 md:p-8" style={{ border: '1px solid var(--surface-200)' }}>
                <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                  {t.faq_title}
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--surface-200)' }}>
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between transition-colors"
                        style={{ backgroundColor: 'var(--surface-50)' }}
                      >
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openFaq === idx && (
                        <div className="px-4 py-3 bg-white text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Navigation */}
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">On This Page</h3>
              <nav className="space-y-2">
                {sections.map((section, idx) => (
                  <a
                    key={idx}
                    href={`#section-${idx}`}
                    className="block text-sm text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
                {faqs.length > 0 && (
                  <a href="#faq" className="block text-sm text-gray-600 hover:text-brand-600 transition-colors">
                    {t.faq_title}
                  </a>
                )}
              </nav>
            </div>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-900 mb-4">{t.products_related_products}</h3>
                <div className="space-y-3">
                  {relatedProducts.map((product, idx) => (
                    <a
                      key={idx}
                      href={`/products/${product.slug}`}
                      className="block p-3 rounded-lg border hover:border-brand-300 hover:bg-brand-50 transition-colors"
                    >
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Need Help */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl p-6 text-white">
              <h3 className="font-bold mb-2">{t.home_support}</h3>
              <p className="text-sm text-brand-100 mb-4">
                Need personalized advice? Our experts are here to help.
              </p>
              <a
                href="/quote"
                className="block w-full text-center bg-white text-brand-700 font-medium py-2 px-4 rounded-lg hover:bg-brand-50 transition-colors"
              >
                {t.nav_get_quote}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
