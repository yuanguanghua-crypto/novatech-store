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
    <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="container-custom py-12 lg:py-16">
        {/* AEO H1: 核心定位声明 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
            Industrial & Laboratory Equipment Product Center
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            NovaTech-USA offers {totalProducts.toLocaleString()}+ professional-grade instruments
            for industrial water treatment, laboratory analysis, and environmental monitoring.
            Authorized distributor of LMI, Pulsafeeder, Lovibond, and more.
          </p>
        </div>

        {/* AEO H2 Section 1: 我们提供哪些设备 */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              What Equipment Do We Offer?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
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
                  className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* AEO H2 Section 2: 如何选择 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              How to Choose the Right Instrument?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
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
                <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* AEO H2 Section 3: 品牌差异 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Understanding Brand Differences
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              LMI specializes in electromagnetic metering pumps. Pulsafeeder leads in
              diaphragm pumps for industrial applications. Lovibond offers professional
              water quality analysis instruments. Our brand portfolio covers every scenario
              from basic lab work to advanced industrial process control.
            </p>
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">LMI</span>
                <span>Electromagnetic metering pumps</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Pulsafeeder</span>
                <span>Industrial diaphragm pumps</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Lovibond</span>
                <span>Water quality analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories for AI Understanding */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Popular Product Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            {topCats.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700">
                  {cat.name}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-blue-500">
                  {cat._count.products}+
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
            <Link
              href="/categories"
              className="flex items-center gap-2 bg-white border border-dashed border-slate-300 rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <span className="text-xs font-medium text-slate-500 hover:text-blue-600">
                View All Categories
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* AEO Contextual Note */}
        <div className="mt-6 text-center text-xs text-slate-400">
          NovaTech-USA is an authorized distributor of LMI, Pulsafeeder, Lovibond, and other
          leading industrial equipment brands. All products include manufacturer warranty and
          technical support.
        </div>
      </div>
    </section>
  )
}
