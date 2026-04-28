'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, HeadphonesIcon, Award } from 'lucide-react'
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

export function HomeClient({ featuredProducts, categories }: HomeClientProps) {
  const { t } = useI18n()

  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        />
        <div className="container-custom relative py-20 lg:py-28">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight font-display">
              {t.hero_title}
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              {t.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-lg
                           font-semibold hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
              >
                {t.hero_cta_shop}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg
                           font-semibold hover:bg-white hover:text-blue-700 transition-all duration-200 hover:-translate-y-0.5"
              >
                {t.hero_cta_quote}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trust Badges ===== */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: t.home_trust_quality, desc: t.home_trust_quality_desc },
              { icon: Truck, title: t.home_trust_shipping, desc: t.home_trust_shipping_desc },
              { icon: HeadphonesIcon, title: t.home_trust_support, desc: t.home_trust_support_desc },
              { icon: Award, title: t.home_trust_pricing, desc: t.home_trust_pricing_desc },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{title}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Category Grid ===== */}
      {categories.length > 0 && (
        <section className="py-12">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">{t.home_categories_title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200
                             hover:border-blue-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-center"
                >
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 font-mono">
                    {cat.totalProducts.toLocaleString()} products
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Featured Products ===== */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-display">{t.home_featured_title}</h2>
                <p className="text-gray-500 text-sm mt-1">{t.home_featured_subtitle}</p>
              </div>
              <Link
                href="/products"
                className="hidden md:flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {t.products_view_all} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden
                             hover:border-blue-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📦</div>
                    )}
                  </div>
                  {/* Product Info */}
                  <div className="p-4">
                    {product.brand && (
                      <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">{product.brand.name}</div>
                    )}
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="text-xs text-gray-400 mt-1 font-mono">{t.products_sku}: {product.sku}</div>
                    {/* Price */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(Number(product.ourPrice))}
                      </span>
                      {product.listPrice && Number(product.listPrice) > Number(product.ourPrice) && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(Number(product.listPrice))}
                        </span>
                      )}
                    </div>
                    {/* Availability Badge */}
                    <div className="mt-2">
                      <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                        product.availability === 'in_stock'
                          ? 'bg-green-100 text-green-700'
                          : product.availability === 'out_of_stock'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.availability === 'in_stock'
                          ? t.products_in_stock
                          : product.availability === 'out_of_stock'
                          ? t.products_out_of_stock
                          : t.products_lead_time}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA Banner ===== */}
      <section className="py-16 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4 font-display">{t.home_cta_title}</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">{t.home_cta_subtitle}</p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-lg
                       font-semibold hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
          >
            {t.home_cta_button}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
