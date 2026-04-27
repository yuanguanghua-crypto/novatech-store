import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminI18nProvider } from '@/components/admin/admin-i18n-provider'
import { AdminLanguageSwitcher } from '@/components/admin/admin-language-switcher'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/auth/login?callbackUrl=/admin')
  }

  return (
    <AdminI18nProvider>
      <div className="min-h-screen bg-gray-100 flex">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-auto">
          {/* Language Switcher — top right */}
          <div className="flex justify-end mb-4">
            <AdminLanguageSwitcher />
          </div>
          {children}
        </main>
      </div>
    </AdminI18nProvider>
  )
}
