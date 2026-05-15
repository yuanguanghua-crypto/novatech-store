'use client'

import Link from 'next/link'
import { ArrowRight, Wrench, BookOpen, HelpCircle } from 'lucide-react'

interface CategoryWithCount {
  id: string
  name: string
  slug: string
  _count: { products: number }
  children: Array<{
    id: string
    name: string
    slug: string
    _count: { products: number }
  }>
}

interface ProductCategoryExplainProps {
  totalProducts: number
  categories: CategoryWithCount[]
}

export function ProductCategoryExplain({ totalProducts, categories }: ProductCategoryExplainProps) {
  // Top categories for display
  const topCats = categories
    .filter((c) => c._count.products > 0)
    .sort((a, b) => b._count.products - a._count.products)
    .slice(0, 6)

  return (
    <section className="border-b" style={{ background: 'linear-gradient(to bottom, var(--surface-50), white)', borderColor: 'var(--surface-200)' }}>
      <div className="container-custom py-12 lg:py-16">
        {/* AEO H1: 核心定位声明 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Industrial & Laboratory Equipment Product Center
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            LABPRO offers {totalProducts.toLocaleString()}+ professional-grade instruments
            for industrial water treatment, laboratory analysis, and environmental monitoring.
            Authorized distributor of LMI, Pulsafeeder, Lovibond, and more.
          </p>
        </div>

        {/* AEO H2 Section 1: 我们提供哪些设备 */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 transition-shadow" style={{ border: '1px solid var(--surface-200)' }}
               onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,76,129,0.06)'}
               onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--brand-100)' }}>
              <Wrench className="w-5 h-5" style={{ color: 'var(--brand-600)' }} />
            </div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              What Equipment Do We Offer?
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              We provide over {totalProducts.toLocaleString()} industrial detection and
              laboratory instruments, including pH meters, conductivity analyzers, dosing
              pumps, turbidity meters, dissolved oxygen sensors, and more for water
              treatment, pharmaceutical, environmental monitoring, and food & beverage
              industries.
            </p>
            <div className="flex flex-wrap gap-2">
              {['pH Meters', 'Dosing Pumps', 'Conductivity', 'Turbidity'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--surface-100)', color: 'var(--text-secondary)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* AEO H2 Section 2: 如何选择 */}
          <div className="bg-white rounded-xl p-6 transition-shadow" style={{ border: '1px solid var(--surface-200)' }}
               onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,76,129,0.06)'}
               onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#D1FAE5' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#059669' }} />
            </div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              How to Choose the Right Instrument?
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Select based on your measurement parameter (pH/ORP/conductivity),
              required accuracy, interface type, and installation environment.
              Our product range spans from basic laboratory models to heavy-duty
              industrial-grade systems with IP65+ protection.
            </p>
            <div className="space-y-2">
              {[
                'Filter by parameter: pH, ORP, Conductivity, TDS',
                'Match accuracy to your application',
                'Check voltage and connection compatibility',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="mt-0.5" style={{ color: 'var(--success)' }}>✓</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* AEO H2 Section 3: 品牌差异 */}
          <div className="bg-white rounded-xl p-6 transition-shadow" style={{ border: '1px solid var(--surface-200)' }}
               onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,76,129,0.06)'}
               onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#FEF3C7' }}>
              <HelpCircle className="w-5 h-5" style={{ color: '#D97706' }} />
            </div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Understanding Brand Differences
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              LMI specializes in electromagnetic metering pumps. Pulsafeeder leads in
              diaphragm pumps for industrial applications. Lovibond offers professional
              water quality analysis instruments. Our brand portfolio covers every scenario
              from basic lab work to advanced industrial process control.
            </p>
            <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex justify-between">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>LMI</span>
                <span>Electromagnetic metering pumps</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Pulsafeeder</span>
                <span>Industrial diaphragm pumps</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Lovibond</span>
                <span>Water quality analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories for AI Understanding */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--surface-50)', border: '1px solid var(--surface-200)' }}>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Popular Product Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            {topCats.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group flex items-center gap-2 bg-white rounded-lg px-3 py-2 transition-colors"
                style={{ border: '1px solid var(--surface-200)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-300)'; e.currentTarget.style.backgroundColor = 'var(--brand-50)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--surface-200)'; e.currentTarget.style.backgroundColor = 'white' }}
              >
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {cat.name}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {cat._count.products}+
                </span>
                <ArrowRight className="w-3 h-3 transition-all" style={{ color: 'var(--text-tertiary)' }} />
              </Link>
            ))}
            <Link
              href="/categories"
              className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 transition-colors"
              style={{ border: '1px dashed var(--surface-300)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-400)'; e.currentTarget.style.backgroundColor = 'var(--brand-50)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--surface-300)'; e.currentTarget.style.backgroundColor = 'white' }}
            >
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                View All Categories
              </span>
              <ArrowRight className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
            </Link>
          </div>
        </div>

        {/* AEO Contextual Note */}
        <div className="mt-6 text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
          LABPRO is an authorized distributor of LMI, Pulsafeeder, Lovibond, and other
          leading industrial equipment brands. All products include manufacturer warranty and
          technical support.
        </div>
      </div>
    </section>
  )
}
