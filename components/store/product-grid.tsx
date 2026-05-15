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
    ? 'badge-success'
    : product.availability === 'out_of_stock'
    ? 'badge-danger'
    : 'badge-warning'

  return (
    <Link
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
      <div className="aspect-square overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12" style={{ color: '#CBD5E1' }} />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium line-clamp-2 leading-snug mb-1 transition-colors"
            style={{ color: '#1F2A44' }}
        >
          {product.name}
        </h3>
        <p className="text-xs font-mono mb-3" style={{ color: '#94A3B8' }}>{product.sku}</p>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold" style={{ color: '#1F2A44' }}>
            {formatPrice(product.ourPrice?.toString())}
          </span>
          <span className={`text-xs ${stockClass}`}>
            {stockLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}
