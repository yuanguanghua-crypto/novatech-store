import { Metadata } from 'next'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'
import { Scale } from 'lucide-react'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Borosilicate vs Soda-Lime Glass: Which is Better for Lab Glassware? | NovaTech',
  description:
    'Detailed comparison of borosilicate 3.3 and soda-lime glass for laboratory use — thermal shock resistance, chemical durability, cost analysis, and application recommendations.',
  keywords: ['borosilicate vs soda-lime', 'lab glassware comparison', 'glass types', 'thermal shock resistance', 'chemical durability'],
}

export default function BorosilicateVsSodaLimePage() {
  return (
    <>
      <Script id="org-schema-comp1" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Borosilicate vs Soda-Lime Glass: Complete Comparison',
          author: { '@type': 'Organization', name: 'NovaTech' },
        }),
      }} />
      <KnowledgePageTemplate
        title="Borosilicate vs Soda-Lime Glass"
        subtitle="A side-by-side comparison of the two most common laboratory glass materials."
        category="Compare"
        icon={<Scale className="w-8 h-8 text-blue-600" />}
        sections={[
          {
            title: 'Material Composition',
            content: (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border font-semibold">Component</th>
                      <th className="text-left p-3 border font-semibold">Borosilicate 3.3</th>
                      <th className="text-left p-3 border font-semibold">Soda-Lime</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3 border">SiO₂ (Silica)</td><td className="p-3 border">80.6%</td><td className="p-3 border">72-75%</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">B₂O₃ (Boron Trioxide)</td><td className="p-3 border">12.6%</td><td className="p-3 border">0%</td></tr>
                    <tr><td className="p-3 border">Na₂O (Sodium Oxide)</td><td className="p-3 border">4.2%</td><td className="p-3 border">12-16%</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Other</td><td className="p-3 border">Al₂O₃ 2.2%</td><td className="p-3 border">CaO, MgO 8-12%</td></tr>
                    <tr><td className="p-3 border">Standard</td><td className="p-3 border">DIN/ISO 3585 (Type I)</td><td className="p-3 border">DIN/ISO 3585 (Type III)</td></tr>
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            title: 'Performance Comparison',
            content: (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border font-semibold">Property</th>
                      <th className="text-left p-3 border font-semibold">Borosilicate 3.3</th>
                      <th className="text-left p-3 border font-semibold">Soda-Lime</th>
                      <th className="text-left p-3 border font-semibold">Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3 border">Thermal Shock (ΔT)</td><td className="p-3 border font-medium">170°C</td><td className="p-3 border">65°C</td><td className="p-3 border text-green-600 font-bold">Borosilicate</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Max Working Temp</td><td className="p-3 border font-medium">500°C</td><td className="p-3 border">~100°C</td><td className="p-3 border text-green-600 font-bold">Borosilicate</td></tr>
                    <tr><td className="p-3 border">Chemical Resistance</td><td className="p-3 border font-medium">Excellent</td><td className="p-3 border">Limited</td><td className="p-3 border text-green-600 font-bold">Borosilicate</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Autoclavable</td><td className="p-3 border font-medium">Yes (121°C)</td><td className="p-3 border">Not recommended</td><td className="p-3 border text-green-600 font-bold">Borosilicate</td></tr>
                    <tr><td className="p-3 border">Clarity</td><td className="p-3 border">Very high</td><td className="p-3 border">Good (slight green tint)</td><td className="p-3 border">Borosilicate</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Cost</td><td className="p-3 border">1.5-3x higher</td><td className="p-3 border font-medium">Lower</td><td className="p-3 border text-amber-600 font-bold">Soda-Lime</td></tr>
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            title: 'When to Choose Each',
            content: (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Choose Borosilicate When:</h4>
                  <ul className="text-sm space-y-2">
                    <li>✓ Heating liquids or solutions</li>
                    <li>✓ Working with acids, bases, or organic solvents</li>
                    <li>✓ Autoclaving or sterilization required</li>
                    <li>✓ Analytical work with tight tolerances</li>
                    <li>✓ Any application above 100°C</li>
                    <li>✓ Distillation or reflux setups</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Choose Soda-Lime When:</h4>
                  <ul className="text-sm space-y-2">
                    <li>✓ Educational or demonstration use</li>
                    <li>✓ Display or decorative purposes</li>
                    <li>✓ Room-temperature storage only</li>
                    <li>✓ Budget is the primary constraint</li>
                    <li>✓ Non-critical applications</li>
                    <li>✓ Single-use or disposable setups</li>
                  </ul>
                </div>
              </div>
            ),
          },
          {
            title: 'Bottom Line',
            content: (
              <p>
                For any serious laboratory work, <strong>borosilicate 3.3 glass is the clear choice</strong>. The small additional cost (typically $2-5 per piece) buys you dramatically better thermal resistance, chemical durability, and safety. Soda-lime glass is only appropriate for education, display, or non-critical storage at room temperature.
              </p>
            ),
          },
        ]}
        relatedProducts={[
          { name: 'Borosilicate Griffin Beaker Set', slug: 'griffin-beaker-set', category: 'Basic Glassware' },
          { name: 'Borosilicate Erlenmeyer Flask Set', slug: 'erlenmeyer-flask-set', category: 'Basic Glassware' },
        ]}
        faqs={[
          {
            question: 'Is borosilicate glass always worth the extra cost?',
            answer: 'For laboratory work, yes. The thermal shock resistance alone (170°C vs 65°C) makes it safer. For education-only use at room temperature, soda-lime may be acceptable.',
          },
          {
            question: 'Can I tell the difference by looking at the glass?',
            answer: 'Borosilicate glass is typically clearer with minimal color. Soda-lime glass often has a slight green or yellow tint, especially visible at the edges.',
          },
          {
            question: 'Does borosilicate glass break more easily than soda-lime?',
            answer: 'No. Borosilicate glass is actually harder and more scratch-resistant than soda-lime glass. Both can break from mechanical impact, but borosilicate is more durable overall.',
          },
        ]}
      />
    </>
  )
}
