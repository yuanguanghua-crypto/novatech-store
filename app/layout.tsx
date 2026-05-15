import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'LABPRO - Professional Laboratory Glassware',
    template: '%s | LABPRO',
  },
  description:
    'LABPRO — Professional laboratory borosilicate glassware supplier. Beakers, flasks, cylinders, burettes, condensers, and filtration systems. ASTM & ISO certified.',
  keywords: [
    'laboratory glassware', 'borosilicate 3.3', 'beaker', 'erlenmeyer flask',
    'graduated cylinder', 'volumetric flask', 'condenser', 'filtration kit',
    'LABPRO', 'lab equipment',
  ],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://labprostore.com',
    siteName: 'LABPRO',
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
      <body className={`${inter.variable} ${dmSans.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
