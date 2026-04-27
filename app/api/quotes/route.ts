import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateQuoteNumber } from '@/lib/utils'
import { z } from 'zod'
export const dynamic = 'force-dynamic'


const quoteSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  customerCompany: z.string().optional(),
  customerPhone: z.string().optional(),
  message: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    notes: z.string().optional(),
  })).min(1),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const data = quoteSchema.parse(body)

    const quote = await prisma.quote.create({
      data: {
        quoteNumber: generateQuoteNumber(),
        userId: session?.user ? (session.user as any).id : null,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerCompany: data.customerCompany,
        customerPhone: data.customerPhone,
        message: data.message,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      },
    })

    return NextResponse.json({ success: true, quoteNumber: quote.quoteNumber }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Quote creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
