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
 * Generate contextual FAQs based on product attributes.
 * These questions are tuned for laboratory glassware procurement.
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

  const material = specs.Material || specs.材质 || specs.material || null
  const capacity = specs.Capacity || specs.容量 || specs.capacity || null
  const volume = specs.Volume || specs.体积 || specs.volume || null
  const jointSize = specs['Joint Size'] || specs.接口尺寸 || specs.joint_size || null
  const standard = specs.Standard || specs.标准 || specs.standard || null
  const graduation = specs.Graduation || specs.刻度 || specs.graduation || null

  const productContext = [
    productName,
    category || '',
    material || '',
    capacity || '',
    volume || '',
    jointSize || '',
  ]
    .join(' ')
    .toLowerCase()

  const useCases: string[] = ['sample preparation', 'routine lab workflows', 'quality control']
  if (productContext.includes('burette') || productContext.includes('pipette') || productContext.includes('cylinder') || graduation) {
    useCases.unshift('accurate liquid measurement', 'titration')
  }
  if (productContext.includes('flask') || productContext.includes('beaker') || productContext.includes('reaction')) {
    useCases.unshift('mixing and reaction setup')
  }
  if (productContext.includes('distillation') || productContext.includes('condenser') || jointSize) {
    useCases.unshift('distillation and solvent recovery')
  }
  if (productContext.includes('filter') || productContext.includes('filtration')) {
    useCases.unshift('filtration and purification')
  }
  if (useCases.length < 4) {
    useCases.push('education and research', 'analytical chemistry')
  }

  const uniqueUseCases = Array.from(new Set(useCases)).slice(0, 5)

  const availabilityText =
    availability === 'in_stock'
      ? 'This product is typically in stock and ships within 3-7 business days.'
      : availability === 'out_of_stock'
        ? 'This product is currently out of stock. Please contact us for availability and estimated restocking time.'
        : 'This product may require a lead time. Contact us for specific delivery estimates.'

  const specsList = Object.entries(specs)
    .filter(([_, v]) => v && String(v).length > 0 && String(v).length < 100)
    .slice(0, 4)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ')

  const standardsLine = [
    standard ? `standard: ${standard}` : null,
    material ? `material: ${material}` : null,
    graduation ? `graduation: ${graduation}` : null,
  ]
    .filter(Boolean)
    .join('; ')

  return [
    {
      question: `What is ${productName} used for?`,
      answer: `${productName} (SKU: ${sku}) is a laboratory product${brand ? ` from ${brand}` : ''}. It is commonly used for ${uniqueUseCases.join(', ')}. ${specsList ? `Key specifications include ${specsList}.` : 'Please review the full specifications below.'} ${availabilityText}`,
    },
    {
      question: `What should I check before ordering ${productName}?`,
      answer: `Before ordering ${productName}, confirm the fit-critical details for your lab setup: ${[
        capacity ? `capacity ${capacity}` : null,
        volume ? `volume ${volume}` : null,
        jointSize ? `joint size ${jointSize}` : null,
        material ? `material ${material}` : null,
      ]
        .filter(Boolean)
        .join(', ') || 'dimensions, material, and compatibility with your workflow'}. ${standardsLine ? `Relevant standards/specs: ${standardsLine}.` : ''} If you need a custom recommendation, our sales team can help match the product to your apparatus.`,
    },
    {
      question: `Is ${productName} compatible with standard lab equipment?`,
      answer: `${productName} is intended for standard laboratory workflows. Compatibility depends on the connection and dimensional details in the specification sheet${jointSize ? `, especially the joint size ${jointSize}` : ''}. ${material ? `It is constructed with ${material} for chemical durability and repeatable use.` : 'Its material and finish are selected for routine lab use.'} Please compare the listed dimensions and interfaces with your existing glassware before ordering.`,
    },
    {
      question: `How do I compare ${productName} with similar models?`,
      answer: `${productName} should be compared on the fit-critical details: ${[
        capacity ? 'capacity' : null,
        volume ? 'volume' : null,
        jointSize ? 'joint size' : null,
        material ? 'material grade' : null,
        standard ? 'standard compliance' : null,
      ]
        .filter(Boolean)
        .join(', ') || 'capacity, dimensions, and material'}. The fastest way to compare is to review the full spec table and confirm which model matches your workflow, not just the headline name.`,
    },
    {
      question: `What is the warranty and delivery time for ${productName}?`,
      answer: `Standard warranty covers ${brand || 'LABPRO'} ${category || 'laboratory glassware'} products for 12 months from delivery date. Delivery: ${availability === 'in_stock' ? '3-7 business days for standard orders. Bulk orders may take 1-3 weeks.' : '1-3 weeks depending on stock availability. Contact us for precise lead times.'} Price: ${price || 'Request a quote for current pricing'}. If you need shipping or document confirmation before purchase, please request a quotation.`,
    },
  ]
}
