import { Metadata } from 'next'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'
import { BarChart3 } from 'lucide-react'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Class A vs Class B Glassware: Accuracy Comparison Guide | LABPRO',
  description:
    'Understand the difference between Class A and Class B laboratory glassware — tolerance standards, when to use each, and how to choose based on your application requirements.',
  keywords: ['Class A vs Class B', 'glassware accuracy', 'tolerance standards', 'laboratory measurement', 'ISO 1042'],
}

export default function ClassAvsClassBPage() {
  return (
    <>
      <Script id="org-schema-comp2" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Class A vs Class B Glassware: Accuracy Comparison Guide',
          author: { '@type': 'Organization', name: 'LABPRO' },
        }),
      }} />
      <KnowledgePageTemplate
        title="Class A vs Class B Glassware"
        subtitle="Understanding tolerance standards and choosing the right accuracy level for your laboratory work."
        category="Compare"
        icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
        sections={[
          {
            title: 'What Do Classes Mean?',
            content: (
              <div>
                <p className="mb-4">
                  Laboratory glassware is classified into accuracy classes based on tolerance standards defined by <strong>ISO 1042</strong> (volumetric glassware) and <strong>ASTM E1288</strong> (pipettes and burettes). These classes define the maximum allowable error in volume measurement.
                </p>
                <p>
                  The classification applies to volumetric glassware: graduated cylinders, volumetric flasks, burettes, and pipettes. It does NOT apply to general glassware like beakers, Erlenmeyer flasks, or funnels.
                </p>
              </div>
            ),
          },
          {
            title: 'Tolerance Comparison',
            content: (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border font-semibold">Glassware</th>
                      <th className="text-left p-3 border font-semibold">Capacity</th>
                      <th className="text-left p-3 border font-semibold">Class A Tolerance</th>
                      <th className="text-left p-3 border font-semibold">Class B Tolerance</th>
                      <th className="text-left p-3 border font-semibold">Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3 border">Graduated Cylinder</td><td className="p-3 border">10 mL</td><td className="p-3 border">±0.10 mL</td><td className="p-3 border">±0.20 mL</td><td className="p-3 border">1:2</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Graduated Cylinder</td><td className="p-3 border">100 mL</td><td className="p-3 border">±0.50 mL</td><td className="p-3 border">±1.0 mL</td><td className="p-3 border">1:2</td></tr>
                    <tr><td className="p-3 border">Volumetric Flask</td><td className="p-3 border">100 mL</td><td className="p-3 border">±0.08 mL</td><td className="p-3 border">±0.16 mL</td><td className="p-3 border">1:2</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Volumetric Flask</td><td className="p-3 border">1000 mL</td><td className="p-3 border">±0.30 mL</td><td className="p-3 border">±0.60 mL</td><td className="p-3 border">1:2</td></tr>
                    <tr><td className="p-3 border">Burette</td><td className="p-3 border">50 mL</td><td className="p-3 border">±0.05 mL</td><td className="p-3 border">±0.10 mL</td><td className="p-3 border">1:2</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Pipette</td><td className="p-3 border">10 mL</td><td className="p-3 border">±0.02 mL</td><td className="p-3 border">±0.04 mL</td><td className="p-3 border">1:2</td></tr>
                  </tbody>
                </table>
                <p className="mt-4 text-sm text-gray-600">Class B tolerance is exactly <strong>2x</strong> the Class A tolerance across all glassware types and sizes.</p>
              </div>
            ),
          },
          {
            title: 'When to Use Each Class',
            content: (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Use Class A When:</h4>
                  <ul className="text-sm space-y-2">
                    <li>✓ Analytical chemistry (titrations, dilutions)</li>
                    <li>✓ Regulatory compliance (ISO, GLP, GMP)</li>
                    <li>✓ Calibration and standard solution preparation</li>
                    <li>✓ Research with published data</li>
                    <li>✓ QC testing with customer specifications</li>
                    <li>✓ Any measurement that feeds into calculations</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Use Class B When:</h4>
                  <ul className="text-sm space-y-2">
                    <li>✓ General-purpose laboratory work</li>
                    <li>✓ Education and teaching labs</li>
                    <li>✓ Rough volume estimation</li>
                    <li>✓ Sample preparation (non-quantitative)</li>
                    <li>✓ Budget-constrained labs</li>
                    <li>✓ Preparative work (not analytical)</li>
                  </ul>
                </div>
              </div>
            ),
          },
          {
            title: 'Bottom Line',
            content: (
              <div>
                <p className="mb-4">
                  <strong>When in doubt, choose Class A.</strong> The price difference between Class A and Class B is typically 10-30%, but the accuracy improvement is 100% (2x tighter tolerance). For any work that will be reported, published, or used for regulatory compliance, Class A is non-negotiable.
                </p>
                <p>
                  Class B glassware is perfectly fine for routine lab work, education, and non-critical measurements. Don't overspend on Class A for uses where the extra precision doesn't matter — like rough dilutions or general-purpose storage.
                </p>
              </div>
            ),
          },
        ]}
        relatedProducts={[
          { name: 'Class A Graduated Cylinder 100ml', slug: 'graduated-cylinder-100ml', category: 'Analytical Glassware' },
          { name: 'Class A Volumetric Flask 250ml', slug: 'volumetric-flask-250ml', category: 'Analytical Glassware' },
          { name: 'Class A Burette 50ml', slug: 'burette-50ml', category: 'Analytical Glassware' },
        ]}
        faqs={[
          {
            question: 'Is Class B glassware inaccurate?',
            answer: 'No. Class B is still manufactured to precise standards — it just has wider tolerances than Class A. For most laboratory applications (education, prep work, general use), Class B provides perfectly adequate accuracy.',
          },
          {
            question: 'Can I use Class B glassware for titrations?',
            answer: 'For educational titrations, yes. For analytical or regulatory titrations, use Class A burettes. The tighter tolerance of Class A (±0.05 mL vs ±0.10 mL for 50 mL) significantly improves titration accuracy.',
          },
          {
            question: 'Are Class A and Class B made from different glass?',
            answer: 'No, they are made from the same borosilicate 3.3 glass. The difference is in the manufacturing precision — Class A pieces are individually calibrated and marked with tighter tolerances.',
          },
          {
            question: 'How do I identify Class A glassware?',
            answer: 'Class A glassware is marked with the letter "A" on the glass, along with the tolerance value and the standard reference (e.g., "A ±0.08 mL ISO 1042"). Class B is marked with "B".',
          },
        ]}
      />
    </>
  )
}
