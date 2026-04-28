import { NextResponse } from 'next/server'

export async function GET() {
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

  return new NextResponse(`DB_ENV_STATUS:
  DATABASE_URL host: ${parseHost(dbUrl)}
  PRISMA_DATABASE_URL host: ${parseHost(pdbUrl)}
  POSTGRES_URL host: ${parseHost(pgUrl)}
  NODE_ENV: ${process.env.NODE_ENV}
  REGION: ${process.env.VERCEL_REGION || 'unknown'}
`)
}

export const dynamic = 'force-dynamic'
