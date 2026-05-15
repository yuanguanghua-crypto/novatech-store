'use client'

import Link from 'next/link'
import {
  ArrowRight, ShieldCheck, Truck, HeadphonesIcon, Award,
  Package, Droplets, Scale, Microscope, Beaker, Zap,
  FlaskConical, TestTubes, Thermometer, Filter,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { formatPrice } from '@/lib/utils'

// Featured Product Card
interface FeaturedProduct {
  id: string
  slug: string
  name: string
  sku: string
  ourPrice: string | number
  listPrice?: string | number | null
  availability: string
  brand?: { name: string } | null
  category?: { name: string; slug: string } | null
  images: { url: string }[]
}

// Category Card
interface HomeCategory {
  id: string
  name: string
  slug: string
  icon: string
  totalProducts: number
}

interface HomeClientProps {
  featuredProducts: FeaturedProduct[]
  categories: HomeCategory[]
}

// Category icons map
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  beakers: <FlaskConical className="w-7 h-7" />,
  flasks: <Beaker className="w-7 h-7" />,
  cylinders: <TestTubes className="w-7 h-7" />,
  pumps: <Droplets className="w-7 h-7" />,
  thermometers: <Thermometer className="w-7 h-7" />,
  filters: <Filter className="w-7 h-7" />,
  balances: <Scale className="w-7 h-7" />,
  microscopes: <Microscope className="w-7 h-7" />,
  default: <Package className="w-7 h-7" />,
}

function getCategoryIcon(slug: string) {
  if (slug.includes('beaker') || slug.includes('basic')) return CATEGORY_ICONS.beakers
  if (slug.includes('flask') || slug.includes('reaction')) return CATEGORY_ICONS.flasks
  if (slug.includes('cylinder') || slug.includes('analytical')) return CATEGORY_ICONS.cylinders
  if (slug.includes('pump') || slug.includes('metering')) return CATEGORY_ICONS.pumps
  if (slug.includes('distillation')) return CATEGORY_ICONS.thermometers
  if (slug.includes('filtration')) return CATEGORY_ICONS.filters
  if (slug.includes('balance') || slug.includes('storage')) return CATEGORY_ICONS.balances
  if (slug.includes('microscope')) return CATEGORY_ICONS.microscopes
  return CATEGORY_ICONS.default
}

export function HomeClient({ featuredProducts, categories }: HomeClientProps) {
  const { t } = useI18n()

  return (
    <>
      {/* ===== Hero Section - Split View ===== */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#FAFBFC' }}>
        <div className="container-custom py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="animate-slide-up">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
                style={{ backgroundColor: '#EDF5FB' }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#00A8B5' }} />
                <span className="text-sm font-medium" style={{ color: '#0F4C81' }}>Professional Laboratory Glassware</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight font-display mb-6" style={{ color: '#1F2A44', letterSpacing: '-0.02em' }}>
                {t.hero_title || 'Precision Glassware for Every Lab'}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-lg" style={{ color: '#64748B' }}>
                {t.hero_subtitle || 'Premium borosilicate glassware engineered for accuracy, durability, and performance in analytical chemistry and research.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base
                             transition-all duration-200 hover:-translate-y-1 hover:shadow-xl shadow-lg"
                  style={{ backgroundColor: '#0F4C81', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0A3A63'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F4C81'}
                >
                  {t.hero_cta_shop || 'Browse All Products'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 border-2 px-8 py-4 rounded-xl font-bold text-base
                             transition-all duration-200 hover:-translate-y-1"
                  style={{ borderColor: '#E2E8F0', color: '#1F2A44' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0F4C81'; e.currentTarget.style.color = '#0F4C81' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#1F2A44' }}
                >
                  {t.hero_cta_quote || 'Explore System Kits'}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-10">
                {[
                  { icon: ShieldCheck, label: 'ASTM Certified' },
                  { icon: Truck, label: 'Same-Day Shipping' },
                  { icon: Award, label: 'ISO 9001' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
                    <Icon className="w-4 h-4" style={{ color: '#00A8B5' }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Showcase Illustration */}
            <div className="relative animate-fade-in hidden lg:block">
              <div
                className="relative rounded-2xl p-8 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #EDF5FB 0%, #E6FAFB 100%)',
                }}
              >
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-30"
                     style={{ backgroundColor: '#00A8B5' }} />
                <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full opacity-20"
                     style={{ backgroundColor: '#0F4C81' }} />

                {/* Product Illustration */}
                <div className="relative z-10 flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-40 h-40 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                         style={{ backgroundColor: 'white', boxShadow: '0 8px 24px rgba(15,76,129,0.08)' }}>
                      <FlaskConical className="w-20 h-20" style={{ color: '#0F4C81' }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#0F4C81' }}>Premium Borosilicate Glass 3.3</p>
                    <p className="text-xs mt-1" style={{ color: '#64748B' }}>ASTM E438, Type I, Class A</p>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute top-6 left-6 bg-white rounded-xl px-4 py-3 shadow-sm">
                  <div className="text-2xl font-bold" style={{ color: '#0F4C81' }}>67+</div>
                  <div className="text-xs" style={{ color: '#64748B' }}>Products</div>
                </div>
                <div className="absolute bottom-6 right-6 bg-white rounded-xl px-4 py-3 shadow-sm">
                  <div className="text-2xl font-bold" style={{ color: '#00A8B5' }}>4.8</div>
                  <div className="text-xs" style={{ color: '#64748B' }}>Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Category Grid ===== */}
      {categories.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            {/* Section Header */}
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 font-display" style={{ color: '#1F2A44' }}>
                {t.home_categories_title || 'Browse by Category'}
              </h2>
              <p className="max-w-xl mx-auto" style={{ color: '#64748B' }}>
                Browse our comprehensive selection of laboratory glassware
              </p>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center p-6 rounded-xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#B0D4ED'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,76,129,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div
                    className="category-icon-bg w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                  >
                    <span className="icon-text" style={{ color: '#0F4C81' }}>
                      {getCategoryIcon(cat.slug)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-center leading-tight mb-1 transition-colors"
                        style={{ color: '#1F2A44' }}>
                    {cat.name}
                  </span>
                  <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>
                    {cat.totalProducts.toLocaleString()} items
                  </span>
                </Link>
              ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 font-semibold transition-colors"
                style={{ color: '#0F4C81' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0A3A63'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#0F4C81'}
              >
                View All Categories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== Featured Products ===== */}
      {featuredProducts.length > 0 && (
        <section className="section-padding" style={{ backgroundColor: '#FAFBFC' }}>
          <div className="container-custom">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 font-display" style={{ color: '#1F2A44' }}>
                  {t.home_featured_title || 'Best Sellers'}
                </h2>
                <p style={{ color: '#64748B' }}>
                  {t.home_featured_subtitle || 'Professional-grade glassware trusted by labs worldwide'}
                </p>
              </div>
              <Link
                href="/products"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 font-semibold transition-colors"
                style={{ color: '#0F4C81' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0A3A63'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#0F4C81'}
              >
                {t.products_view_all || 'View All'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    border: '1px solid #E2E8F0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#B0D4ED'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,76,129,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: '#F1F5F9' }}>
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16" style={{ color: '#CBD5E1' }} />
                      </div>
                    )}
                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`badge ${
                        product.availability === 'in_stock'
                          ? 'badge-success'
                          : product.availability === 'out_of_stock'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}>
                        {product.availability === 'in_stock' ? 'In Stock' : product.availability === 'out_of_stock' ? 'Out of Stock' : 'On Order'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium line-clamp-2 mb-2 leading-snug transition-colors"
                        style={{ color: '#1F2A44' }}
                    >
                      {product.name}
                    </h3>
                    <div className="text-xs font-mono mb-3" style={{ color: '#94A3B8' }}>SKU: {product.sku}</div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold" style={{ color: '#1F2A44' }}>
                        {formatPrice(Number(product.ourPrice))}
                      </span>
                      {product.listPrice && Number(product.listPrice) > Number(product.ourPrice) && (
                        <span className="text-sm line-through" style={{ color: '#94A3B8' }}>
                          {formatPrice(Number(product.listPrice))}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Trust Badges ===== */}
      <section className="py-12 bg-white" style={{ borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: t.home_trust_quality || 'Quality Assured', desc: t.home_trust_quality_desc || 'ASTM & ISO certified products' },
              { icon: Truck, title: t.home_trust_shipping || 'Fast Shipping', desc: t.home_trust_shipping_desc || 'Same-day dispatch available' },
              { icon: HeadphonesIcon, title: t.home_trust_support || 'Expert Support', desc: t.home_trust_support_desc || 'Technical consultation included' },
              { icon: Award, title: t.home_trust_pricing || 'Fair Pricing', desc: t.home_trust_pricing_desc || 'Factory-direct competitive pricing' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: '#FAFBFC',
                  border: '1px solid #E2E8F0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#B0D4ED'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,76,129,0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #EDF5FB 0%, #E6FAFB 100%)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: '#0F4C81' }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#1F2A44' }}>{title}</div>
                  <div className="text-xs leading-tight" style={{ color: '#64748B' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F4C81 0%, #0A3A63 50%, #00A8B5 100%)' }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#00A8B5' }} />
        </div>

        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display text-white animate-fade-in">
            {t.home_cta_title || 'Need a Custom Configuration?'}
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto animate-fade-in stagger-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {t.home_cta_subtitle || 'Our technical team can design and build custom glassware systems for your specific requirements.'}
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 bg-white px-10 py-4 rounded-xl
                       font-bold text-lg hover:bg-gray-50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl shadow-lg animate-fade-in stagger-2"
            style={{ color: '#0F4C81' }}
          >
            {t.home_cta_button || 'Request a Quote'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ===== Quality Guarantee Section ===== */}
      <section className="section-padding" style={{ backgroundColor: '#FAFBFC' }}>
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 font-display" style={{ color: '#1F2A44' }}>
              LABPRO Quality Guarantee
            </h2>
            <p className="max-w-lg mx-auto" style={{ color: '#64748B' }}>
              Every product is manufactured to the highest standards with rigorous quality control
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: ShieldCheck,
                title: 'Premium Materials',
                desc: 'Borosilicate glass 3.3, FDA-grade materials, and certified components',
                color: '#0F4C81',
                bgColor: '#EDF5FB',
              },
              {
                icon: Award,
                title: 'Factory Direct Pricing',
                desc: 'No middlemen, no markup — professional quality at fair prices',
                color: '#00A8B5',
                bgColor: '#E6FAFB',
              },
              {
                icon: HeadphonesIcon,
                title: 'Expert Support',
                desc: 'Technical consultation, product training, and after-sales service',
                color: '#0F4C81',
                bgColor: '#EDF5FB',
              },
            ].map(({ icon: Icon, title, desc, color, bgColor }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg"
                style={{ border: '1px solid #E2E8F0' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: bgColor }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#1F2A44' }}>{title}</h3>
                <p className="text-sm" style={{ color: '#64748B' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
