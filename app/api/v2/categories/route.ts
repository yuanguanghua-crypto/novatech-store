import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/v2/categories — category list with SPU counts
export async function GET() {
  const groups = await prisma.categoryGroup.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { spus: true } },
    },
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json(
    groups.map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      description: g.description,
      productCount: g._count.spus,
    }))
  )
}

export const dynamic = 'force-dynamic'
