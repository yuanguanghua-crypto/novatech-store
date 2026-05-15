'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChevronDown, ChevronRight, Plus, X, GripVertical, 
  Star, Upload, Image, Video, Truck, Package, 
  ShoppingCart, AlertCircle, Check, Trash2, FileSpreadsheet
} from 'lucide-react'

// ============================================
// Type Definitions
// ============================================

interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  children?: Category[]
}

interface Brand {
  id: string
  name: string
  slug: string
  logoUrl?: string
}

interface ProductImage {
  id?: string
  url: string
  altText: string
  isPrimary: boolean
  file?: File
  preview?: string
}

interface ShippingMethod {
  id?: string
  method: 'standard' | 'express' | 'freight' | 'pickup'
  cost: string
  estimatedDays: string
  isFree: boolean
}

interface ProductFormData {
  sku: string
  name: string
  description: string
  categoryId: string
  subcategoryId: string
  brandId: string
  ourPrice: string
  listPrice: string
  costPrice: string
  currency: string
  availability: 'in_stock' | 'out_of_stock' | 'lead_time'
  stockQty: string
  leadTimeDays: string
  weight: string
  weightUnit: 'lbs' | 'kg' | 'oz'
  dimensionLength: string
  dimensionWidth: string
  dimensionHeight: string
  dimensionUnit: 'in' | 'cm'
  sourceUrl: string
  metaTitle: string
  metaDesc: string
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  videoUrl: string
  shippingMethods: ShippingMethod[]
  specs: Array<{ key: string; value: string }>
}

// ============================================
// Utility Functions
// ============================================

function generateSKU(category: string, brand: string): string {
  const catPrefix = category.substring(0, 3).toUpperCase()
  const brandPrefix = brand.substring(0, 2).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${catPrefix}-${brandPrefix}-${random}`
}

function calculateDiscount(ourPrice: number, listPrice: number): number {
  if (!listPrice || listPrice <= 0 || ourPrice >= listPrice) return 0
  return Math.round(((listPrice - ourPrice) / listPrice) * 100)
}

// ============================================
// Category Cascade Selector Component
// ============================================

interface CategoryCascadeProps {
  categories: Category[]
  parentId: string
  childId: string
  onChange: (parentId: string, childId: string) => void
  required?: boolean
}

function CategoryCascade({ categories, parentId, childId, onChange, required }: CategoryCascadeProps) {
  const parentCategories = categories.filter(c => !c.parentId)
  const selectedParent = parentCategories.find(c => c.id === parentId)
  const childCategories = selectedParent?.children || []

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {required && <span className="text-red-500 mr-1">*</span>}
            Category
          </label>
          <select
            value={parentId}
            onChange={e => onChange(e.target.value, '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Select category...</option>
            {parentCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {required && <span className="text-red-500 mr-1">*</span>}
            Subcategory
          </label>
          <select
            value={childId}
            onChange={e => onChange(parentId, e.target.value)}
            disabled={!parentId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select subcategory...</option>
            {childCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
      {parentId && childCategories.length > 0 && !childId && required && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Please select a subcategory
        </p>
      )}
    </div>
  )
}

// ============================================
// Dimension Input Component
// ============================================

interface DimensionInputProps {
  length: string
  width: string
  height: string
  unit: 'in' | 'cm'
  onChange: (length: string, width: string, height: string, unit: 'in' | 'cm') => void
}

function DimensionInput({ length, width, height, unit, onChange }: DimensionInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (L × W × H)</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="0.1"
          min="0"
          placeholder="Length"
          value={length}
          onChange={e => onChange(e.target.value, width, height, unit)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <span className="text-gray-400">×</span>
        <input
          type="number"
          step="0.1"
          min="0"
          placeholder="Width"
          value={width}
          onChange={e => onChange(length, e.target.value, height, unit)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <span className="text-gray-400">×</span>
        <input
          type="number"
          step="0.1"
          min="0"
          placeholder="Height"
          value={height}
          onChange={e => onChange(length, width, e.target.value, unit)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <select
          value={unit}
          onChange={e => onChange(length, width, height, e.target.value as 'in' | 'cm')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="in">in</option>
          <option value="cm">cm</option>
        </select>
      </div>
    </div>
  )
}

// ============================================
// Shipping Methods Component
// ============================================

interface ShippingMethodsEditorProps {
  methods: ShippingMethod[]
  onChange: (methods: ShippingMethod[]) => void
}

const SHIPPING_METHODS = [
  { method: 'standard' as const, label: 'Standard Shipping', icon: Package },
  { method: 'express' as const, label: 'Express Delivery', icon: Truck },
  { method: 'freight' as const, label: 'Freight (LTL)', icon: Truck },
  { method: 'pickup' as const, label: 'Local Pickup', icon: ShoppingCart },
]

function ShippingMethodsEditor({ methods, onChange }: ShippingMethodsEditorProps) {
  const toggleMethod = (method: ShippingMethod['method']) => {
    const existing = methods.find(m => m.method === method)
    if (existing) {
      onChange(methods.filter(m => m.method !== method))
    } else {
      onChange([...methods, { method, cost: '', estimatedDays: '', isFree: false }])
    }
  }

  const updateMethod = (method: ShippingMethod['method'], updates: Partial<ShippingMethod>) => {
    onChange(methods.map(m => m.method === method ? { ...m, ...updates } : m))
  }

  const isActive = (method: ShippingMethod['method']) => methods.some(m => m.method === method)
  const getMethod = (method: ShippingMethod['method']) => methods.find(m => m.method === method)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {SHIPPING_METHODS.map(({ method, label, icon: Icon }) => (
          <label
            key={method}
            className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
              isActive(method)
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={isActive(method)}
              onChange={() => toggleMethod(method)}
              className="w-4 h-4 text-brand-600 rounded"
            />
            <Icon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </label>
        ))}
      </div>
      
      {methods.map(m => {
        const config = SHIPPING_METHODS.find(s => s.method === m.method)
        return (
          <div key={m.method} className="pl-6 space-y-2 border-l-2 border-brand-200">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              {config?.label}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={m.cost}
                  onChange={e => updateMethod(m.method, { cost: e.target.value })}
                  disabled={m.isFree}
                  placeholder="0.00"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Est. Days</label>
                <input
                  type="number"
                  min="0"
                  value={m.estimatedDays}
                  onChange={e => updateMethod(m.method, { estimatedDays: e.target.value })}
                  placeholder="e.g. 5"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  checked={m.isFree}
                  onChange={e => updateMethod(m.method, { isFree: e.target.checked, cost: e.target.checked ? '0' : m.cost })}
                  className="w-4 h-4 text-brand-600 rounded"
                />
                <span className="text-xs text-gray-600">Free shipping</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// Image Gallery Component
// ============================================

interface ImageGalleryProps {
  images: ProductImage[]
  onChange: (images: ProductImage[]) => void
}

function ImageGallery({ images, onChange }: ImageGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages: ProductImage[] = files.map((file, idx) => ({
      url: URL.createObjectURL(file),
      altText: '',
      isPrimary: images.length === 0 && idx === 0,
      file,
      preview: URL.createObjectURL(file)
    }))
    
    if (newImages.length > 0 && images.length === 0) {
      newImages[0].isPrimary = true
    }
    
    onChange([...images, ...newImages])
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [images, onChange])

  const addImageUrl = (url: string) => {
    if (!url.trim()) return
    const newImage: ProductImage = {
      url: url.trim(),
      altText: '',
      isPrimary: images.length === 0
    }
    onChange([...images, newImage])
  }

  const removeImage = (idx: number) => {
    const newImages = images.filter((_, i) => i !== idx)
    if (images[idx].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true
    }
    onChange(newImages)
  }

  const setPrimary = (idx: number) => {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === idx })))
  }

  const moveImage = (fromIdx: number, toIdx: number) => {
    const newImages = [...images]
    const [removed] = newImages.splice(fromIdx, 1)
    newImages.splice(toIdx, 0, removed)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            <span className="text-brand-600 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each</p>
        </label>
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Or paste image URL..."
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addImageUrl((e.target as HTMLInputElement).value)
              ;(e.target as HTMLInputElement).value = ''
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="button"
          onClick={() => {
            const input = document.querySelector('input[placeholder="Or paste image URL..."]') as HTMLInputElement
            if (input?.value) {
              addImageUrl(input.value)
              input.value = ''
            }
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
        >
          Add URL
        </button>
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                img.isPrimary ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={img.preview || img.url}
                alt={img.altText || `Product image ${idx + 1}`}
                className="w-full aspect-square object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrimary(idx)}
                  className={`p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                    img.isPrimary ? 'bg-brand-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Set as primary"
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Primary Badge */}
              {img.isPrimary && (
                <div className="absolute top-2 left-2 bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Primary
                </div>
              )}
              
              {/* Alt Text Input */}
              <input
                type="text"
                placeholder="Alt text..."
                value={img.altText}
                onChange={e => {
                  const newImages = [...images]
                  newImages[idx].altText = e.target.value
                  onChange(newImages)
                }}
                className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-xs bg-white/90 border-t border-gray-200 focus:outline-none"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images added yet</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// Video Upload Component
// ============================================

interface VideoUploaderProps {
  videoUrl: string
  onChange: (url: string) => void
}

function VideoUploader({ videoUrl, onChange }: VideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid video file (MP4, WebM, MOV)')
      return
    }

    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      alert('Video file must be less than 500MB')
      return
    }

    setUploading(true)
    setProgress(0)

    // Simulate upload progress (in production, this would be a real upload)
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90))
    }, 500)

    // For demo purposes, use a local URL
    // In production, this would upload to S3
    const localUrl = URL.createObjectURL(file)
    
    clearInterval(progressInterval)
    setProgress(100)
    
    setTimeout(() => {
      onChange(localUrl)
      setUploading(false)
      setProgress(0)
    }, 500)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {videoUrl ? (
        <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileSelect}
            className="hidden"
            id="video-upload"
          />
          <label htmlFor="video-upload" className="cursor-pointer">
            {uploading ? (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">Uploading... {progress}%</p>
              </div>
            ) : (
              <>
                <Video className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="text-brand-600 font-medium">Upload a video</span> or paste URL below
                </p>
                <p className="text-xs text-gray-400 mt-1">MP4, MOV, WebM up to 500MB</p>
              </>
            )}
          </label>
        </div>
      )}

      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Or paste video URL (YouTube, Vimeo, S3)..."
          defaultValue={videoUrl}
          onBlur={e => e.target.value && onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
    </div>
  )
}

// ============================================
// Specs Editor Component
// ============================================

interface SpecsEditorProps {
  specs: Array<{ key: string; value: string }>
  onChange: (specs: Array<{ key: string; value: string }>) => void
}

const COMMON_SPEC_KEYS = [
  'Max Flow (GPH)', 'Max Flow (GPD)', 'Max Pressure (PSI)', 'Voltage',
  'Material', 'Connection Size', 'Accuracy', 'Range', 'Capacity',
  'Model Number', 'Product Line', 'Certifications'
]

function SpecsEditor({ specs, onChange }: SpecsEditorProps) {
  const addSpec = () => {
    onChange([...specs, { key: '', value: '' }])
  }

  const updateSpec = (idx: number, field: 'key' | 'value', val: string) => {
    onChange(specs.map((s, i) => i === idx ? { ...s, [field]: val } : s))
  }

  const removeSpec = (idx: number) => {
    onChange(specs.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      {specs.map((spec, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            list={`spec-suggestions-${idx}`}
            value={spec.key}
            onChange={e => updateSpec(idx, 'key', e.target.value)}
            placeholder="Spec name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <datalist id={`spec-suggestions-${idx}`}>
            {COMMON_SPEC_KEYS.map(key => (
              <option key={key} value={key} />
            ))}
          </datalist>
          <input
            type="text"
            value={spec.value}
            onChange={e => updateSpec(idx, 'value', e.target.value)}
            placeholder="Value"
            className="flex-[2] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="button"
            onClick={() => removeSpec(idx)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addSpec}
        className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700"
      >
        <Plus className="w-4 h-4" />
        Add Specification
      </button>
    </div>
  )
}

// ============================================
// Main Product Form Component
// ============================================

interface Props {
  product?: any
  mode: 'create' | 'edit'
}

export function ProductForm({ product, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Data
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Form State
  const [form, setForm] = useState<ProductFormData>({
    sku: product?.sku || '',
    name: product?.name || '',
    description: product?.description || '',
    categoryId: product?.category?.parentId || product?.categoryId || '',
    subcategoryId: product?.categoryId || '',
    brandId: product?.brandId || '',
    ourPrice: product?.ourPrice || '',
    listPrice: product?.listPrice || '',
    costPrice: product?.costPrice || '',
    currency: product?.currency || 'USD',
    availability: product?.availability || 'in_stock',
    stockQty: product?.stockQty || '',
    leadTimeDays: product?.leadTimeDays || '',
    weight: product?.weight || '',
    weightUnit: product?.weightUnit || 'lbs',
    dimensionLength: '',
    dimensionWidth: '',
    dimensionHeight: '',
    dimensionUnit: 'in',
    sourceUrl: product?.sourceUrl || '',
    metaTitle: product?.metaTitle || '',
    metaDesc: product?.metaDesc || '',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isNew: product?.isNew ?? false,
    videoUrl: '',
    shippingMethods: [],
    specs: [],
  })

  const [images, setImages] = useState<ProductImage[]>(
    product?.images?.map((img: any) => ({
      id: img.id,
      url: img.url,
      altText: img.altText || '',
      isPrimary: img.isPrimary
    })) || []
  )

  // Load categories and brands
  useEffect(() => {
    async function load() {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories?parent=true'),
          fetch('/api/brands').catch(() => ({ ok: false, json: async () => [] })),
        ])
        
        const cats = await catRes.json()
        setCategories(Array.isArray(cats) ? cats : [])
        
        if (brandRes.ok) {
          const brs = await brandRes.json()
          setBrands(Array.isArray(brs) ? brs : [])
        }

        // Parse existing dimension if available
        if (product?.dimension) {
          const parts = product.dimension.replace(/[()]/g, '').split('×').map((s: string) => s.trim())
          if (parts.length >= 3) {
            setForm(prev => ({
              ...prev,
              dimensionLength: parts[0] || '',
              dimensionWidth: parts[1] || '',
              dimensionHeight: parts[2] || '',
            }))
          }
        }

        // Parse existing specs if available
        if (product?.specs) {
          const specsArray = Object.entries(product.specs as Record<string, string>)
            .filter(([key]) => !key.startsWith('ns_'))
            .map(([key, value]) => ({ key, value: String(value) }))
          setForm(prev => ({ ...prev, specs: specsArray }))
        }
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoadingData(false)
      }
    }
    load()
  }, [product])

  function updateField<K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Calculate discount
  const ourPrice = parseFloat(form.ourPrice) || 0
  const listPrice = parseFloat(form.listPrice) || 0
  const discountPercent = calculateDiscount(ourPrice, listPrice)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (!form.subcategoryId) {
      setError('Please select a subcategory')
      setLoading(false)
      return
    }

    // Build dimension string
    const dimension = form.dimensionLength && form.dimensionWidth && form.dimensionHeight
      ? `(${form.dimensionLength} × ${form.dimensionWidth} × ${form.dimensionHeight} ${form.dimensionUnit})`
      : undefined

    // Build specs object
    const specs: Record<string, string> = {}
    form.specs.forEach(s => {
      if (s.key && s.value) {
        specs[s.key] = s.value
      }
    })

    const payload = {
      sku: form.sku,
      name: form.name,
      description: form.description,
      categoryId: form.subcategoryId,
      brandId: form.brandId || undefined,
      ourPrice: parseFloat(form.ourPrice),
      listPrice: form.listPrice ? parseFloat(form.listPrice) : undefined,
      costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined,
      currency: form.currency,
      availability: form.availability,
      stockQty: parseInt(form.stockQty) || 0,
      leadTimeDays: form.leadTimeDays ? parseInt(form.leadTimeDays) : undefined,
      weight: form.weight ? parseFloat(form.weight) : undefined,
      weightUnit: form.weightUnit,
      dimension,
      sourceUrl: form.sourceUrl || undefined,
      metaTitle: form.metaTitle || undefined,
      metaDesc: form.metaDesc || undefined,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      specs,
      videoUrl: form.videoUrl || undefined,
      images: images.filter(img => !img.file).map((img, idx) => ({
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
        sortOrder: idx
      })),
      shippingMethods: form.shippingMethods.map((m, idx) => ({
        method: m.method,
        cost: m.cost ? parseFloat(m.cost) : 0,
        estimatedDays: m.estimatedDays ? parseInt(m.estimatedDays) : undefined,
        isFree: m.isFree,
        sortOrder: idx
      })),
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

      // Upload new images if any
      const newImages = images.filter(img => img.file)
      for (const img of newImages) {
        if (img.file) {
          const formData = new FormData()
          formData.append('file', img.file)
          formData.append('type', 'image')
          await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          })
        }
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/products')
      }, 1500)
    } catch (err) {
      setError('Network error, please try again')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <Check className="w-5 h-5" />
          Product saved successfully! Redirecting...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Section: Basic Information */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-brand-600" />
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500 mr-1">*</span>
              SKU
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.sku}
              onChange={e => updateField('sku', e.target.value)}
              required
              placeholder="e.g. LDA-742-21T"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500 mr-1">*</span>
              Product Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.name}
              onChange={e => updateField('name', e.target.value)}
              required
              placeholder="e.g. 250mL Borosilicate Glass Beaker"
            />
          </div>
          
          {/* Category Cascade */}
          <div className="md:col-span-2">
            <CategoryCascade
              categories={categories}
              parentId={form.categoryId}
              childId={form.subcategoryId}
              onChange={(parentId, childId) => {
                updateField('categoryId', parentId)
                updateField('subcategoryId', childId)
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.brandId}
              onChange={e => updateField('brandId', e.target.value)}
            >
              <option value="">Select brand...</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.sourceUrl}
              onChange={e => updateField('sourceUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows={4}
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Product description..."
            />
          </div>
        </div>
      </section>

      {/* Section: Pricing */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-brand-600">$</span>
          Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500 mr-1">*</span>
              Our Price (USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.ourPrice}
              onChange={e => updateField('ourPrice', e.target.value)}
              required
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">List Price (USD)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.listPrice}
              onChange={e => updateField('listPrice', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (Internal)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.costPrice}
              onChange={e => updateField('costPrice', e.target.value)}
              placeholder="Internal only"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
            <div className={`px-3 py-2 rounded-lg text-sm font-semibold ${
              discountPercent > 0 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              {discountPercent > 0 ? `Save ${discountPercent}% OFF` : 'No discount'}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Inventory */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-brand-600" />
          Inventory & Stock
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.availability}
              onChange={e => updateField('availability', e.target.value as ProductFormData['availability'])}
            >
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="lead_time">Lead Time (Backorder)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.stockQty}
              onChange={e => updateField('stockQty', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time (days)</label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.leadTimeDays}
              onChange={e => updateField('leadTimeDays', e.target.value)}
              placeholder="If applicable"
            />
          </div>
        </div>
      </section>

      {/* Section: Shipping & Dimensions */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-brand-600" />
          Shipping & Dimensions
        </h2>
        <div className="space-y-4">
          {/* Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <input
                type="number"
                step="0.001"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={form.weight}
                onChange={e => updateField('weight', e.target.value)}
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={form.weightUnit}
                onChange={e => updateField('weightUnit', e.target.value as ProductFormData['weightUnit'])}
              >
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
                <option value="oz">oz</option>
              </select>
            </div>
          </div>

          {/* Dimensions */}
          <DimensionInput
            length={form.dimensionLength}
            width={form.dimensionWidth}
            height={form.dimensionHeight}
            unit={form.dimensionUnit}
            onChange={(length, width, height, unit) => {
              updateField('dimensionLength', length)
              updateField('dimensionWidth', width)
              updateField('dimensionHeight', height)
              updateField('dimensionUnit', unit)
            }}
          />

          {/* Shipping Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Methods</label>
            <ShippingMethodsEditor
              methods={form.shippingMethods}
              onChange={methods => updateField('shippingMethods', methods)}
            />
          </div>
        </div>
      </section>

      {/* Section: Specifications */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-brand-600">⚙</span>
          Product Specifications
        </h2>
        <SpecsEditor
          specs={form.specs}
          onChange={specs => updateField('specs', specs)}
        />
      </section>

      {/* Section: Images */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5 text-brand-600" />
          Product Images
        </h2>
        <ImageGallery
          images={images}
          onChange={setImages}
        />
      </section>

      {/* Section: Video */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Video className="w-5 h-5 text-brand-600" />
          Product Video
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Add a product introduction video to showcase your product. Supported formats: MP4, WebM, MOV (max 500MB).
        </p>
        <VideoUploader
          videoUrl={form.videoUrl}
          onChange={url => updateField('videoUrl', url)}
        />
      </section>

      {/* Section: SEO */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-brand-600">🔍</span>
          SEO Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={form.metaTitle}
              onChange={e => updateField('metaTitle', e.target.value)}
              placeholder="SEO title (defaults to product name if empty)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows={3}
              value={form.metaDesc}
              onChange={e => updateField('metaDesc', e.target.value)}
              placeholder="SEO description (defaults to product description if empty)"
            />
          </div>
        </div>
      </section>

      {/* Section: Status */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Visibility</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => updateField('isActive', e.target.checked)}
              className="w-5 h-5 text-brand-600 rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-700 block">Active</span>
              <span className="text-xs text-gray-500">Visible on website</span>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={e => updateField('isFeatured', e.target.checked)}
              className="w-5 h-5 text-brand-600 rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-700 block">Featured</span>
              <span className="text-xs text-gray-500">Show on homepage</span>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={e => updateField('isNew', e.target.checked)}
              className="w-5 h-5 text-brand-600 rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-700 block">New Product</span>
              <span className="text-xs text-gray-500">Show "New" badge</span>
            </div>
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Bulk Import
          </button>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {mode === 'create' ? 'Create Product' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
