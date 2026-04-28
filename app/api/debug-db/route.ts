import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  })

  try {
    // Test connection
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()
    const brandCount = await prisma.brand.count()

    // Get a sample product
    const sample = await prisma.product.findFirst({
      select: { id: true, name: true, sku: true, ourPrice: true }
    })

    // Check env vars (without exposing secrets)
    const dbUrl = process.env.DATABASE_URL || ''
    const prismaDbUrl = process.env.PRISMA_DATABASE_URL || ''
    const pgUrl = process.env.POSTGRES_URL || ''

    const dbHost = dbUrl.includes('@') ? dbUrl.split('@')[1]?.split('/')[0] : 'not set'
    const prismaDbHost = prismaDbUrl.includes('@') ? prismaDbUrl.split('@')[1]?.split('/')[0] : 'not set'
    const pgHost = pgUrl.includes('@') ? pgUrl.split('@')[1]?.split('/')[0] : 'not set'

    return NextResponse.json({
      status: 'connected',
      counts: { productCount, categoryCount, brandCount },
      sample,
      env_hosts: {
        DATABASE_URL: dbHost,
        PRISMA_DATABASE_URL: prismaDbHost,
        POSTGRES_URL: pgHost,
      },
      nodeEnv: process.env.NODE_ENV,
      region: process.env.VERCEL_REGION || 'unknown',
    })
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      error: err.message,
      code: err.code,
      meta: err.meta,
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export const dynamic = 'force-dynamic'
