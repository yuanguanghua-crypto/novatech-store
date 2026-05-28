'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ChevronRight,
  Package,
  Shield,
  Truck,
  RefreshCw,
  Headphones,
  Check,
  ExternalLink,
  FileText,
  FlaskConical,
  Gauge,
  Ruler,
  Weight,
  Clock3,
  BookOpen,
  Download,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { formatPrice, formatSpecs, formatNumber, getAvailabilityBadge } from '@/lib/utils'
import { AddToCartButton } from '@/components/store/add-to-cart-button'
import { AddToQuoteButton } from '@/components/store/add-to-quote-button'

interface ProductImage {
  id: string
  url: string
  isPrimary: boolean
}

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    sku: string
    slug: string
    description?: string | null
    metaDesc?: string | null
    metaTitle?: string | null
    sourceUrl?: string | null
    videoUrl?: string | null
    shippingMethods?: Array<{
      method: 'standard' | 'express' | 'freight' | 'pickup'
      cost?: number | string
      estimatedDays?: number | string
      isFree?: boolean
    }> | null
    ourPrice: any
    listPrice?: any
    availability: string
    stockQty?: number
    leadTimeDays?: number | null
    weight?: any
    weightUnit?: string | null
    dimension?: string | null
    currency?: string
    specs?: any
    images: ProductImage[]
    category: { id: string; name: string; slug: string }
    brand?: { id: string; name: string; slug: string } | null
  }
  related: {
    id: string
    name: string
    slug: string
    ourPrice: any
    images: { url: string; isPrimary: boolean }[]
    brand?: { name: string } | null
  }[]
}

function buildApplicationNotes(productName: string, categoryName: string, specText: string) {
  const context = `${productName} ${categoryName} ${specText}`.toLowerCase()
  const notes = ['analytical chemistry', 'routine sample handling', 'quality control']

  if (context.includes('beaker') || context.includes('flask') || context.includes('reaction')) {
    notes.unshift('mixing and reaction setup')
  }
  if (context.includes('distillation') || context.includes('condenser')) {
    notes.unshift('distillation and solvent recovery')
  }
  if (context.includes('filter') || context.includes('filtration')) {
    notes.unshift('filtration and purification')
  }
  if (context.includes('burette') || context.includes('pipette') || context.includes('cylinder') || context.includes('graduation')) {
    notes.unshift('accurate liquid measurement')
  }

  return Array.from(new Set(notes)).slice(0, 5)
}

function buildTechnicalCards(product: ProductDetailClientProps['product'], specs: Array<{ key: string; value: string }>) {
  const weightValue = product.weight ? Number(product.weight) : null
  const leadTimeText =
    typeof product.leadTimeDays === 'number' && product.leadTimeDays > 0
      ? `${product.leadTimeDays} days`
      : product.availability === 'in_stock'
        ? 'Ready to ship'
        : 'Confirm with sales'

  return [
    {
      icon: Package,
      label: 'Availability',
      value: product.availability === 'in_stock' ? 'In stock' : product.availability === 'out_of_stock' ? 'Out of stock' : 'Lead time',
      note: product.stockQty && product.stockQty > 0 ? `${formatNumber(product.stockQty)} units available` : 'Check replenishment status',
    },
    {
      icon: Clock3,
      label: 'Lead time',
      value: leadTimeText,
      note: 'Estimated fulfillment window',
    },
    {
      icon: Weight,
      label: 'Weight',
      value: weightValue ? `${weightValue.toFixed(3)} ${product.weightUnit || 'lbs'}` : 'Not specified',
      note: 'Useful for freight planning',
    },
    {
      icon: Ruler,
      label: 'Dimensions',
      value: product.dimension || 'Not specified',
      note: 'Check fit and packaging',
    },
    {
      icon: FileText,
      label: 'Brand',
      value: product.brand?.name || 'LABPRO',
      note: product.category?.name || 'Laboratory glassware',
    },
    {
      icon: Gauge,
      label: 'Key spec',
      value: specs[0]?.value || 'See full spec table',
      note: specs[0]?.key || 'Specification summary',
    },
  ]
}

function formatShippingMethodLabel(method: string) {
  switch (method) {
    case 'express':
      return 'Express delivery'
    case 'freight':
      return 'Freight'
    case 'pickup':
      return 'Local pickup'
    default:
      return 'Standard shipping'
  }
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('overview')

  const specs = formatSpecs(product.specs as any)
  const availability = getAvailabilityBadge(product.availability)
  const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0]
  const summaryText =
    product.metaDesc ||
    product.description ||
    `Precision laboratory glassware designed for ${product.category.name.toLowerCase()} workflows.`
  const technicalCards = buildTechnicalCards(product, specs)
  const applicationNotes = buildApplicationNotes(product.name, product.category.name, specs.map((spec) => `${spec.key} ${spec.value}`).join(' '))
  const shippingMethods = Array.isArray(product.shippingMethods) ? product.shippingMethods : []

  const ourPrice = parseFloat(product.ourPrice?.toString() || '0')
  const listPrice = parseFloat(product.listPrice?.toString() || '0')
  const discountPercent =
    listPrice > 0 && ourPrice < listPrice ? Math.round(((listPrice - ourPrice) / listPrice) * 100) : 0

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Technical Specifications' },
    { id: 'applications', label: 'Applications & Compatibility' },
    { id: 'shipping', label: 'Shipping & Documents' },
  ]

  return (
    <div className="container-custom py-8">
      <nav className="flex items-center gap-1.5 text-sm mb-6" style={{ color: '#64748B' }}>
        <Link href="/" className="hover:underline transition-colors" style={{ color: '#0F4C81' }}>
          {t.product_home}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:underline transition-colors" style={{ color: '#0F4C81' }}>
          {t.product_products}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/categories/${product.category.slug}`} className="hover:underline transition-colors" style={{ color: '#0F4C81' }}>
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-mono truncate max-w-[220px]" style={{ color: '#1F2A44' }}>
          {product.sku}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <div className="sticky top-24">
            <div
              className="aspect-square rounded-xl overflow-hidden mb-4 relative"
              style={{
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
              }}
            >
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24" style={{ color: '#CBD5E1' }} />
                </div>
              )}
              <div
                className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5"
                style={{ color: '#64748B' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                Hover to zoom
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {product.images.slice(0, 6).map((img, i) => (
                  <div
                    key={img.id}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer transition-all"
                    style={{
                      backgroundColor: '#F1F5F9',
                      border: i === 0 ? '2px solid #0F4C81' : '2px solid transparent',
                    }}
                  >
                    <img src={img.url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain p-1" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#00A8B5' }}>
            {product.category.name}
          </p>

          <h1 className="text-2xl lg:text-3xl font-bold mb-2 font-display" style={{ color: '#1F2A44' }}>
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <p className="text-sm" style={{ color: '#64748B' }}>
              {t.product_sku_label}{' '}
              <span className="font-mono font-medium" style={{ color: '#1F2A44' }}>
                {product.sku}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4"
                    fill={star <= 4 ? '#F59E0B' : 'none'}
                    stroke="#F59E0B"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm" style={{ color: '#64748B' }}>
                4.8 (126)
              </span>
            </div>
          </div>

          <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#F1F5F9' }}>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold" style={{ color: '#1F2A44' }}>
                {formatPrice(product.ourPrice?.toString())}
              </span>
              {listPrice > 0 && (
                <span className="text-lg line-through" style={{ color: '#94A3B8' }}>
                  {formatPrice(product.listPrice.toString())}
                </span>
              )}
              {discountPercent > 0 && (
                <span
                  className="text-sm font-semibold px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
                >
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <div className="mt-2">
              <span
                className={`badge ${
                  availability.color === 'green'
                    ? 'badge-success'
                    : availability.color === 'red'
                      ? 'badge-danger'
                      : 'badge-warning'
                }`}
              >
                {availability.label}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: '#64748B' }}>
            {summaryText}
          </p>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#1F2A44' }}>
              Product Snapshot
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {technicalCards.map((card) => {
                const Icon = card.icon
                return (
                  <div key={card.label} className="rounded-xl p-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EDF5FB' }}>
                        <Icon className="w-4 h-4" style={{ color: '#0F4C81' }} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide" style={{ color: '#94A3B8' }}>
                          {card.label}
                        </p>
                        <p className="text-sm font-semibold" style={{ color: '#1F2A44' }}>
                          {card.value}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                          {card.note}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <AddToCartButton
              productId={product.id}
              sku={product.sku}
              name={product.name}
              price={product.ourPrice}
              imageUrl={primaryImage?.url}
            />
            <AddToQuoteButton
              productId={product.id}
              sku={product.sku}
              name={product.name}
            />
          </div>

          <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4" style={{ color: '#0F4C81' }} />
              <h3 className="text-sm font-semibold" style={{ color: '#1F2A44' }}>
                Reference and Documents
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              {product.sourceUrl ? (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors"
                  style={{ backgroundColor: '#FAFBFC', color: '#1F2A44' }}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Download className="w-4 h-4 flex-shrink-0" style={{ color: '#0F4C81' }} />
                    <span className="truncate">Open product reference</span>
                  </span>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: '#94A3B8' }} />
                </a>
              ) : (
                <div className="rounded-lg px-3 py-2" style={{ backgroundColor: '#FAFBFC', color: '#64748B' }}>
                  No external reference link is currently attached to this product.
                </div>
              )}
              <p style={{ color: '#64748B' }}>
                Need a COA, dimensional drawing, or compliance document? Request it together with your quotation so the sales team can attach the right file set.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 mb-6" style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            {[
              'Premium borosilicate glass 3.3',
              'Designed for laboratory procurement workflows',
              'Chemical and thermal resistance focused',
              'Requestable compliance and reference documents',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: '#64748B' }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#10B981' }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div
            className="grid grid-cols-2 gap-3 text-xs"
            style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', color: '#64748B' }}
          >
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" style={{ color: '#0F4C81' }} />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" style={{ color: '#0F4C81' }} />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" style={{ color: '#0F4C81' }} />
              <span>Easy Returns</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Headphones className="w-4 h-4" style={{ color: '#0F4C81' }} />
              <span>Expert Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex gap-0 mb-6" style={{ borderBottom: '2px solid #E2E8F0' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-6 py-3 text-sm font-medium transition-all duration-200 relative"
              style={{
                color: activeTab === tab.id ? '#0F4C81' : '#64748B',
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0F4C81' }} />
              )}
            </button>
          ))}
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}>
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold mb-4 font-display" style={{ color: '#1F2A44' }}>
                  Product Overview
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                  {summaryText}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FAFBFC' }}>
                  <FlaskConical className="w-5 h-5" style={{ color: '#0F4C81' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#1F2A44' }}>
                      Laboratory-ready design
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      Built for procurement, testing, and repeat use
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FAFBFC' }}>
                  <Truck className="w-5 h-5" style={{ color: '#0F4C81' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#1F2A44' }}>
                      Shipping visibility
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      Lead time, stock and freight cues shown on the page
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#94A3B8' }}>
                  Procurement notes
                </p>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Confirm the exact size, material, interface, and compliance documents before ordering. For lab teams and purchasing departments, this reduces returns and accelerates approval.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && specs.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4 font-display" style={{ color: '#1F2A44' }}>
                {t.product_full_specs}
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  {specs.map(({ key, value }, i) => (
                    <tr key={key} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#FAFBFC' }}>
                      <td className="px-4 py-3 font-medium w-1/3" style={{ color: '#64748B', borderRight: '1px solid #E2E8F0' }}>
                        {key}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#1F2A44' }}>
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold mb-4 font-display" style={{ color: '#1F2A44' }}>
                  Applications & Compatibility
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>
                  This product is suitable for the following laboratory workflows:
                </p>
                <ul className="space-y-2 text-sm" style={{ color: '#64748B' }}>
                  {applicationNotes.map((note) => (
                    <li key={note} className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#94A3B8' }}>
                  Compatibility reminder
                </p>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Please verify dimensions, joint sizes, and material grade against your existing glassware or apparatus before purchase.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold mb-4 font-display" style={{ color: '#1F2A44' }}>
                  Shipping & Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#FAFBFC', border: '1px solid #E2E8F0' }}>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>
                      Stock status
                    </p>
                    <p className="text-sm font-semibold" style={{ color: '#1F2A44' }}>
                      {availability.label}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                      {product.stockQty && product.stockQty > 0 ? `${formatNumber(product.stockQty)} units currently recorded in inventory.` : 'Inventory availability should be confirmed with sales.'}
                    </p>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: '#FAFBFC', border: '1px solid #E2E8F0' }}>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>
                      Lead time
                    </p>
                    <p className="text-sm font-semibold" style={{ color: '#1F2A44' }}>
                      {typeof product.leadTimeDays === 'number' && product.leadTimeDays > 0 ? `${product.leadTimeDays} days` : 'Confirm with sales'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                      Add customs, freight, and document checks for international shipments.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#94A3B8' }}>
                  Reference link
                </p>
                {product.sourceUrl ? (
                  <a
                    href={product.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-medium"
                    style={{ color: '#0F4C81' }}
                  >
                    Open product reference
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <p className="text-sm" style={{ color: '#64748B' }}>
                    Ask sales for the reference sheet, dimensional drawing, or certificate pack when you request a quote.
                  </p>
                )}
              </div>

              {shippingMethods.length > 0 && (
                <div className="rounded-lg p-4" style={{ backgroundColor: '#FAFBFC', border: '1px solid #E2E8F0' }}>
                  <p className="text-xs uppercase tracking-wide mb-3" style={{ color: '#94A3B8' }}>
                    Shipping methods
                  </p>
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <div key={method.method} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2" style={{ backgroundColor: '#FFFFFF' }}>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#1F2A44' }}>
                            {formatShippingMethodLabel(method.method)}
                          </p>
                          <p className="text-xs" style={{ color: '#64748B' }}>
                            {method.isFree ? 'Free shipping available' : `Cost: ${formatPrice(method.cost as any)}`}
                          </p>
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#0F4C81' }}>
                          {method.estimatedDays ? `${method.estimatedDays} days` : 'Confirm timing'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.videoUrl && (
                <div className="rounded-lg p-4" style={{ backgroundColor: '#FAFBFC', border: '1px solid #E2E8F0' }}>
                  <p className="text-xs uppercase tracking-wide mb-3" style={{ color: '#94A3B8' }}>
                    Product video
                  </p>
                  <video src={product.videoUrl} controls className="w-full rounded-lg bg-black" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 font-display" style={{ color: '#1F2A44' }}>
            {t.product_related}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ border: '1px solid #E2E8F0' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#B0D4ED'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,76,129,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="aspect-square overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                  {p.images[0] ? (
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-10 h-10" style={{ color: '#CBD5E1' }} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2 mt-1 transition-colors" style={{ color: '#1F2A44' }}>
                    {p.name}
                  </p>
                  <p className="font-bold mt-2" style={{ color: '#1F2A44' }}>
                    {formatPrice(p.ourPrice?.toString())}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
