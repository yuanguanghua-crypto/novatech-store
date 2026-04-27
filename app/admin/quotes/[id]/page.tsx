import type { Metadata } from 'next'
import QuoteDetailClient from '@/components/admin/quote-detail-client'

export const metadata: Metadata = { title: 'Quote Detail - Admin' }

export default function QuoteDetailPage() {
  return <QuoteDetailClient />
}
