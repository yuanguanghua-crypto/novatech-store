import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AccountClient } from '@/components/store/account-client'

export const metadata: Metadata = { title: 'My Account' }

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/account')
  }

  return (
    <AccountClient
      userName={session.user.name}
      userEmail={session.user.email}
    />
  )
}
