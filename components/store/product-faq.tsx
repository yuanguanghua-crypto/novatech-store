'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export interface ProductFAQItem {
  question: string
  answer: string
}

interface ProductFAQProps {
  faqs: ProductFAQItem[]
  productName?: string
}

export function ProductFAQ({ faqs, productName }: ProductFAQProps) {
  const { t } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6 font-display" style={{ color: 'var(--text-primary)' }}>
        {productName ? `Frequently Asked Questions about ${productName}` : t.faq_title}
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden transition-all duration-200"
            style={{ border: '1px solid var(--surface-200)' }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-50"
              aria-expanded={openIndex === index}
            >
              <span className="font-medium pr-4 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {faq.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                style={{ color: 'var(--text-tertiary)' }}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5">
                <p className="text-sm leading-relaxed pt-4" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--surface-100)' }}>
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Generate contextual FAQs based on product attributes
 * This provides AI-citable structured Q&A content
 */
export function generateProductFAQs(params: {
  productName: string
  sku: string
  brand?: string | null
  category?: string | null
  availability?: string
  specs?: Record<string, string>
  price?: string
}): ProductFAQItem[] {
  const { productName, sku, brand, category, availability, specs = {}, price } = params

  const accuracy = specs['Accuracy'] || specs['精度'] || specs['accuracy'] || null
  const range = specs['Range'] || specs['测量范围'] || specs['range'] || null
  const material = specs['Material'] || specs['材质'] || null
  const pressure = specs['Pressure'] || specs['压力'] || specs['pressure'] || null

  const availabilityText = availability === 'in_stock'
    ? 'This product is typically in stock and ships within 3-7 business days.'
    : availability === 'out_of_stock'
    ? 'This product is currently out of stock. Please contact us for availability and estimated restocking time.'
    : 'This product may require a lead time. Contact us for specific delivery estimates.'

  const specsList = Object.entries(specs)
    .filter(([_, v]) => v && String(v).length > 0 && String(v).length < 100)
    .slice(0, 4)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ')

  return [
    {
      question: `What is ${productName} used for?`,
      answer: `${productName} (SKU: ${sku}) is a ${category || 'industrial'} product${
        brand ? ` from ${brand}` : ''
      }. It is used in industrial water treatment, laboratory analysis, environmental monitoring, and manufacturing quality control applications. Key specifications include: ${specsList || 'see full specifications below'}. ${availabilityText}`,
    },
    {
      question: `What is the measurement accuracy of ${productName}?`,
      answer: accuracy
        ? `The ${productName} offers ${accuracy} measurement accuracy. This precision makes it suitable for ${category || 'industrial monitoring'} applications where reliable data is critical. For detailed calibration procedures, refer to the product manual or contact our technical support team.`
        : `The ${productName} features precision engineering consistent with ${brand || 'industrial-grade'} standards. For specific accuracy specifications, please refer to the full specifications table above or contact our technical support team at support@labpro.com.`,
    },
    {
      question: `Is ${productName} suitable for industrial environments?`,
      answer: `${brand || 'LABPRO'} products are designed for industrial-grade applications. ` +
        (pressure ? `The unit supports operating pressures up to ${pressure}. ` : '') +
        (material ? `Constructed with ${material} for chemical and corrosion resistance. ` : '') +
        `Typical operating temperature range: -10°C to 60°C. IP65 or higher protection rating available for harsh environments. For specific environmental requirements, please verify with our technical team before ordering.`,
    },
    {
      question: `What is the difference between ${productName} and similar models?`,
      answer: `${productName} differs from comparable models primarily in its ` +
        `${Object.keys(specs).slice(0, 2).join(' and ').toLowerCase() || 'specifications'}. ` +
        `The ${brand || 'LABPRO'} product line offers various models optimized for different applications: ` +
        `precision laboratory models, standard industrial models, and heavy-duty process models. ` +
        `Compare specifications using our category pages or contact sales for personalized recommendations.`,
    },
    {
      question: `What is the warranty and delivery time for ${productName}?`,
      answer: `Standard warranty covers ${brand || 'LABPRO'} ${category || 'industrial equipment'} products for 12 months from delivery date. ` +
        `Delivery: ${availability === 'in_stock' ? '3-7 business days for standard orders. Bulk orders may take 1-3 weeks.' : '1-3 weeks depending on stock availability. Contact us for precise lead times.'} ` +
        `Price: ${price || 'Request a quote for current pricing'}. All products ship with calibration certificates and user manuals.`,
    },
  ]
}
