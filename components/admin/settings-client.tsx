'use client'

import { useAdminI18n } from './admin-i18n-provider'

const INTEGRATIONS = [
  { name: 'Stripe', statusKey: 'settings_not_connected' as const, emoji: '💳' },
  { name: 'SendGrid / Resend', statusKey: 'settings_not_connected' as const, emoji: '📧' },
  { name: 'Google Analytics', statusKey: 'settings_not_connected' as const, emoji: '📊' },
  { name: 'ShipStation', statusKey: 'settings_not_connected' as const, emoji: '🚢' },
]

const NOTIFICATIONS = [
  { labelKey: 'settings_new_order' as const },
  { labelKey: 'settings_quote_received' as const },
  { labelKey: 'settings_low_stock' as const },
  { labelKey: 'settings_feedback' as const },
]

const TEAM_ITEMS = [
  { labelKey: 'settings_team_coming' as const, subKey: 'settings_invite_staff' as const },
]

const SECURITY_ITEMS = [
  { labelKey: 'settings_change_pw' as const },
  { labelKey: 'settings_2fa' as const },
  { labelKey: 'settings_active_sessions' as const },
]

const ADVANCED_ITEMS = [
  { labelKey: 'settings_api_keys' as const },
  { labelKey: 'settings_webhooks' as const },
  { labelKey: 'settings_env_vars' as const },
]

export function SettingsClient() {
  const { t } = useAdminI18n()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.settings_title}</h1>
        <p className="text-sm text-gray-500 mt-1">Store configuration, integrations, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🏪</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{t.settings_store_info}</h2>
              <p className="text-xs text-gray-500">{t.settings_store_info_desc}</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t.settings_store_name}</span>
              <span className="font-medium text-gray-900">LABPRO</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t.settings_contact_email}</span>
              <span className="font-medium text-gray-900">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t.settings_currency}</span>
              <span className="font-medium text-gray-900">USD</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">{t.settings_coming_soon_edit}</span>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔌</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{t.settings_integrations}</h2>
              <p className="text-xs text-gray-500">{t.settings_integrations_desc}</p>
            </div>
          </div>
          <div className="space-y-3">
            {INTEGRATIONS.map(int => (
              <div key={int.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{int.emoji}</span>
                  <span className="text-sm font-medium text-gray-800">{int.name}</span>
                </div>
                <span className="text-xs text-gray-400">{t[int.statusKey]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">{t.settings_coming_soon_connect}</span>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔔</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{t.settings_notifications}</h2>
              <p className="text-xs text-gray-500">{t.settings_notifications_desc}</p>
            </div>
          </div>
          <div className="space-y-3">
            {NOTIFICATIONS.map(n => (
              <div key={n.labelKey} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t[n.labelKey]}</span>
                <div className="relative">
                  <div className="w-8 h-4 bg-gray-200 rounded-full"></div>
                  <div className="absolute right-0 top-0 w-4 h-4 bg-white rounded-full shadow"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">{t.settings_coming_soon_alerts}</span>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{t.settings_team_roles}</h2>
              <p className="text-xs text-gray-500">{t.settings_team_roles_desc}</p>
            </div>
          </div>
          <div className="text-center py-4 text-sm text-gray-400">
            <p>{t.settings_team_coming}</p>
            <p className="text-xs mt-1">{t.settings_invite_staff}</p>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔒</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{t.settings_security}</h2>
              <p className="text-xs text-gray-500">{t.settings_security_desc}</p>
            </div>
          </div>
          <div className="space-y-2">
            {SECURITY_ITEMS.map(item => (
              <div key={item.labelKey} className="text-sm text-gray-600">{t[item.labelKey]}</div>
            ))}
            <div className="text-xs text-gray-400 mt-2">{t.settings_coming_soon_alerts}</div>
          </div>
        </div>

        {/* Advanced */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">⚙️</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{t.settings_advanced}</h2>
              <p className="text-xs text-gray-500">{t.settings_advanced_desc}</p>
            </div>
          </div>
          <div className="space-y-2">
            {ADVANCED_ITEMS.map(item => (
              <div key={item.labelKey} className="text-sm text-gray-600">{t[item.labelKey]}</div>
            ))}
            <div className="text-xs text-gray-400 mt-2">{t.settings_coming_soon_alerts}</div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <h3 className="font-semibold text-red-800">{t.settings_danger_zone}</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{t.settings_delete_all}</p>
              <p className="text-sm text-gray-500">{t.settings_delete_all_desc}</p>
            </div>
            <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition">
              {t.settings_delete_everything}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
