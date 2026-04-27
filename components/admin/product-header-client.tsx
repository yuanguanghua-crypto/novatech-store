'use client'

import { useAdminI18n } from './admin-i18n-provider'

interface ProductHeaderClientProps {
  mode: 'create' | 'edit'
  productName?: string
  productSku?: string
}

export function ProductHeaderClient({ mode, productName, productSku }: ProductHeaderClientProps) {
  const { t } = useAdminI18n()

  if (mode === 'create') {
    return (
      <>
        <h1 className="text-2xl font-bold text-gray-900">{t.products_add_new_title}</h1>
        <p className="text-sm text-gray-500 mt-1">{t.products_fill_details}</p>
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">{t.products_edit_title}</h1>
      <p className="text-sm text-gray-500 mt-1">
        {t.products_editing}{' '}
        <span className="font-medium text-gray-700">{productName}</span>
        <span className="ml-2 font-mono text-xs text-gray-400">{productSku}</span>
      </p>
    </>
  )
}
