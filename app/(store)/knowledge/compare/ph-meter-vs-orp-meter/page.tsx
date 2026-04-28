import type { Metadata } from 'next'
import { GitCompare } from 'lucide-react'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'

export const metadata: Metadata = {
  title: 'pH Meter vs ORP Meter - What is the Difference? | LabProGlobal',
  description: 'Compare pH meters and ORP meters. Learn the key differences, applications, and how to choose between them for your water quality testing needs.',
  alternates: {
    canonical: '/knowledge/compare/ph-meter-vs-orp-meter',
  },
}

const faqs = [
  {
    question: 'Can one meter measure both pH and ORP?',
    answer: 'Yes! Many meters offer dual functionality, measuring both pH and ORP with a single instrument using interchangeable electrodes. LMI Ponsel meters commonly offer this capability, making them versatile for applications requiring both measurements.'
  },
  {
    question: 'Which measurement is more important for disinfection?',
    answer: 'For chlorine disinfection, ORP is often considered more practical because it directly indicates the sanitizing potential of the water, regardless of pH changes. For pool operators, many jurisdictions now require ORP monitoring over pH alone.'
  },
  {
    question: 'What ORP level indicates good water quality?',
    answer: 'For drinking water disinfection: 650-700 mV is considered good. For pools and spas: 650-750 mV indicates effective disinfection. Municipal wastewater: typically 300-500 mV. Industrial process water varies by application.'
  },
  {
    question: 'How do I maintain ORP electrodes?',
    answer: 'ORP electrodes (typically platinum or gold) require less maintenance than pH electrodes. Rinse with deionized water between measurements, avoid drying out, and clean with mild detergent if contaminated. Calibration is less frequent than pH (weekly to monthly depending on application).'
  }
]

const relatedProducts = [
  { name: 'LMI Ponsel B-131 pH/ORP Meter', slug: 'lmi-ponsen-b131', category: 'pH/ORP Meters' },
  { name: 'Pulsafeeder ORP Controller', slug: 'pulsafeeder-orp-controller', category: 'ORP Controllers' },
  { name: 'Industrial ORP Sensor', slug: 'industrial-orp-sensor', category: 'Inline Sensors' },
]

export default function ComparePHMeterVsORPMeterPage() {
  return (
    <KnowledgePageTemplate
      category="Product Comparison"
      icon={<GitCompare className="w-8 h-8" />}
      title="pH Meter vs ORP Meter: What is the Difference?"
      subtitle="Understanding the key differences between pH and ORP measurement, and how to choose the right instrument for your application."
      sections={[
        {
          title: 'Overview: pH vs ORP',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                While both pH meters and ORP meters are used for water quality monitoring, they measure 
                fundamentally different properties of water. Understanding the difference is essential 
                for selecting the right instrument.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 my-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">pH Meter</h4>
                    <p className="text-sm mt-1">Measures the hydrogen ion activity (acidity/alkalinity)</p>
                    <p className="text-sm mt-1"><strong>Scale:</strong> 0-14</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">ORP Meter</h4>
                    <p className="text-sm mt-1">Measures the oxidation-reduction potential</p>
                    <p className="text-sm mt-1"><strong>Scale:</strong> -1000 to +1000 mV</p>
                  </div>
                </div>
              </div>
              <p>
                <strong>Key Insight:</strong> pH tells you the intensity of acidity or alkalinity, while ORP tells you 
                the water's ability to oxidize or reduce contaminants. Both are important for complete water quality assessment.
              </p>
            </div>
          )
        },
        {
          title: 'What pH Measures',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>pH</strong> (potential of hydrogen) measures how acidic or alkaline (basic) a solution is on a 
                scale from 0 to 14, with 7 being neutral.
              </p>
              <p><strong>How it works:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A pH electrode contains a glass membrane sensitive to H⁺ ions</li>
                <li>When immersed in solution, the electrode generates a voltage proportional to H⁺ concentration</li>
                <li>The meter converts this voltage to a pH reading using the Nernst equation</li>
              </ul>
              <p><strong>Key applications:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Water treatment process control</li>
                <li>Chemical process monitoring</li>
                <li>Food and beverage production</li>
                <li>Environmental monitoring</li>
                <li>Laboratory analysis</li>
              </ul>
            </div>
          )
        },
        {
          title: 'What ORP Measures',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>ORP</strong> (Oxidation-Reduction Potential, also called Redox) measures the tendency of a 
                solution to oxidize or reduce other substances. It's measured in millivolts (mV).
              </p>
              <p><strong>How it works:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>An ORP electrode (typically platinum or gold) measures the electrical potential</li>
                <li>This potential indicates the balance between oxidizing and reducing agents</li>
                <li>Positive ORP = oxidizing environment (chlorine, ozone)</li>
                <li>Negative ORP = reducing environment</li>
              </ul>
              <p><strong>Key applications:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Swimming pool and spa monitoring</li>
                <li>Drinking water disinfection control</li>
                <li>Industrial process water treatment</li>
                <li>Chromium reduction monitoring</li>
                <li>Cyanide destruction in mining</li>
              </ul>
            </div>
          )
        },
        {
          title: 'Comparison Table',
          content: (
            <div className="space-y-4 text-gray-600">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">pH Meter</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">ORP Meter</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">What it measures</td>
                      <td className="border border-gray-300 px-4 py-2">Hydrogen ion (H⁺) activity</td>
                      <td className="border border-gray-300 px-4 py-2">Oxidation-reduction potential</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Measurement range</td>
                      <td className="border border-gray-300 px-4 py-2">0-14 pH units</td>
                      <td className="border border-gray-300 px-4 py-2">-1000 to +1000 mV</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Electrode type</td>
                      <td className="border border-gray-300 px-4 py-2">Glass membrane</td>
                      <td className="border border-gray-300 px-4 py-2">Platinum/gold indicator</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Reference electrode</td>
                      <td className="border border-gray-300 px-4 py-2">Required (KCl filled)</td>
                      <td className="border border-gray-300 px-4 py-2">Required (KCl filled)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Calibration</td>
                      <td className="border border-gray-300 px-4 py-2">Daily recommended (2-3 points)</td>
                      <td className="border border-gray-300 px-4 py-2">Weekly to monthly (1-2 points)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Temperature effect</td>
                      <td className="border border-gray-300 px-4 py-2">Significant (requires ATC)</td>
                      <td className="border border-gray-300 px-4 py-2">Moderate</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Primary use</td>
                      <td className="border border-gray-300 px-4 py-2">Acidity/alkalinity control</td>
                      <td className="border border-gray-300 px-4 py-2">Disinfection effectiveness</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        },
        {
          title: 'When to Use Each',
          content: (
            <div className="space-y-4 text-gray-600">
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Choose pH Meter When:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Monitoring acidity for chemical processes</li>
                    <li>• Quality control in food/beverage</li>
                    <li>• Agricultural applications</li>
                    <li>• Environmental water testing</li>
                    <li>• Required by regulations</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Choose ORP Meter When:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Swimming pool/spa control</li>
                    <li>• Drinking water disinfection</li>
                    <li>• Chlorine efficacy monitoring</li>
                    <li>• Industrial oxidation processes</li>
                    <li>• Ozone/UV disinfection systems</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Pro Tip: Use Both!</h4>
                <p className="text-sm">
                  For complete water quality monitoring, many applications benefit from measuring both pH and ORP. 
                  This is especially true for disinfection systems where pH affects chlorine effectiveness. 
                  LMI Ponsel meters offer dual pH/ORP measurement in single portable instruments.
                </p>
              </div>
            </div>
          )
        }
      ]}
      relatedProducts={relatedProducts}
      faqs={faqs}
    />
  )
}
