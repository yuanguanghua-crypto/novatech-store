import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/quotes/[id] - 获取询价详情
export async function GET(

  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              ourPrice: true,
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  })

  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  return NextResponse.json(quote)
}

// PATCH /api/admin/quotes/[id] - 更新询价（报价/回复）
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  // 检查询价是否存在
  const existing = await prisma.quote.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  // 构建更新数据
  const updateData: any = { updatedAt: new Date() }

  // 状态更新
  if (body.status) {
    updateData.status = body.status
    if (body.status === 'quoted') {
      updateData.quotedAt = new Date()
    }
  }

  // 整体报价金额
  if (body.quotedPrice !== undefined) {
    updateData.quotedPrice = body.quotedPrice
  }

  // 有效期
  if (body.expiresAt) {
    updateData.expiresAt = new Date(body.expiresAt)
  }

  // 管理员备注
  if (body.adminNotes !== undefined) {
    updateData.adminNotes = body.adminNotes
  }

  // 单个询价项报价（items 数组，每个 item 有 id 和 unitPrice）
  let itemUpdates: any[] = []
  if (body.items && Array.isArray(body.items)) {
    itemUpdates = body.items
      .filter((item: any) => item.unitPrice !== undefined)
      .map((item: any) => ({
        where: { id: item.id },
        data: { unitPrice: item.unitPrice },
      }))
  }

  const [quote] = await prisma.$transaction([
    prisma.quote.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true },
            },
          },
        },
        user: { select: { name: true, email: true } },
      },
    }),
    ...itemUpdates.map((u) =>
      prisma.quoteItem.update({ where: u.where, data: u.data })
    ),
  ])

  return NextResponse.json(quote)
}
export const dynamic = 'force-dynamic'
