import { Metadata } from 'next'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'
import { Shield } from 'lucide-react'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Laboratory Glassware Care & Maintenance Guide | NovaTech',
  description:
    'Learn how to clean, store, and maintain borosilicate laboratory glassware. Tips on washing, autoclaving, removing stains, and extending the life of your glassware.',
  keywords: ['laboratory glassware care', 'glassware cleaning', 'borosilicate maintenance', 'autoclave glassware', 'glassware storage'],
}

export default function GlasswareCarePage() {
  return (
    <>
      <Script id="org-schema-care" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Laboratory Glassware Care & Maintenance Guide',
          author: { '@type': 'Organization', name: 'NovaTech' },
        }),
      }} />
      <KnowledgePageTemplate
        title="Laboratory Glassware Care & Maintenance"
        subtitle="Best practices for cleaning, storing, and maintaining borosilicate glassware to ensure accuracy and longevity."
        category="What is?"
        icon={<Shield className="w-8 h-8 text-blue-600" />}
        sections={[
          {
            title: 'Why Glassware Care Matters',
            content: (
              <div>
                <p className="mb-4">
                  Properly maintained laboratory glassware delivers <strong>accurate, reproducible results</strong> and lasts significantly longer. Contaminated or damaged glassware can introduce errors in measurements, compromise experiment outcomes, and create safety hazards.
                </p>
                <p>
                  Borosilicate 3.3 glass is chemically resistant and durable, but it is not indestructible. Following proper cleaning, handling, and storage protocols protects your investment and ensures reliable performance.
                </p>
              </div>
            ),
          },
          {
            title: 'Cleaning Procedures',
            content: (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">1. Routine Washing</h4>
                  <p className="text-sm">Rinse immediately after use with tap water, then wash with laboratory detergent (Alconox or similar). Use a bottle brush for volumetric flasks. Rinse 3x with tap water, then 2x with deionized water.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">2. Deep Cleaning (Stains & Residue)</h4>
                  <p className="text-sm">For stubborn stains: soak in chromic acid solution (use with fume hood and PPE), or use a 1:1 HCl solution. For organic residue: soak in acetone or ethanol. For grease: use a detergent solution or acetone.</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">3. Autoclaving</h4>
                  <p className="text-sm">Borosilicate 3.3 glass is fully autoclavable at 121°C (15 psi). Ensure glassware is dry before autoclaving. Remove any plastic components or stoppers. Never autoclave volumetric glassware — it can alter calibration.</p>
                </div>
              </div>
            ),
          },
          {
            title: 'Storage Best Practices',
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dry completely</strong> before storing — water spots and microbial growth are common issues</li>
                <li><strong>Store inverted</strong> (beakers, cylinders) or upright (flasks) on padded shelves</li>
                <li><strong>Separate sizes</strong> — don't nest graduated cylinders of different sizes</li>
                <li><strong>Use foam inserts</strong> — for delicate items like volumetric flasks and burettes</li>
                <li><strong>Avoid dust</strong> — cover or store in cabinets; dust affects volume accuracy</li>
                <li><strong>Handle with care</strong> — chipped glassware can crack under thermal stress</li>
              </ul>
            ),
          },
          {
            title: 'When to Replace Glassware',
            content: (
              <div>
                <p className="mb-4">Inspect glassware regularly. Replace if you observe:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Chips or cracks</strong> — can propagate under thermal or mechanical stress</li>
                  <li><strong>Frosted/etched joints</strong> — ground glass joints that no longer seal tightly</li>
                  <li><strong>Faded graduations</strong> — volume markings that are hard to read</li>
                  <li><strong>Cloudy glass</strong> — chemical etching from harsh reagents (HF, strong alkali)</li>
                  <li><strong>Deformed necks</strong> — from repeated heating in the same spot</li>
                </ul>
              </div>
            ),
          },
        ]}
        relatedProducts={[
          { name: 'Griffin Beaker Set', slug: 'griffin-beaker-set', category: 'Basic Glassware' },
          { name: 'Erlenmeyer Flask Set', slug: 'erlenmeyer-flask-set', category: 'Basic Glassware' },
          { name: 'Graduated Cylinder Set', slug: 'graduated-cylinder-set', category: 'Analytical Glassware' },
        ]}
        faqs={[
          {
            question: 'Can I put borosilicate glassware in the dishwasher?',
            answer: 'Yes, most borosilicate glassware can be washed in a laboratory glassware dishwasher. Use a mild alkaline detergent cycle. Avoid washing precision volumetric glassware (burettes, volumetric flasks) in dishwashers — hand wash only.',
          },
          {
            question: 'How do I remove calcium deposits from glassware?',
            answer: 'Soak in a 10% HCl solution for 30 minutes, then rinse thoroughly with deionized water. For heavy deposits, use a 1:1 mixture of concentrated HCl and water.',
          },
          {
            question: 'Is borosilicate glass safe for microwave use?',
            answer: 'Borosilicate glass is generally safe for microwave heating of aqueous solutions. However, always ensure the glassware is not sealed (use loose covers) and avoid rapid temperature changes. Do not microwave volumetric glassware.',
          },
        ]}
      />
    </>
  )
}
