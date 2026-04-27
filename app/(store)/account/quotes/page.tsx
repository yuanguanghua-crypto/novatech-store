'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface Quote {
  id: string
  quoteNumber: string
  createdAt: string
  status: string
  items: number
  total: string
}

export default function QuotesPage() {
  const { t } = useI18n()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/quotes')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setQuotes(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
    pending: { label: t.quotes_status_pending, class: 'bg-yellow-100 text-yellow-700', icon: Clock },
    approved: { label: t.quotes_status_approved, class: 'bg-green-100 text-green-700', icon: CheckCircle },
    rejected: { label: t.quotes_status_rejected, class: 'bg-red-100 text-red-700', icon: XCircle },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.quotes_title}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.quotes_subtitle}</p>
        </div>
        <Link href="/quote" className="btn-primary text-sm">
          {t.quotes_request_new}
        </Link>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">{t.quotes_loading}</div>
        ) : quotes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">{t.quotes_no_quotes}</h3>
            <p className="text-sm text-gray-500 mb-4">{t.quotes_no_quotes_desc}</p>
            <Link href="/quote" className="btn-primary text-sm">{t.quotes_request_quote}</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{t.quotes_quote_number}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{t.quotes_date}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{t.quotes_items}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{t.quotes_est_total}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{t.quotes_status}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.map((quote) => {
                const cfg = statusConfig[quote.status] || statusConfig.pending
                return (
                  <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-brand-700">{quote.quoteNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(quote.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{quote.items}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{quote.total}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cfg.class}`}>
                        <cfg.icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/account/quotes/${quote.id}`} className="text-brand-700 hover:text-brand-800">
                        <ChevronRight className="w-4 h-4 inline" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
