import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { BrandsClient } from '@/components/store/brands-client'

export const metadata: Metadata = {
  title: 'All Brands',
  description: 'Browse all industrial and laboratory equipment brands at LabProGlobal',
}

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  })

  // Group by first letter
  const grouped: Record<string, typeof brands> = {}
  for (const brand of brands) {
    const letter = brand.name.charAt(0).toUpperCase()
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(brand)
  }
  const letters = Object.keys(grouped).sort()

  return <BrandsClient brands={brands} grouped={grouped} letters={letters} />
}
