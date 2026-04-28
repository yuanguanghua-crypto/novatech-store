'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'

interface Product {
  id: string
  slug: string
  sku: string
  name: string
  ourPrice: any
  availability: string
  brand: { name: string; slug: string } | null
  images: { url: string }[]
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product}
          index={index}
        />
      ))}
    </div>
  )
}

function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { t } = useI18n()
  const image = product.images?.[0]?.url

  const stockLabel = product.availability === 'in_stock'
    ? t.products_in_stock
    : product.availability === 'out_of_stock'
    ? t.products_out_of_stock
    : product.availability === 'on_order'
    ? t.products_on_order
    : t.products_lead_time

  const stockClass = product.availability === 'in_stock'
    ? 'bg-green-100 text-green-700'
    : product.availability === 'out_of_stock'
    ? 'bg-red-100 text-red-700'
    : 'bg-yellow-100 text-yellow-700'

  return (
    <Link 
      href={`/products/${product.slug}`} 
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden
                 hover:border-blue-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package className="w-12 h-12" />
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {product.brand && (
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
            {product.brand.name}
          </p>
        )}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 font-mono mb-3">{product.sku}</p>
        
        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.ourPrice?.toString())}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockClass}`}>
            {stockLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}
