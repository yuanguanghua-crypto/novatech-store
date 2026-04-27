import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/store/register-form'
import { getTranslation } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: getTranslation('auth_register_title'),
    description: getTranslation('auth_register_desc'),
  }
}

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            <RegisterForm tkey="auth_register_title" />
          </h1>
          <p className="mt-2 text-gray-600">
            <RegisterForm tkey="auth_join_desc" />
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong><RegisterForm tkey="auth_demo_mode" /></strong>:{' '}
              <RegisterForm tkey="auth_demo_mode_notice" />{' '}
              <RegisterForm tkey="auth_env_setup_notice" />
            </p>
          </div>

          <RegisterForm />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          <RegisterForm tkey="auth_already_have" />{' '}
          <Link href="/auth/login" className="text-brand-700 font-medium hover:underline">
            <RegisterForm tkey="auth_sign_in_link" />
          </Link>
        </p>
      </div>
    </div>
  )
}
