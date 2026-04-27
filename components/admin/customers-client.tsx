'use client'

import { useAdminI18n } from './admin-i18n-provider'

interface Customer {
  id: string
  name: string | null
  email: string
  createdAt: Date
  _count: { orders: number; quotes: number }
}

interface CustomersClientProps {
  customers: Customer[]
}

export function CustomersClient({ customers }: CustomersClientProps) {
  const { t } = useAdminI18n()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.customers_title}</h1>
        <span className="text-sm text-gray-500">
          {t.customers_count.replace('{count}', String(customers.length))}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.customers_name_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.customers_email_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.customers_joined_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.customers_orders_col}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t.customers_quotes_col}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">{t.customers_no_customers}</td>
                </tr>
              ) : customers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{customer.name || t.customers_na}</td>
                  <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                  <td className="px-4 py-3 text-gray-500">{customer.createdAt.toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-600">{customer._count.orders}</td>
                  <td className="px-4 py-3 text-gray-600">{customer._count.quotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
