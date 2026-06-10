'use client'

import Link from 'next/link'
import { ChevronRight, Package } from 'lucide-react'
import { VariantSelector } from './variant-selector'
import { SpecTable } from './spec-table'
import { StockBadge } from './stock-badge'
import { SiblingNav } from './sibling-nav'
import { AddToCartButton } from '@/components/store/add-to-cart-button'
import { AddToQuoteButton } from '@/components/store/add-to-quote-button'
import { formatPrice } from '@/lib/utils'

interface Spec { label: string; value: string }
interface SiblingVariant {
  variantId: string; slug: string; volumeMl: number | null
  materialFamily: string | null; price: number
}

interface ProductDetailV2Props {
  variant: {
    id: string; slug: string; name: string; sku: string
    description: string; price: number; specs: Spec[]
    stockHouston: number; stockChina: number
    volumeMl?: number | null; materialFamily?: string | null; wallType?: string | null
  }
  spu: { id: string; name: string; categoryName: string; categorySlug: string }
  siblingVariants: SiblingVariant[]
}

export function ProductDetailV2({ variant, spu, siblingVariants }: ProductDetailV2Props) {
  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: '#64748B' }}>
        <Link href="/products" className="hover:underline">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/categories/${spu.categorySlug}`} className="hover:underline">{spu.categoryName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span style={{ color: '#1F2A44' }}>{variant.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image placeholder */}
        <div className="aspect-square rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0' }}>
          <Package className="w-24 h-24" style={{ color: '#CBD5E1' }} />
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#0F4C81' }}>
              {spu.categoryName}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: '#1F2A44' }}>
              {variant.name}
            </h1>
            <div className="text-xs mt-1 font-mono" style={{ color: '#94A3B8' }}>
              SKU: {variant.sku}
            </div>
          </div>

          {/* Variant Selector */}
          <VariantSelector siblings={siblingVariants} currentSlug={variant.slug} />

          {/* Price */}
          <div className="text-3xl font-bold" style={{ color: '#1F2A44' }}>
            {formatPrice(variant.price)}
          </div>

          {/* Stock */}
          <StockBadge houston={variant.stockHouston} china={variant.stockChina} />

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <AddToCartButton
              productId={variant.id}
              sku={variant.sku}
              name={variant.name}
              price={variant.price}
            />
            <AddToQuoteButton
              productId={variant.id}
              sku={variant.sku}
              name={variant.name}
            />
          </div>
        </div>
      </div>

      {/* Specs + Siblings */}
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <SpecTable specs={variant.specs} />
        <SiblingNav siblings={siblingVariants} currentSlug={variant.slug} />
      </div>

      {/* Description */}
      {variant.description && (
        <div className="mt-10 max-w-2xl">
          <h3 className="text-base font-bold mb-3" style={{ color: '#1F2A44' }}>
            Description
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
            {variant.description}
          </p>
        </div>
      )}
    </div>
  )
}
