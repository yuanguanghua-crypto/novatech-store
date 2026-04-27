import type { Metadata } from 'next'
import SupplierListClient from '@/components/admin/supplier-list-client'

export const metadata: Metadata = { title: 'Suppliers - Admin' }

export default function AdminSuppliersPage() {
  return <SupplierListClient />
}
