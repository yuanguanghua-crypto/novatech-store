// @ts-nocheck - TODO: migrate to V3.2
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '24')
  const skip = (page - 1) * limit

  if (!q.trim()) {
    return NextResponse.json({ products: [], total: 0 })
  }

  const where: any = {
    isActive: true,
    OR: [
      { sku: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { specsFlat: { contains: q, mode: 'insensitive' } },
      { brand: { name: { contains: q, mode: 'insensitive' } } },
    ],
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        brand: { select: { name: true } },
        category: { select: { name: true, slug: true } },
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total })
}
export const dynamic = 'force-dynamic'
