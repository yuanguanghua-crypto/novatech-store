import { Metadata } from 'next'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'
import { FlaskConical } from 'lucide-react'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'How to Choose Laboratory Glassware? Complete Selection Guide | NovaTech',
  description:
    'Expert guide to selecting the right laboratory glassware — material choice (borosilicate vs soda-lime), accuracy classes, joint sizes, and application-specific recommendations.',
  keywords: ['laboratory glassware selection', 'borosilicate glass', 'Class A glassware', 'glassware buying guide', 'lab equipment selection'],
}

export default function HowToChooseGlasswarePage() {
  return (
    <>
      <Script id="org-schema-htc" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to Choose Laboratory Glassware',
          description: 'Step-by-step guide to selecting the right laboratory glassware for your application.',
          step: [
            { '@type': 'HowToStep', position: 1, name: 'Determine Your Application', text: 'Identify whether you need measurement, reaction, distillation, or filtration glassware.' },
            { '@type': 'HowToStep', position: 2, name: 'Choose the Material', text: 'Select borosilicate 3.3 for chemical resistance and thermal shock tolerance.' },
            { '@type': 'HowToStep', position: 3, name: 'Select Accuracy Class', text: 'Class A for analytical work; Class B for general laboratory use.' },
            { '@type': 'HowToStep', position: 4, name: 'Match Joint Sizes', text: 'Ensure all glassware pieces have compatible joint sizes for your setup.' },
          ],
        }),
      }} />
      <KnowledgePageTemplate
        title="How to Choose Laboratory Glassware"
        subtitle="A step-by-step selection guide for choosing the right glassware material, accuracy class, and configuration."
        category="How to Choose"
        icon={<FlaskConical className="w-8 h-8 text-blue-600" />}
        sections={[
          {
            title: 'Step 1: Determine Your Application',
            content: (
              <div className="space-y-4">
                <p className="mb-4">Your application determines the type of glassware you need:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg text-sm">
                    <strong>Volume Measurement</strong><br />Graduated cylinders, volumetric flasks, burettes, pipettes
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-sm">
                    <strong>Heating & Mixing</strong><br />Beakers, Erlenmeyer flasks, boiling tubes
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg text-sm">
                    <strong>Distillation</strong><br />Round-bottom flasks, condensers, adapters, receiving flasks
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-sm">
                    <strong>Filtration</strong><br />Büchner funnels, filter flasks, fritted glass funnels
                  </div>
                </div>
              </div>
            ),
          },
          {
            title: 'Step 2: Choose the Material',
            content: (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border font-semibold">Property</th>
                      <th className="text-left p-3 border font-semibold">Borosilicate 3.3</th>
                      <th className="text-left p-3 border font-semibold">Soda-Lime</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3 border">Thermal Shock</td><td className="p-3 border font-medium text-green-700">ΔT ~170°C ✓</td><td className="p-3 border">ΔT ~65°C</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Chemical Resistance</td><td className="p-3 border font-medium text-green-700">Excellent ✓</td><td className="p-3 border">Good (limited acid/alkali)</td></tr>
                    <tr><td className="p-3 border">Autoclavable</td><td className="p-3 border font-medium text-green-700">Yes ✓</td><td className="p-3 border">Not recommended</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Cost</td><td className="p-3 border">Higher</td><td className="p-3 border font-medium">Lower</td></tr>
                    <tr><td className="p-3 border">Best For</td><td className="p-3 border">Analytical, research, QC</td><td className="p-3 border">Education, display, non-critical</td></tr>
                  </tbody>
                </table>
                <p className="mt-4 text-sm text-gray-600"><strong>Recommendation:</strong> Always choose borosilicate 3.3 (DIN/ISO 3585) for laboratory work. The small price premium is worth the superior performance and safety.</p>
              </div>
            ),
          },
          {
            title: 'Step 3: Select Accuracy Class',
            content: (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Class A (ISO 1042 / ASTM E1288)</h4>
                  <p className="text-sm">Tighter tolerances (e.g., ±0.5 mL for 100 mL cylinder). Required for analytical work, regulatory compliance, and any measurement that feeds into calculations. Marked with "A" on the glassware.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Class B</h4>
                  <p className="text-sm">Double the tolerance of Class A (e.g., ±1.0 mL for 100 mL cylinder). Suitable for general-purpose work, education, and non-critical measurements. More economical.</p>
                </div>
                <p className="text-sm text-gray-600"><strong>Rule of thumb:</strong> If the measurement result feeds into a calculation or is reported to a client/regulator, use Class A.</p>
              </div>
            ),
          },
          {
            title: 'Step 4: Match Joint Sizes',
            content: (
              <div>
                <p className="mb-4">When building multi-piece setups (distillation, reflux, filtration), <strong>all joints must be compatible</strong>. Common standards:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>14/20</strong> — Micro-scale and small setups (50-100 mL)</li>
                  <li><strong>19/22</strong> — Mid-range setups (100-250 mL)</li>
                  <li><strong>24/40</strong> — Most common; standard for 250-1000 mL setups</li>
                  <li><strong>29/42</strong> — Large-scale setups (1000-5000 mL)</li>
                </ul>
                <p className="text-sm text-gray-600"><strong>Tip:</strong> Standardize on 24/40 joints for most of your inventory — it's the most widely available and compatible.</p>
              </div>
            ),
          },
        ]}
        relatedProducts={[
          { name: 'Organic Synthesis Starter Kit Medium', slug: 'organic-synthesis-kit-medium', category: 'Kit Products' },
          { name: 'Distillation Kit 24/40 Complete Set', slug: 'distillation-kit-24-40', category: 'Kit Products' },
          { name: 'Vacuum Filtration Kit 1000ml', slug: 'vacuum-filtration-kit-1000ml', category: 'Kit Products' },
        ]}
        faqs={[
          {
            question: 'Should I buy individual glassware or a kit?',
            answer: 'For new labs or specific applications, kits provide better value and ensure all pieces are compatible. For experienced labs with established needs, buying individual pieces allows you to customize your inventory.',
          },
          {
            question: 'What is the most essential glassware for a new lab?',
            answer: 'Start with: graduated cylinders (10, 25, 50, 100 mL), Erlenmeyer flasks (125, 250, 500 mL), beakers (50, 100, 250, 500 mL), volumetric flasks (100, 250, 500, 1000 mL), and a set of volumetric pipettes.',
          },
          {
            question: 'Can I mix different glassware pieces in one setup?',
            answer: 'Yes, as long as the joint sizes are compatible (e.g., all 24/40). Using glassware from the same manufacturer ensures the tightest fit and consistent joint taper.',
          },
        ]}
      />
    </>
  )
}
