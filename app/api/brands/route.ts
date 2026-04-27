import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/brands - List all brands
export async function GET(request: NextRequest) {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(brands)
  } catch (error) {
    console.error('GET /api/brands error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
