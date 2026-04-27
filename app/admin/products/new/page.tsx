import type { Metadata } from 'next'
import { ProductForm } from '@/components/admin/product-form'
import { ProductHeaderClient } from '@/components/admin/product-header-client'

export const metadata: Metadata = { title: 'Add Product - Admin' }

export default function AdminNewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <ProductHeaderClient mode="create" />
      </div>
      <ProductForm mode="create" />
    </div>
  )
}
