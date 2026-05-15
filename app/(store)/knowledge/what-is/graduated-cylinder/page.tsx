import { Metadata } from 'next'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'
import { Beaker } from 'lucide-react'
import Script from 'next/script'

const BASE_URL = 'https://novatech-store-inky.vercel.app'

export const metadata: Metadata = {
  title: 'What is a Graduated Cylinder? Complete Laboratory Glassware Guide | LABPRO',
  description:
    'Learn what a graduated cylinder is, how it works, key selection parameters (volume, accuracy class, material), and common applications in analytical chemistry and research labs.',
  keywords: ['graduated cylinder', 'borosilicate glass', 'laboratory glassware', 'volumetric measurement', 'Class A', 'ASTM E1288'],
}

export default function GraduatedCylinderPage() {
  return (
    <>
      <Script
        id="org-schema-gc"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'What is a Graduated Cylinder? Complete Laboratory Glassware Guide',
            description: 'Comprehensive guide to graduated cylinders: types, selection criteria, and applications in analytical chemistry.',
            author: { '@type': 'Organization', name: 'LABPRO' },
            publisher: { '@type': 'Organization', name: 'LABPRO' },
          }),
        }}
      />
      <KnowledgePageTemplate
        title="What is a Graduated Cylinder?"
        subtitle="A complete guide to choosing, using, and maintaining graduated cylinders for precise liquid volume measurement."
        category="What is?"
        icon={<Beaker className="w-8 h-8 text-blue-600" />}
        sections={[
          {
            title: 'Definition',
            content: (
              <div>
                <p className="mb-4">
                  A <strong>graduated cylinder</strong> is a tall, narrow glass vessel calibrated with volume markings (graduations) used to measure liquid volumes with higher accuracy than a beaker or flask. It is one of the most fundamental pieces of laboratory glassware.
                </p>
                <p>
                  Graduated cylinders are typically made from <strong>borosilicate 3.3 glass</strong> (Type I, Class A per ASTM E1288), offering excellent chemical resistance and thermal shock tolerance up to 500°C.
                </p>
              </div>
            ),
          },
          {
            title: 'How It Works',
            content: (
              <div>
                <p className="mb-4">
                  To measure a liquid volume, you pour the liquid into the cylinder and read the <strong>meniscus</strong> (the curved surface of the liquid) at eye level. The bottom of the concave meniscus should align with the graduation mark for the desired volume.
                </p>
                <p className="mb-4">
                  Key points for accurate reading:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Place the cylinder on a flat, level surface</li>
                  <li>Read at eye level to avoid parallax error</li>
                  <li>Read the bottom of the meniscus for aqueous solutions</li>
                  <li>For mercury and convex menisci, read the top</li>
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
                      <th className="text-left p-3 border font-semibold">Parameter</th>
                      <th className="text-left p-3 border font-semibold">Typical Range</th>
                      <th className="text-left p-3 border font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3 border">Volume</td><td className="p-3 border">5 mL – 2000 mL</td><td className="p-3 border">Match size to your typical measurement range</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Accuracy Class</td><td className="p-3 border">Class A / Class B</td><td className="p-3 border">Class A: ±0.5 mL for 100 mL (tighter tolerance for analytical work)</td></tr>
                    <tr><td className="p-3 border">Material</td><td className="p-3 border">Borosilicate 3.3</td><td className="p-3 border">Superior thermal and chemical resistance vs. soda-lime</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 border">Base Shape</td><td className="p-3 border">Hexagonal / Round</td><td className="p-3 border">Hexagonal base prevents rolling; round is traditional</td></tr>
                    <tr><td className="p-3 border">Graduation Type</td><td className="p-3 border">TD / TC</td><td className="p-3 border">TD (to deliver) for most applications; TC for containment</td></tr>
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            title: 'Common Applications',
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Quantitative transfer</strong> — measuring exact volumes of reagents and solvents</li>
                <li><strong>Solution preparation</strong> — diluting stock solutions to precise concentrations</li>
                <li><strong>Serial dilutions</strong> — step-wise concentration reduction for calibration curves</li>
                <li><strong>Sample preparation</strong> — measuring extraction solvents, acid digests</li>
                <li><strong>Education</strong> — teaching volumetric technique in chemistry courses</li>
              </ul>
            ),
          },
        ]}
        relatedProducts={[
          { name: '50ml Graduated Cylinder', slug: '50ml-graduated-cylinder', category: 'Analytical Glassware' },
          { name: '100ml Graduated Cylinder', slug: '100ml-graduated-cylinder', category: 'Analytical Glassware' },
          { name: '250ml Graduated Cylinder', slug: '250ml-graduated-cylinder', category: 'Analytical Glassware' },
        ]}
        faqs={[
          {
            question: 'What is the difference between Class A and Class B graduated cylinders?',
            answer: 'Class A cylinders have tighter tolerances (±0.5 mL for 100 mL) and are certified for analytical work. Class B cylinders have double the tolerance of Class A (±1.0 mL for 100 mL) and are suitable for general-purpose use.',
          },
          {
            question: 'Can I heat a graduated cylinder?',
            answer: 'Graduated cylinders are not designed for heating. Use a beaker, flask, or boiling tube instead. Graduated cylinders are calibrated for volume at 20°C and heating can alter the calibration.',
          },
          {
            question: 'How do I choose the right size graduated cylinder?',
            answer: 'Select a cylinder where your typical measurement volume falls between 50% and 100% of the cylinder capacity. For example, measure 80 mL in a 100 mL cylinder, not a 250 mL cylinder.',
          },
          {
            question: 'What is borosilicate 3.3 glass?',
            answer: 'Borosilicate 3.3 (DIN/ISO 3585) is a Type I glass with ~81% silica, 13% boron trioxide, and ~4% sodium oxide. It offers superior thermal shock resistance (ΔT ~170°C) and chemical durability compared to soda-lime glass.',
          },
        ]}
      />
    </>
  )
}
