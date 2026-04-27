import type { Metadata } from 'next'
import { BrandsClient } from '@/components/store/brands-client'

export const metadata: Metadata = {
  title: 'All Brands',
  description: 'Browse all industrial and laboratory equipment brands at LabProGlobal',
}

// Force dynamic rendering to avoid build-time database errors
export const dynamic = 'force-dynamic'

export default async function BrandsPage() {
  return <BrandsClient brands={[]} grouped={{}} letters={[]} />
}
