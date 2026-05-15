'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
}

interface Brand {
  id: string
  name: string
  slug: string
}

interface Product {
  id?: string
  sku: string
  name: string
  slug?: string
  description: string
  categoryId: string
  brandId: string
  ourPrice: number
  listPrice: number
  costPrice: number
  currency: string
  availability: string
  stockQty: number
  leadTimeDays: number
  weight: number
  weightUnit: string
  dimension: string
  specs: Record<string, string>
  sourceUrl: string
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  images: Array<{ id?: string; url: string; altText: string; isPrimary: boolean }>
}

interface Props {
  product?: Product
  mode: 'create' | 'edit'
}

export function ProductForm({ product, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')

  const [form, setForm] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    description: product?.description || '',
    categoryId: product?.categoryId || '',
    brandId: product?.brandId || '',
    ourPrice: product?.ourPrice || '',
    listPrice: product?.listPrice || '',
    costPrice: product?.costPrice || '',
    currency: product?.currency || 'USD',
    availability: product?.availability || 'in_stock',
    stockQty: product?.stockQty || 0,
    leadTimeDays: product?.leadTimeDays || '',
    weight: product?.weight || '',
    weightUnit: product?.weightUnit || 'lbs',
    dimension: product?.dimension || '',
    sourceUrl: product?.sourceUrl || '',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isNew: product?.isNew ?? false,
  })

  const [images, setImages] = useState<Array<{ id?: string; url: string; altText: string; isPrimary: boolean }>>(
    product?.images || []
  )

  // Load categories and brands
  useEffect(() => {
    async function load() {
      const [catRes, brandRes] = await Promise.all([
        fetch('/api/categories?parent=false'),
        fetch('/api/brands').catch(() => ({ ok: false, json: async () => [] })),
      ])
      const cats = await catRes.json()
      setCategories(Array.isArray(cats) ? cats.flatMap((c: any) => [c, ...(c.children || [])]) : [])

      if (brandRes.ok) {
        const brs = await brandRes.json()
        setBrands(Array.isArray(brs) ? brs : [])
      }
    }
    load()
  }, [])

  function updateField(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function addImage() {
    if (!newImageUrl.trim()) return
    const isPrimary = images.length === 0
    setImages(prev => [...prev, { url: newImageUrl.trim(), altText: '', isPrimary }])
    setNewImageUrl('')
  }

  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  function setPrimary(idx: number) {
    setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === idx })))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      ...form,
      ourPrice: Number(form.ourPrice),
      listPrice: form.listPrice ? Number(form.listPrice) : undefined,
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      stockQty: Number(form.stockQty) || 0,
      leadTimeDays: form.leadTimeDays ? Number(form.leadTimeDays) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      images: images.map((img, i) => ({ url: img.url, altText: img.altText, isPrimary: img.isPrimary })),
    }

    try {
      let res
      if (mode === 'create') {
        res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`/api/admin/products/${product?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save product')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        if (mode === 'create') {
          router.push('/admin/products')
        } else {
          router.push('/admin/products')
        }
      }, 1500)
    } catch (err) {
      setError('Network error, please try again')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
  const groupClass = 'space-y-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm font-medium">
          ✓ Product saved successfully! Redirecting...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm font-medium">
          ✕ {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={groupClass}>
            <label className={labelClass}>SKU *</label>
            <input
              type="text"
              className={inputClass}
              value={form.sku}
              onChange={e => updateField('sku', e.target.value)}
              required
              placeholder="e.g. LDA-742-21T"
            />
          </div>
          <div className={groupClass}>
            <label className={labelClass}>Product Name *</label>
            <input
              type="text"
              className={inputClass}
              value={form.name}
              onChange={e => updateField('name', e.target.value)}
              required
              placeholder="e.g. 250mL Borosilicate Glass Beaker"
            />
          </div>
          <div className={groupClass}>
            <label className={labelClass}>Category *</label>
            <select
              className={inputClass}
              value={form.categoryId}
              onChange={e => updateField('categoryId', e.target.value)}
              required
            >
              <option value="">Select category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className={groupClass}>
            <label className={labelClass}>Brand</label>
            <select
              className={inputClass}
              value={form.brandId}
              onChange={e => updateField('brandId', e.target.value)}
            >
              <option value="">No brand</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <div className={groupClass}>
              <label className={labelClass}>Description</label>
              <textarea
                className={inputClass}
                rows={4}
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Product description..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={groupClass}>
            <label className={labelClass}>Our Price (USD) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              value={form.ourPrice}
              onChange={e => updateField('ourPrice', e.target.value)}
              required
              placeholder="0.00"
            />
          </div>
          <div className={groupClass}>
            <label className={labelClass}>List Price (USD)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              value={form.listPrice}
              onChange={e => updateField('listPrice', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className={groupClass}>
            <label className={labelClass}>Cost Price (Internal)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              value={form.costPrice}
              onChange={e => updateField('costPrice', e.target.value)}
              placeholder="Internal only"
            />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory & Shipping</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={groupClass}>
            <label className={labelClass}>Availability</label>
            <select
              className={inputClass}
              value={form.availability}
              onChange={e => updateField('availability', e.target.value)}
            >
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="lead_time">Lead Time</option>
            </select>
          </div>
          <div className={groupClass}>
            <label className={labelClass}>Stock Qty</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.stockQty}
              onChange={e => updateField('stockQty', e.target.value)}
            />
          </div>
          <div className={groupClass}>
            <label className={labelClass}>Lead Time (days)</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.leadTimeDays}
              onChange={e => updateField('leadTimeDays', e.target.value)}
              placeholder="If applicable"
            />
          </div>
          <div className={groupClass}>
            <label className={labelClass}>Weight</label>
            <input
              type="number"
              step="0.001"
              min="0"
              className={inputClass}
              value={form.weight}
              onChange={e => updateField('weight', e.target.value)}
              placeholder="0.0"
            />
          </div>
          <div className={groupClass}>
            <label className={labelClass}>Weight Unit</label>
            <select
              className={inputClass}
              value={form.weightUnit}
              onChange={e => updateField('weightUnit', e.target.value)}
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
              <option value="oz">oz</option>
            </select>
          </div>
          <div className={groupClass}>
            <label className={labelClass}>Dimensions</label>
            <input
              type="text"
              className={inputClass}
              value={form.dimension}
              onChange={e => updateField('dimension', e.target.value)}
              placeholder="L x W x H"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Image URL (https://...)"
            value={newImageUrl}
            onChange={e => setNewImageUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
          />
          <button
            type="button"
            onClick={addImage}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700"
          >
            Add
          </button>
        </div>
        {images.length > 0 ? (
          <div className="space-y-2">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <input
                  type="radio"
                  checked={img.isPrimary}
                  onChange={() => setPrimary(idx)}
                  className="w-4 h-4"
                />
                <img src={img.url} alt="" className="w-12 h-12 object-cover rounded" />
                <input
                  type="text"
                  className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                  placeholder="Alt text"
                  value={img.altText}
                  onChange={e => {
                    const updated = [...images]
                    updated[idx].altText = e.target.value
                    setImages(updated)
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="text-red-500 hover:text-red-700 text-sm px-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No images added yet</p>
        )}
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Flags</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => updateField('isActive', e.target.checked)}
              className="w-4 h-4 rounded text-brand-600"
            />
            <span className="text-sm text-gray-700">Active (visible on site)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={e => updateField('isFeatured', e.target.checked)}
              className="w-4 h-4 rounded text-brand-600"
            />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={e => updateField('isNew', e.target.checked)}
              className="w-4 h-4 rounded text-brand-600"
            />
            <span className="text-sm text-gray-700">Mark as New</span>
          </label>
        </div>
        <div className="mt-4">
          <div className={groupClass}>
            <label className={labelClass}>Source URL</label>
            <input
              type="url"
              className={inputClass}
              value={form.sourceUrl}
              onChange={e => updateField('sourceUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-brand-700 text-white rounded-lg text-sm font-medium hover:bg-brand-800 disabled:opacity-50"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
