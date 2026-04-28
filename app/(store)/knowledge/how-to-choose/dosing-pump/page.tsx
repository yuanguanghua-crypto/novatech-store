import type { Metadata } from 'next'
import { Settings } from 'lucide-react'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'

export const metadata: Metadata = {
  title: 'How to Choose a Dosing Pump - Complete Guide | LabProGlobal',
  description: 'Learn how to select the right dosing pump for your application. Step-by-step guide covering flow rate, pressure, chemical compatibility, and control options.',
  alternates: {
    canonical: '/knowledge/how-to-choose-dosing-pump',
  },
}

const faqs = [
  {
    question: 'What is the difference between fixed and variable stroke pumps?',
    answer: 'Fixed stroke pumps have a set stroke length and only offer flow adjustment via stroke frequency. Variable stroke pumps allow adjustment of both stroke length and frequency, providing much wider turndown ratios (up to 1000:1) and finer flow control.'
  },
  {
    question: 'What turndown ratio do I need?',
    answer: 'Turndown ratio indicates the range between maximum and minimum flow. For most applications, 100:1 is sufficient. For processes requiring varying demand, choose 200:1 or higher. LMI MaxRoy and Pulsafeeder Mec-O-Matic offer excellent turndown capabilities.'
  },
  {
    question: 'Do I need analog or digital controls?',
    answer: 'Choose analog for simple manual operation. Choose digital/electronic for: proportional dosing (4-20mA), batch timing, alarm outputs, data logging, or integration with PLC/SCADA systems. Digital pumps offer better accuracy and repeatability.'
  },
  {
    question: 'What maintenance do dosing pumps require?',
    answer: 'Regular maintenance includes: checking seals and diaphragms every 6-12 months, cleaning check valves quarterly, calibrating dosing monthly. Keep spare parts kit (valves, diaphragms, seals) on hand. Most major brands have service intervals of 8,000+ hours.'
  }
]

const relatedProducts = [
  { name: 'LMI B396 Series Metering Pump', slug: 'lmi-b396-series', category: 'Metering Pumps' },
  { name: 'Pulsafeeder ID Series Industrial Pump', slug: 'pulsafeeder-id-series', category: 'Industrial Pumps' },
  { name: 'Dosing Pump Accessories Kit', slug: 'dosing-accessories', category: 'Accessories' },
]

export default function HowToChooseDosingPumpPage() {
  return (
    <KnowledgePageTemplate
      category="Selection Guide"
      icon={<Settings className="w-8 h-8" />}
      title="How to Choose a Dosing Pump"
      subtitle="A comprehensive guide to selecting the right metering pump for your water treatment or industrial process application."
      sections={[
        {
          title: 'Step 1: Define Your Flow Requirements',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                The first step in selecting a dosing pump is to accurately determine your required flow rate. 
                Consider both normal operating conditions and potential variations.
              </p>
              <p><strong>Calculate Required Flow Rate:</strong></p>
              <div className="bg-gray-50 rounded-lg p-4 my-4">
                <code className="text-sm">
                  Pump Output (L/h) = (Desired Dose Rate × System Flow) ÷ Chemical Concentration
                </code>
              </div>
              <p><strong>Example:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>System flow: 100 m³/h</li>
                <li>Required chlorine dose: 5 mg/L</li>
                <li>Sodium hypochlorite concentration: 12%</li>
                <li>Calculation: (5 × 100,000) ÷ 120,000 = 4.17 L/h minimum output</li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-amber-800">
                  <strong>Tip:</strong> Select a pump with maximum output 20-30% higher than calculated to allow for future adjustments and ensure reliable operation at mid-range settings.
                </p>
              </div>
            </div>
          )
        },
        {
          title: 'Step 2: Verify Pressure Requirements',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                The pump's maximum pressure rating must exceed the system's back pressure. Include safety margins 
                for pressure fluctuations.
              </p>
              <p><strong>Calculate Total Back Pressure:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Static Head</strong>: Height difference between pump and injection point</li>
                <li><strong>Line Pressure</strong>: System pressure at injection point</li>
                <li><strong>Friction Loss</strong>: Pressure drop through piping, valves, and fittings</li>
                <li><strong>Injection Pressure</strong>: Resistance at the injection point (typically 5-20 psi)</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Rule:</strong> Pump max pressure = System max pressure × 1.25 (minimum safety factor)
                  <br />
                  Example: If system max pressure is 100 PSI, select a pump rated at least 125 PSI.
                </p>
              </div>
            </div>
          )
        },
        {
          title: 'Step 3: Ensure Chemical Compatibility',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                Material selection is critical for pump longevity and chemical feed accuracy. 
                The wrong materials can cause premature failure, leaks, or inaccurate dosing.
              </p>
              <p><strong>Common Materials and Chemical Compatibility:</strong></p>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Material</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Compatible With</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Avoid</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">PVC</td>
                      <td className="border border-gray-300 px-4 py-2">Acids, alkalis, salts, hypochlorite</td>
                      <td className="border border-gray-300 px-4 py-2">Organic solvents, concentrated acids</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">PVDF</td>
                      <td className="border border-gray-300 px-4 py-2">Acids, solvents, aggressive chemicals</td>
                      <td className="border border-gray-300 px-4 py-2">Strong bases, some ketones</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">SS316</td>
                      <td className="border border-gray-300 px-4 py-2">Most chemicals, high temperatures</td>
                      <td className="border border-gray-300 px-4 py-2">Chlorides, seawater, acids</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Polypropylene</td>
                      <td className="border border-gray-300 px-4 py-2">Acids, alkalis, alcohols</td>
                      <td className="border border-gray-300 px-4 py-2">Oxidizers, aromatics, chlorinated solvents</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        },
        {
          title: 'Step 4: Evaluate Control Options',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                Modern dosing pumps offer various control options to match your process requirements:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Basic Controls</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Manual stroke adjustment</li>
                    <li>• Stroke rate (Hz) adjustment</li>
                    <li>• On/Off switch</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Advanced Controls</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 4-20mA proportional control</li>
                    <li>• Pulse input (water meter)</li>
                    <li>• Timer/batch control</li>
                    <li>• Modbus/RS485 communication</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <p><strong>Control Type Selection:</strong></p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Constant Dosing:</strong> Manual pump with fixed stroke/frequency</li>
                  <li><strong>Flow-Proportional:</strong> Pulse signal from flow meter for proportional dosing</li>
                  <li><strong>Process Control:</strong> 4-20mA signal from PLC/controller for precise process control</li>
                  <li><strong>Multi-function:</strong> Digital pumps with all control options</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: 'Step 5: Compare Brands and Features',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                Leading metering pump brands each have distinct strengths:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">LMI (Milton Roy)</h4>
                  <ul className="text-sm space-y-1">
                    <li>✓ Electromagnetic drive technology</li>
                    <li>✓ Excellent for low-flow applications</li>
                    <li>✓ High turndown ratios</li>
                    <li>✓ Proven reliability since 1979</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Pulsafeeder</h4>
                  <ul className="text-sm space-y-1">
                    <li>✓ Higher pressure capabilities</li>
                    <li>✓ Motor-driven options</li>
                    <li>✓ FDA-compliant models</li>
                    <li>✓ Industrial-grade construction</li>
                  </ul>
                </div>
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
