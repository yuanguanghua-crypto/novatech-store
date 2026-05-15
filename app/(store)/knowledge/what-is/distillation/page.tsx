import { Metadata } from 'next'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'
import { Droplets } from 'lucide-react'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'What is Distillation? Laboratory Distillation Glassware Guide | NovaTech',
  description:
    'Learn how laboratory distillation works, types of condensers (Liebig, Graham, Allihn), complete distillation glassware setups, and selection tips for solvent purification and chemical analysis.',
  keywords: ['distillation', 'liebig condenser', 'allihn condenser', 'borosilicate glass', 'laboratory distillation', 'solvent purification'],
}

export default function DistillationPage() {
  return (
    <>
      <Script id="org-schema-distill" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'What is Distillation? Laboratory Distillation Glassware Guide',
          author: { '@type': 'Organization', name: 'NovaTech' },
        }),
      }} />
      <KnowledgePageTemplate
        title="What is Distillation?"
        subtitle="Understanding laboratory distillation — condenser types, glassware setups, and best practices for purification."
        category="What is?"
        icon={<Droplets className="w-8 h-8 text-blue-600" />}
        sections={[
          {
            title: 'Definition',
            content: (
              <div>
                <p className="mb-4">
                  <strong>Distillation</strong> is a separation technique that exploits differences in boiling points to purify or separate liquid mixtures. In the laboratory, distillation glassware assemblies are used for solvent purification, compound isolation, and purity verification.
                </p>
                <p>
                  A typical setup consists of a round-bottom flask (heating source), distillation head, condenser (cooling), thermometer adapter, and receiving flask.
                </p>
              </div>
            ),
          },
          {
            title: 'Types of Condensers',
            content: (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Liebig Condenser (Straight)</h4>
                  <p className="text-sm">Simple straight-tube design. Best for general-purpose distillation of liquids with boiling points above 100°C. Easy to clean and maintain. Available in lengths from 200mm to 600mm.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Graham Condenser (Coil)</h4>
                  <p className="text-sm">Inner coil provides maximum surface area. Ideal for low-boiling solvents (acetone, ether, DCM) where high condensation efficiency is needed. NOT suitable for distillation — only for reflux.</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Allihn Condenser (Bulb)</h4>
                  <p className="text-sm">Bulb-shaped inner tube increases surface area while preventing flooding. Designed for reflux only — the bulbs trap liquid and prevent smooth distillation. Common in organic synthesis setups.</p>
                </div>
              </div>
            ),
          },
          {
            title: 'Key Selection Parameters',
            content: (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border font-semibold">Parameter</th>
                      <th className="text-left p-3 border font-semibold">Options</th>
                      <th className="text-left p-3 border font-semibold">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3 border">Condenser Type</td><td className="p-3 border">Liebig / Graham / Allihn</td><td className="p-3 border">Liebig for distillation; Allihn/Graham for reflux only</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Length</td><td className="p-3 border">200 – 600 mm</td><td className="p-3 border">Longer = more cooling; match to solvent boiling point</td></tr>
                    <tr><td className="p-3 border">Joint Size</td><td className="p-3 border">14/20, 19/22, 24/40</td><td className="p-3 border">24/40 most common for American standard taper</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Cooling Water</td><td className="p-3 border">Bottom-in, top-out</td><td className="p-3 border">Always connect water inlet at bottom for full jacket fill</td></tr>
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            title: 'Common Applications',
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Solvent purification</strong> — drying and purifying organic solvents</li>
                <li><strong>Distillation kits</strong> — complete setups for fractional and simple distillation</li>
                <li><strong>Essential oil extraction</strong> — steam distillation of plant materials</li>
                <li><strong>Solvent recovery</strong> — reclaiming used solvents in the lab</li>
                <li><strong>Purity verification</strong> — checking boiling point matches literature values</li>
              </ul>
            ),
          },
        ]}
        relatedProducts={[
          { name: 'Distillation Kit 24/40', slug: 'distillation-kit-24-40', category: 'Distillation Systems' },
          { name: 'Liebig Condenser 400mm', slug: 'liebig-condenser-400mm', category: 'Distillation Systems' },
          { name: 'Round Bottom Flask 500ml', slug: 'round-bottom-flask-500ml', category: 'Reaction Systems' },
        ]}
        faqs={[
          {
            question: 'What is the difference between distillation and reflux?',
            answer: 'Distillation collects the condensed liquid (distillate) in a separate receiver flask. Reflux returns the condensed liquid back to the reaction flask via a vertical condenser. Use Liebig for distillation, Allihn for reflux.',
          },
          {
            question: 'Which condenser should I choose for my distillation setup?',
            answer: 'For most distillation applications, a Liebig condenser is the correct choice. It provides a straight path for distillate flow and is easy to clean. Choose the length based on your solvent: 300mm for high-boiling (>100°C), 400-600mm for low-boiling solvents.',
          },
          {
            question: 'Can I use a Graham condenser for distillation?',
            answer: 'No. Graham condensers are designed for reflux only. The coil design traps distillate and prevents it from flowing to the receiver. Use a Liebig condenser for distillation.',
          },
        ]}
      />
    </>
  )
}
