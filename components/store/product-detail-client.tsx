'use client'

import Link from 'next/link'
import { ChevronRight, Package, Shield, Truck, RefreshCw, Headphones } from 'lucide-react'
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

  // Calculate discount percentage dynamically
  const ourPrice = parseFloat(product.ourPrice?.toString() || '0')
  const listPrice = parseFloat(product.listPrice?.toString() || '0')
  const discountPercent = listPrice > 0 && ourPrice < listPrice
    ? Math.round(((listPrice - ourPrice) / listPrice) * 100)
    : 0

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">{t.product_home}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-blue-600 transition-colors">{t.product_products}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/categories/${product.category.slug}`} className="hover:text-blue-600 transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium font-mono truncate max-w-[200px]">{product.sku}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-200 shadow-sm">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package className="w-20 h-20" />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((img, i) => (
                <div
                  key={img.id}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    i === 0 ? 'border-blue-500 shadow-sm' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img.url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain p-1" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Product Name */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 mb-2 font-display">{product.name}</h1>
          
          {/* SKU */}
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
            {listPrice > 0 && (
              <span className="ml-3 text-lg text-gray-400 line-through">
                {formatPrice(product.listPrice.toString())}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="ml-2 text-sm text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Quick Specs Preview */}
          {specs.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.product_key_specs}</h3>
              <div className="grid grid-cols-2 gap-3">
                {specs.slice(0, 6).map(({ key, value }) => (
                  <div key={key} className="bg-white rounded-lg p-2.5 border border-gray-100">
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
              price={product.ourPrice}
              imageUrl={primaryImage?.url}
            />
            <AddToQuoteButton
              productId={product.id}
              sku={product.sku}
              name={product.name}
            />
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-500 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-500" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <span>Easy Returns</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-blue-500" />
              <span>Expert Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Specs Table */}
      {specs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">{t.product_full_specs}</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">{t.product_related}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="card-hover group">
                <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
                  {p.images[0] ? (
                    <img 
                      src={p.images[0].url} 
                      alt={p.name} 
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 mt-1 transition-colors">{p.name}</p>
                  <p className="font-bold text-gray-900 mt-2">{formatPrice(p.ourPrice?.toString())}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
