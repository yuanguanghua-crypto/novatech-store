import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'LabProGlobal - Industrial & Laboratory Equipment',
    template: '%s | LabProGlobal',
  },
  description:
    'LabProGlobal — Trusted supplier of chemical metering pumps, water quality analyzers, laboratory balances and industrial instruments. Fast shipping worldwide.',
  keywords: [
    'metering pumps', 'chemical dosing pump', 'water quality analyzer',
    'laboratory balance', 'industrial instruments', 'Pulsafeeder', 'LMI pumps',
    'lab equipment', 'laboratory supplies',
  ],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://labproglobal.com',
    siteName: 'LabProGlobal',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
