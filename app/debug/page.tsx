// @ts-nocheck - TODO: migrate to V3.2
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function DebugPage() {
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  })

  let result: any = { status: 'connecting' }

  try {
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()
    const brandCount = await prisma.brand.count()

    // Get a sample
    const sample = await prisma.product.findFirst({
      select: { id: true, name: true, sku: true, ourPrice: true }
    })

    // Show which DB host we're using (just the host part)
    const dbUrl = process.env.DATABASE_URL || ''
    const pdbUrl = process.env.PRISMA_DATABASE_URL || ''
    const pgUrl = process.env.POSTGRES_URL || ''

    const parseHost = (url: string) => {
      if (!url) return '(not set)'
      try {
        const match = url.match(/@([^:/]+)/)
        return match ? match[1] : '(no host found)'
      } catch { return '(parse error)' }
    }

    result = {
      status: 'OK',
      database: {
        productCount,
        categoryCount,
        brandCount,
        sample
      },
      env: {
        DATABASE_URL_host: parseHost(dbUrl),
        PRISMA_DATABASE_URL_host: parseHost(pdbUrl),
        POSTGRES_URL_host: parseHost(pgUrl),
        NODE_ENV: process.env.NODE_ENV,
        REGION: process.env.VERCEL_REGION,
      }
    }
  } catch (err: any) {
    result = {
      status: 'ERROR',
      error: err.message,
      code: err.code,
      name: err.name,
      meta: err.meta,
    }
  }

  await prisma.$disconnect()

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: 800 }}>
      <h1>Database Debug</h1>
      <pre style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, overflow: 'auto' }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}
