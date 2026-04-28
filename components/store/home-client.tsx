'use client'

import Link from 'next/link'
import { 
  ArrowRight, ShieldCheck, Truck, HeadphonesIcon, Award,
  Package, Droplets, Scale, Microscope, Beaker, Zap
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
  pumps: <Droplets className="w-8 h-8" />,
  analyzers: <Beaker className="w-8 h-8" />,
  balances: <Scale className="w-8 h-8" />,
  instruments: <Microscope className="w-8 h-8" />,
  supplies: <Package className="w-8 h-8" />,
  default: <Zap className="w-8 h-8" />,
}

function getCategoryIcon(slug: string) {
  if (slug.includes('pump')) return CATEGORY_ICONS.pumps
  if (slug.includes('analyzer') || slug.includes('ph') || slug.includes('orp')) return CATEGORY_ICONS.analyzers
  if (slug.includes('balance')) return CATEGORY_ICONS.balances
  if (slug.includes('microscope')) return CATEGORY_ICONS.instruments
  if (slug.includes('supply') || slug.includes('tube') || slug.includes('vial')) return CATEGORY_ICONS.supplies
  return CATEGORY_ICONS.default
}

export function HomeClient({ featuredProducts, categories }: HomeClientProps) {
  const { t } = useI18n()

  return (
    <>
      {/* ===== Hero Section - Full Width, Centered Content ===== */}
      <section className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(6,182,212,0.3) 0%, transparent 50%)` 
          }} />
        </div>
        
        <div className="container relative z-10 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-white/90">Trusted by 5,000+ Laboratories Worldwide</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-display animate-slide-up">
              {t.hero_title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-brand-100 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-1">
              {t.hero_subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up stagger-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-xl
                           font-bold text-base hover:bg-brand-50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl shadow-lg"
              >
                {t.hero_cta_shop}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 border-2 border-white/50 text-white px-8 py-4 rounded-xl
                           font-bold text-base hover:bg-white/10 transition-all duration-200 hover:-translate-y-1"
              >
                {t.hero_cta_quote}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ===== Stats Section ===== */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '15,000+', label: 'Products Available' },
              { number: '50+', label: 'Trusted Brands' },
              { number: '24/7', label: 'Technical Support' },
              { number: '99%', label: 'Customer Satisfaction' },
            ].map(({ number, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-600 font-display mb-1">{number}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Trust Badges ===== */}
      <section className="py-10 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: t.home_trust_quality, desc: t.home_trust_quality_desc },
              { icon: Truck, title: t.home_trust_shipping, desc: t.home_trust_shipping_desc },
              { icon: HeadphonesIcon, title: t.home_trust_support, desc: t.home_trust_support_desc },
              { icon: Award, title: t.home_trust_pricing, desc: t.home_trust_pricing_desc },
            ].map(({ icon: Icon, title, desc }) => (
              <div 
                key={title} 
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 
                           hover:border-brand-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{title}</div>
                  <div className="text-xs text-gray-500 leading-tight">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Category Grid ===== */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            {/* Section Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display">{t.home_categories_title}</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Browse our comprehensive selection of laboratory and industrial equipment</p>
            </div>
            
            {/* Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center p-6 bg-white rounded-2xl border-2 border-gray-100
                             hover:border-brand-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center mb-3
                                  text-brand-600 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-brand-100 group-hover:to-brand-200 transition-all duration-300">
                    {getCategoryIcon(cat.slug)}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 leading-tight mb-1 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {cat.totalProducts.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
            
            {/* View All Link */}
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold transition-colors"
              >
                View All Categories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== Featured Products ===== */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display">{t.home_featured_title}</h2>
                <p className="text-gray-500">{t.home_featured_subtitle}</p>
              </div>
              <Link
                href="/products"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold transition-colors"
              >
                {t.products_view_all} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-2xl border-2 border-gray-100 overflow-hidden
                             hover:border-brand-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold ${
                        product.availability === 'in_stock'
                          ? 'bg-green-100 text-green-700'
                          : product.availability === 'out_of_stock'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.availability === 'in_stock' ? 'In Stock' : product.availability === 'out_of_stock' ? 'Out of Stock' : 'On Order'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-5">
                    {product.brand && (
                      <div className="text-xs text-brand-600 font-bold uppercase tracking-wider mb-2">{product.brand.name}</div>
                    )}
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug mb-2">
                      {product.name}
                    </h3>
                    <div className="text-xs text-gray-400 font-mono mb-3">SKU: {product.sku}</div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(Number(product.ourPrice))}
                      </span>
                      {product.listPrice && Number(product.listPrice) > Number(product.ourPrice) && (
                        <span className="text-sm text-gray-400 line-through">
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

      {/* ===== CTA Banner ===== */}
      <section className="py-20 bg-gradient-to-r from-brand-600 via-brand-700 to-accent-500 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display animate-fade-in">{t.home_cta_title}</h2>
          <p className="text-brand-100 mb-10 max-w-xl mx-auto text-lg animate-fade-in stagger-1">{t.home_cta_subtitle}</p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-10 py-4 rounded-xl
                       font-bold text-lg hover:bg-brand-50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl shadow-lg animate-fade-in stagger-2"
          >
            {t.home_cta_button}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ===== Brands Showcase ===== */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Trusted Brands</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {['Pulsafeeder', 'LMI', 'Lovibond', 'Hach', 'Ohaus', 'Mettler Toledo'].map((brand) => (
              <div key={brand} className="text-xl font-bold text-gray-400 hover:text-brand-600 transition-colors cursor-default">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
