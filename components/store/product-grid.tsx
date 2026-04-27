'use client'

import Link from 'next/link'
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
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
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
    ? 'bg-red-100 text-red-600'
    : 'bg-yellow-100 text-yellow-700'

  return (
    <Link href={`/products/${product.slug}`} className="card-hover group overflow-hidden">
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            📦
          </div>
        )}
      </div>
      <div className="p-3">
        {product.brand && (
          <p className="text-xs text-brand-600 font-semibold uppercase tracking-wide mb-1">
            {product.brand.name}
          </p>
        )}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-brand-700 leading-snug mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 font-mono mb-2">{product.sku}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900 text-sm">
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
