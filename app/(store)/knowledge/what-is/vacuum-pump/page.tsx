import { Metadata } from 'next'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'
import { Wind } from 'lucide-react'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'What is Vacuum Filtration? Laboratory Filtration Glassware Guide | NovaTech',
  description:
    'Learn how vacuum filtration works, Büchner funnel and filter flask setup, selection criteria for fritted glass vs paper filtration, and common applications in analytical chemistry.',
  keywords: ['vacuum filtration', 'buchner funnel', 'filter flask', 'fritted glass', 'laboratory filtration', 'gravimetric analysis'],
}

export default function VacuumPumpPage() {
  return (
    <>
      <Script id="org-schema-vac" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'What is Vacuum Filtration? Laboratory Filtration Glassware Guide',
          author: { '@type': 'Organization', name: 'NovaTech' },
        }),
      }} />
      <KnowledgePageTemplate
        title="What is Vacuum Filtration?"
        subtitle="A complete guide to vacuum filtration apparatus — Büchner funnels, filter flasks, and fritted glass filters."
        category="What is?"
        icon={<Wind className="w-8 h-8 text-blue-600" />}
        sections={[
          {
            title: 'Definition',
            content: (
              <div>
                <p className="mb-4">
                  <strong>Vacuum filtration</strong> (also called suction filtration) is a technique that uses reduced pressure to accelerate the passage of liquid through a filter medium, separating solids from liquids much faster than gravity filtration.
                </p>
                <p>
                  The standard setup consists of a <strong>Büchner funnel</strong> (or fritted glass funnel) seated on a <strong>filter flask</strong> (thick-walled Erlenmeyer with side-arm), connected via rubber tubing to a vacuum source (aspirator or vacuum pump).
                </p>
              </div>
            ),
          },
          {
            title: 'How It Works',
            content: (
              <div>
                <p className="mb-4">
                  A filter paper (or fritted glass disc) is placed in the funnel and moistened with solvent. The vacuum creates negative pressure in the flask below, pulling the liquid through the filter while solids accumulate on the filter surface.
                </p>
                <p className="mb-4">Advantages over gravity filtration:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>5-10x faster</strong> — vacuum dramatically increases flow rate</li>
                  <li><strong>Drier precipitates</strong> — more complete liquid removal</li>
                  <li><strong>Better recovery</strong> — less loss of filtrate</li>
                  <li><strong>Handles fine particles</strong> — gravity filtration often clogs with fine precipitates</li>
                </ul>
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
                      <th className="text-left p-3 border font-semibold">Component</th>
                      <th className="text-left p-3 border font-semibold">Options</th>
                      <th className="text-left p-3 border font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3 border">Funnel Type</td><td className="p-3 border">Büchner / Fritted Glass</td><td className="p-3 border">Büchner: uses filter paper (disposable). Fritted: reusable, no paper needed.</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Funnel Diameter</td><td className="p-3 border">30 – 145 mm</td><td className="p-3 border">Match to filter paper size and batch volume</td></tr>
                    <tr><td className="p-3 border">Fritted Pore</td><td className="p-3 border">1 – 100 μm</td><td className="p-3 border">Coarse (40-100μm), Medium (10-40μm), Fine (1-10μm)</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Flask Volume</td><td className="p-3 border">250 – 2000 mL</td><td className="p-3 border">Should be 2-3x the expected filtrate volume</td></tr>
                    <tr><td className="p-3 border">Vacuum Rating</td><td className="p-3 border">25 inHg max</td><td className="p-3 border">Thick-wall flasks rated for full vacuum; never use thin-wall flasks</td></tr>
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            title: 'Common Applications',
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Gravimetric analysis</strong> — collecting and weighing precipitates for quantitative analysis</li>
                <li><strong>Sample clarification</strong> — removing particulates from liquid samples before analysis</li>
                <li><strong>Crystal collection</strong> — isolating product crystals from reaction mixtures</li>
                <li><strong>Particle size analysis</strong> — separating fractions by particle diameter</li>
                <li><strong>Environmental testing</strong> — filtering suspended solids from water samples</li>
              </ul>
            ),
          },
        ]}
        relatedProducts={[
          { name: 'Vacuum Filtration Kit 1000ml', slug: 'vacuum-filtration-kit-1000ml', category: 'Kit Products' },
          { name: 'Büchner Funnel 90mm', slug: 'buchner-funnel-90mm', category: 'Filtration Systems' },
          { name: 'Filter Flask 1000ml', slug: 'filter-flask-1000ml', category: 'Filtration Systems' },
        ]}
        faqs={[
          {
            question: 'What is the difference between Büchner funnel and fritted glass funnel?',
            answer: 'Büchner funnels use disposable filter paper and are more economical for routine work. Fritted glass funnels have a built-in porous glass disc and are reusable — no filter paper needed. Fritted funnels are preferred for fine precipitates and when filter paper contamination is a concern.',
          },
          {
            question: 'Can I use a regular Erlenmeyer flask for vacuum filtration?',
            answer: 'No. Never use a standard (thin-wall) Erlenmeyer flask under vacuum — it can implode. Always use a thick-wall filter flask (Büchner flask) with a reinforced side-arm rated for vacuum use.',
          },
          {
            question: 'How do I choose the right fritted glass pore size?',
            answer: 'Choose pore size based on your particle size: Coarse (40-100μm) for large crystals and precipitates, Medium (10-40μm) for general filtration, Fine (1-10μm) for bacterial filtration and fine precipitates.',
          },
        ]}
      />
    </>
  )
}
