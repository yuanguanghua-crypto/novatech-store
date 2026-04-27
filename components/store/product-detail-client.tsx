'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
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

  const specs = formatSpecs(product.specs as any)
  const availability = getAvailabilityBadge(product.availability)
  const primaryImage = product.images.find(i => i.isPrimary) || product.images[0]

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-700">{t.product_home}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-brand-700">{t.product_products}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/categories/${product.category.slug}`} className="hover:text-brand-700">
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.sku}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3 border border-gray-200">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">
                📦
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((img, i) => (
                <div
                  key={img.id}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 cursor-pointer
                             ${i === 0 ? 'border-brand-500' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img.url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain p-1" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.brand && (
            <Link href={`/brands/${product.brand.slug}`} className="text-sm font-semibold text-brand-600 uppercase tracking-wide hover:text-brand-800">
              {product.brand.name}
            </Link>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {t.product_sku_label} <span className="font-mono font-medium text-gray-700">{product.sku}</span>
          </p>

          {/* Availability Badge */}
          <div className="mb-4">
            <span className={`badge badge-${availability.color}`}>{availability.label}</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.ourPrice?.toString())}
            </span>
            {product.listPrice && parseFloat(product.listPrice.toString()) > 0 && (
              <span className="ml-3 text-lg text-gray-400 line-through">
                {formatPrice(product.listPrice.toString())}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Quick Specs Preview */}
          {specs.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.product_key_specs}</h3>
              <div className="grid grid-cols-2 gap-2">
                {specs.slice(0, 6).map(({ key, value }) => (
                  <div key={key}>
                    <dt className="text-xs text-gray-500">{key}</dt>
                    <dd className="text-sm font-medium text-gray-800">{value}</dd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <AddToCartButton
              productId={product.id}
              sku={product.sku}
              name={product.name}
              price={parseFloat(product.ourPrice.toString())}
              imageUrl={primaryImage?.url}
            />
            <AddToQuoteButton
              productId={product.id}
              sku={product.sku}
              name={product.name}
            />
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-t border-gray-200 pt-4">
            <span>{t.product_secure_payment}</span>
            <span>{t.product_fast_shipping}</span>
            <span>{t.product_returns}</span>
            <span>{t.product_expert_support}</span>
          </div>
        </div>
      </div>

      {/* Full Specs Table */}
      {specs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.product_full_specs}</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {specs.map(({ key, value }, i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-gray-600 w-1/3 border-r border-gray-100">{key}</td>
                    <td className="px-4 py-3 text-gray-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.product_related}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="card-hover group">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-brand-600 font-medium">{p.brand?.name}</p>
                  <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-brand-700">{p.name}</p>
                  <p className="font-semibold text-gray-900 mt-1">{formatPrice(p.ourPrice?.toString())}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
