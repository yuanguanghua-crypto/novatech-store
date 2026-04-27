import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/suppliers/[id] - 获取供应商详情
export async function GET(

  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true, purchaseOrders: true } },
    },
  })

  if (!supplier) {
    return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  }

  return NextResponse.json(supplier)
}

// PATCH /api/admin/suppliers/[id] - 更新供应商
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

  const existing = await prisma.supplier.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  }

  const supplier = await prisma.supplier.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      nameEn: body.nameEn !== undefined ? body.nameEn : existing.nameEn,
      contactName: body.contactName !== undefined ? body.contactName : existing.contactName,
      email: body.email !== undefined ? body.email : existing.email,
      phone: body.phone !== undefined ? body.phone : existing.phone,
      wechat: body.wechat !== undefined ? body.wechat : existing.wechat,
      address: body.address !== undefined ? body.address : existing.address,
      city: body.city !== undefined ? body.city : existing.city,
      province: body.province !== undefined ? body.province : existing.province,
      country: body.country ?? existing.country,
      website: body.website !== undefined ? body.website : existing.website,
      notes: body.notes !== undefined ? body.notes : existing.notes,
      rating: body.rating ?? existing.rating,
      isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
    },
    include: {
      _count: { select: { products: true, purchaseOrders: true } },
    },
  })

  return NextResponse.json(supplier)
}

// DELETE /api/admin/suppliers/[id] - 删除供应商
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const existing = await prisma.supplier.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  }

  // 如果有关联产品，不允许删除（防止数据混乱）
  if (existing._count.products > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${existing._count.products} products are linked to this supplier. Remove product links first.` },
      { status: 400 }
    )
  }

  await prisma.supplier.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
export const dynamic = 'force-dynamic'
