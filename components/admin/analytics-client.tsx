'use client'

import { useAdminI18n } from './admin-i18n-provider'

export function AnalyticsClient() {
  const { t } = useAdminI18n()

  const STATS = [
    { labelKey: 'analytics_total_revenue' as const, value: '$—', subKey: 'analytics_this_month' as const, icon: '💰' },
    { labelKey: 'analytics_orders' as const, value: '—', subKey: 'analytics_this_month' as const, icon: '📦' },
    { labelKey: 'analytics_conversion_rate' as const, value: '—%', subKey: 'analytics_last_30_days' as const, icon: '📊' },
    { labelKey: 'analytics_avg_order_value' as const, value: '$—', subKey: 'analytics_last_30_days' as const, icon: '🛒' },
  ]

  const CHARTS = [
    { titleKey: 'analytics_revenue_over_time' as const, descKey: 'analytics_chart_coming' as const, chartKey: 'analytics_traffic_sources' as const },
    { titleKey: 'analytics_top_products' as const, descKey: 'analytics_chart_coming' as const, chartKey: 'analytics_best_selling' as const },
    { titleKey: 'analytics_orders_by_status' as const, descKey: 'analytics_chart_coming' as const, chartKey: 'analytics_order_distribution' as const },
    { titleKey: 'analytics_traffic_sources' as const, descKey: 'analytics_chart_coming' as const, chartKey: 'analytics_referral_breakdown' as const },
  ]

  const ROADMAP = [
    'Sales & revenue dashboard with date range picker',
    'Product performance analytics',
    'Customer acquisition & retention metrics',
    'Google Analytics / Plausible integration',
    'Export reports to CSV/PDF',
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.analytics_title}</h1>
        <p className="text-sm text-gray-500 mt-1">{t.analytics_coming_soon_desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STATS.map(stat => (
          <div key={stat.labelKey} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{t[stat.labelKey]}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t[stat.subKey]}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CHARTS.map(chart => (
          <div key={chart.titleKey} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">{t[chart.titleKey]}</h2>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-sm">{t.analytics_chart_coming}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-3">{t.analytics_roadmap_title}</h3>
        <ul className="space-y-2 text-sm text-amber-800">
          {ROADMAP.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
