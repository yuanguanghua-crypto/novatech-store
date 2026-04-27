import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/suppliers - 获取供应商列表
export async function GET(req: NextRequest) {

  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { nameEn: { contains: search, mode: 'insensitive' } },
      { contactName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      include: {
        _count: { select: { products: true, purchaseOrders: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.supplier.count({ where }),
  ])

  return NextResponse.json({ suppliers, total, page, pages: Math.ceil(total / limit) })
}

// POST /api/admin/suppliers - 创建供应商
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  if (!body.name) {
    return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 })
  }

  const supplier = await prisma.supplier.create({
    data: {
      name: body.name,
      nameEn: body.nameEn || null,
      contactName: body.contactName || null,
      email: body.email || null,
      phone: body.phone || null,
      wechat: body.wechat || null,
      address: body.address || null,
      city: body.city || null,
      province: body.province || null,
      country: body.country || 'China',
      website: body.website || null,
      notes: body.notes || null,
      rating: body.rating || 3,
      isActive: body.isActive !== false,
    },
  })

  return NextResponse.json(supplier, { status: 201 })
}
export const dynamic = 'force-dynamic'
