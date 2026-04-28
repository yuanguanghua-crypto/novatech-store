'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { useAdminI18n } from '@/components/admin/admin-i18n-provider'
import { FileSpreadsheet, Upload } from 'lucide-react'

interface Product {
  id: string
  sku: string
  name: string
  slug: string
  ourPrice: string
  isActive: boolean
  category?: { name: string }
  brand?: { name: string }
  images: Array<{ url: string }>
  _count?: { orderItems: number }
}

export default function AdminProductsPage() {
  const { t } = useAdminI18n()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleting, setDeleting] = useState<string | null>(null)

  const limit = 30

  const loadProducts = useCallback(async (pageNum = 1, searchTerm = search) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(limit),
        ...(searchTerm ? { search: searchTerm } : {}),
      })
      const res = await fetch(`/api/admin/products?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
      setPage(pageNum)
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }, [search])

  const [initialized, setInitialized] = useState(false)
  if (!initialized) {
    loadProducts(1, '')
    setInitialized(true)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    loadProducts(1, search)
  }

  async function handleDelete(id: string) {
    if (!confirm(t.orders_confirm_delete)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id))
        setTotal(prev => prev - 1)
      } else {
        const data = await res.json()
        alert(data.message || t.orders_delete_failed)
      }
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.products_title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t.products_total.replace('{count}', total.toLocaleString())}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/import"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {t.products_bulk_import || 'Bulk Import'}
          </Link>
          <Link href="/admin/products/new" className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {t.products_add_new}
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder={t.products_search_placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">
          {t.products_search}
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); loadProducts(1, '') }}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
          >
            {t.products_clear}
          </button>
        )}
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-12">{t.products_image_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.products_sku_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.products_product_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.products_brand_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.products_category_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.products_price_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.products_status_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.products_actions_col}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">{t.products_loading}</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    {search ? t.products_no_results : t.products_no_products}
                  </td>
                </tr>
              ) : products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt=""
                        className="w-10 h-10 object-cover rounded"
                        onError={e => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">{t.products_no_img}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{product.sku}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <Link href={`/products/${product.slug}`} className="text-brand-700 hover:underline line-clamp-1 font-medium text-xs">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{product.brand?.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{product.category?.name || '-'}</td>
                  <td className="px-4 py-3 font-medium text-xs">{formatPrice(product.ourPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isActive ? t.products_active : t.products_inactive}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="px-2 py-1 text-xs text-brand-700 hover:bg-brand-50 rounded"
                      >
                        {t.products_edit}
                      </Link>
                      {product._count?.orderItems === 0 && (
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                        >
                          {deleting === product.id ? '...' : t.products_delete}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-500">
              {t.products_page_of
                .replace('{page}', String(page))
                .replace('{total}', String(totalPages))
                .replace('{count}', total.toLocaleString())}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => loadProducts(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-40"
              >
                {t.products_previous}
              </button>
              <button
                onClick={() => loadProducts(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-40"
              >
                {t.products_next}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
