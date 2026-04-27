'use client'

import { Truck, Globe, Package, Clock } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

const carriers = [
  { carrier: 'DHL Express', time: '3-5 business days', note: 'Recommended for international orders' },
  { carrier: 'FedEx International', time: '4-7 business days', note: 'Freight options for heavy items' },
  { carrier: 'UPS Worldwide', time: '4-8 business days', note: 'Tracking included' },
  { carrier: 'USPS', time: '7-21 business days', note: 'Only for small packages to the US' },
  { carrier: 'Air Freight', time: '5-10 business days', note: 'For large or heavy equipment' },
  { carrier: 'Sea Freight', time: '20-40 business days', note: 'Cost-effective for bulk orders' },
]

export function ShippingClient() {
  const { t } = useI18n()

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.shipping_title}</h1>
      <p className="text-gray-600 mb-8">{t.shipping_subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="card p-6 text-center">
          <Globe className="w-8 h-8 text-brand-700 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">{t.shipping_countries}</h3>
          <p className="text-sm text-gray-500">{t.shipping_countries_desc}</p>
        </div>
        <div className="card p-6 text-center">
          <Truck className="w-8 h-8 text-brand-700 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">{t.shipping_carriers}</h3>
          <p className="text-sm text-gray-500">{t.shipping_carriers_desc}</p>
        </div>
        <div className="card p-6 text-center">
          <Package className="w-8 h-8 text-brand-700 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">{t.shipping_tracking}</h3>
          <p className="text-sm text-gray-500">{t.shipping_tracking_desc}</p>
        </div>
      </div>

      <div className="card p-8 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">{t.shipping_options}</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-semibold text-gray-800">{t.shipping_carrier_col}</th>
              <th className="text-left py-2 font-semibold text-gray-800">{t.shipping_delivery_col}</th>
              <th className="text-left py-2 font-semibold text-gray-800">{t.shipping_notes_col}</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {carriers.map((row) => (
              <tr key={row.carrier} className="border-b border-gray-100">
                <td className="py-3 font-medium text-gray-800">{row.carrier}</td>
                <td className="py-3">{row.time}</td>
                <td className="py-3 text-gray-500">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        <h2 className="text-xl font-bold text-gray-900">{t.shipping_free_title}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{t.shipping_free_text}</p>

        <hr />

        <h2 className="text-xl font-bold text-gray-900">{t.shipping_processing}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800">{t.shipping_instock}</strong>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800">{t.shipping_special}</strong>
            </div>
          </div>
        </div>

        <div className="bg-brand-50 rounded-lg p-4">
          <p className="text-sm text-brand-800">
            <strong>{t.shipping_quote}</strong> <a href="/quote" className="underline font-medium">{t.shipping_quote_text}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
