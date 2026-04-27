import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

interface Props {
  params: Promise<{ id: string }>
}

// POST /api/admin/products/[id]/images - Add image
export async function POST(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { url, altText, isPrimary } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // If setting as primary, unset others first
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId: id },
        data: { isPrimary: false },
      })
    }

    const image = await prisma.productImage.create({
      data: {
        productId: id,
        url,
        altText: altText || '',
        isPrimary: isPrimary || false,
      },
    })

    return NextResponse.json({ success: true, image }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/products/[id]/images error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id]/images - Remove image
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json({ error: 'imageId is required' }, { status: 400 })
    }

    await prisma.productImage.delete({ where: { id: imageId, productId: id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/products/[id]/images error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
