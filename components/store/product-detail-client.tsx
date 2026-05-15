'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronRight, Package, Shield, Truck, RefreshCw, Headphones, Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { formatPrice, formatSpecs, getAvailabilityBadge } from '@/lib/utils'
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
    ourPrice: any
    listPrice?: any
    availability: string
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

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('overview')

  const specs = formatSpecs(product.specs as any)
  const availability = getAvailabilityBadge(product.availability)
  const primaryImage = product.images.find(i => i.isPrimary) || product.images[0]

  // Calculate discount percentage dynamically
  const ourPrice = parseFloat(product.ourPrice?.toString() || '0')
  const listPrice = parseFloat(product.listPrice?.toString() || '0')
  const discountPercent = listPrice > 0 && ourPrice < listPrice
    ? Math.round(((listPrice - ourPrice) / listPrice) * 100)
    : 0

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Technical Specifications' },
    { id: 'applications', label: 'Applications & Compatibility' },
  ]

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-6" style={{ color: '#64748B' }}>
        <Link href="/" className="hover:underline transition-colors" style={{ color: '#0F4C81' }}>{t.product_home}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:underline transition-colors" style={{ color: '#0F4C81' }}>{t.product_products}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/categories/${product.category.slug}`} className="hover:underline transition-colors" style={{ color: '#0F4C81' }}>
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-mono truncate max-w-[200px]" style={{ color: '#1F2A44' }}>{product.sku}</span>
      </nav>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: Image Gallery (1.2fr) */}
        <div className="lg:col-span-3">
          <div className="sticky top-24">
            {/* Main Image */}
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
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5"
                   style={{ color: '#64748B' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                Hover to zoom
              </div>
            </div>

            {/* Thumbnails */}
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

        {/* Right: Product Info (1fr) */}
        <div className="lg:col-span-2">
          {/* Breadcrumb-style Category */}
          <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#00A8B5' }}>
            {product.category.name}
          </p>

          {/* Product Name */}
          <h1 className="text-2xl lg:text-3xl font-bold mb-2 font-display" style={{ color: '#1F2A44' }}>
            {product.name}
          </h1>

          {/* SKU + Rating */}
          <div className="flex items-center gap-4 mb-4">
            <p className="text-sm" style={{ color: '#64748B' }}>
              {t.product_sku_label} <span className="font-mono font-medium" style={{ color: '#1F2A44' }}>{product.sku}</span>
            </p>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-4 h-4" fill={star <= 4 ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm" style={{ color: '#64748B' }}>4.8 (126)</span>
            </div>
          </div>

          {/* Price Block */}
          <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#F1F5F9' }}>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold" style={{ color: '#1F2A44' }}>
                {formatPrice(product.ourPrice?.toString())}
              </span>
              {listPrice > 0 && (
                <span className="text-lg line-through" style={{ color: '#94A3B8' }}>
                  {formatPrice(product.listPrice.toString())}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-sm font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <div className="mt-2">
              <span className={`badge ${availability.color === 'green' ? 'badge-success' : availability.color === 'red' ? 'badge-danger' : 'badge-warning'}`}>
                {availability.label}
              </span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#64748B' }}>
              {product.description}
            </p>
          )}

          {/* Quick Specs Grid */}
          {specs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#1F2A44' }}>{t.product_key_specs || 'Key Specifications'}</h3>
              <div className="grid grid-cols-3 gap-2">
                {specs.slice(0, 6).map(({ key, value }) => (
                  <div key={key} className="rounded-lg p-2.5" style={{ backgroundColor: '#F1F5F9' }}>
                    <dt className="text-xs" style={{ color: '#94A3B8' }}>{key}</dt>
                    <dd className="text-sm font-medium" style={{ color: '#1F2A44' }}>{value}</dd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
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

          {/* Feature List */}
          <div className="space-y-2.5 mb-6" style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            {[
              'Premium borosilicate glass 3.3',
              'ASTM E438, Type I, Class A certified',
              'Thermal shock resistant',
              'Chemical resistant',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: '#64748B' }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#10B981' }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs" style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', color: '#64748B' }}>
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

      {/* ===== Tabs Section ===== */}
      <div className="mt-12">
        {/* Tab Navigation */}
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

        {/* Tab Content */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}>
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-bold mb-4 font-display" style={{ color: '#1F2A44' }}>Product Overview</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>
                {product.description || `The ${product.name} is a premium laboratory glassware product designed for precision and durability. Manufactured from high-quality borosilicate glass 3.3, it offers excellent chemical resistance and thermal stability.`}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FAFBFC' }}>
                  <Shield className="w-5 h-5" style={{ color: '#0F4C81' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#1F2A44' }}>Quality Certified</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>ASTM & ISO standards</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FAFBFC' }}>
                  <Truck className="w-5 h-5" style={{ color: '#0F4C81' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#1F2A44' }}>Fast Delivery</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>Same-day dispatch</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && specs.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4 font-display" style={{ color: '#1F2A44' }}>{t.product_full_specs}</h3>
              <table className="w-full text-sm">
                <tbody>
                  {specs.map(({ key, value }, i) => (
                    <tr key={key} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#FAFBFC' }}>
                      <td className="px-4 py-3 font-medium w-1/3" style={{ color: '#64748B', borderRight: '1px solid #E2E8F0' }}>{key}</td>
                      <td className="px-4 py-3" style={{ color: '#1F2A44' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'applications' && (
            <div>
              <h3 className="text-lg font-bold mb-4 font-display" style={{ color: '#1F2A44' }}>Applications & Compatibility</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748B' }}>
                This product is suitable for a wide range of laboratory applications including:
              </p>
              <ul className="space-y-2 text-sm" style={{ color: '#64748B' }}>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" style={{ color: '#10B981' }} /> Analytical chemistry</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" style={{ color: '#10B981' }} /> Research laboratories</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" style={{ color: '#10B981' }} /> Quality control testing</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" style={{ color: '#10B981' }} /> Educational institutions</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" style={{ color: '#10B981' }} /> Industrial QC</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ===== Related Products ===== */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 font-display" style={{ color: '#1F2A44' }}>{t.product_related}</h2>
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
                  <p className="text-sm font-medium line-clamp-2 mt-1 transition-colors"
                     style={{ color: '#1F2A44' }}>
                    {p.name}
                  </p>
                  <p className="font-bold mt-2" style={{ color: '#1F2A44' }}>{formatPrice(p.ourPrice?.toString())}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
