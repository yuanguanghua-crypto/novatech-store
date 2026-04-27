import type { Metadata } from 'next'
import { AnalyticsClient } from '@/components/admin/analytics-client'

export const metadata: Metadata = { title: 'Analytics - Admin' }

export default function AnalyticsPage() {
  return <AnalyticsClient />
}
