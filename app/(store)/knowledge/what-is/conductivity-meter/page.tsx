import type { Metadata } from 'next'
import { Activity } from 'lucide-react'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'

export const metadata: Metadata = {
  title: 'What is a Conductivity Meter? - Complete Guide | LabProGlobal',
  description: 'Learn about conductivity meters, how they measure electrical conductivity in water and solutions, and their applications in laboratories and industries.',
  alternates: {
    canonical: '/knowledge/what-is-conductivity-meter',
  },
}

const faqs = [
  {
    question: 'What is the difference between conductivity and TDS?',
    answer: 'Conductivity measures the ability of water to conduct electrical current (in μS/cm or mS/cm), while TDS (Total Dissolved Solids) measures the actual amount of dissolved substances (in mg/L or ppm). TDS can be calculated from conductivity using a conversion factor (typically 0.5-0.7 for natural waters).'
  },
  {
    question: 'What units does a conductivity meter use?',
    answer: 'Common units include: μS/cm (microsiemens per centimeter) for low conductivity, mS/cm (millisiemens per centimeter) for higher conductivity, and TDS (ppm or mg/L). Temperature is typically reported at 25°C using the coefficient α.'
  },
  {
    question: 'How do I clean a conductivity electrode?',
    answer: 'Clean electrodes with mild detergent and warm water for general use. For scale buildup, soak in dilute acid (0.1M HCl) for a few minutes. For organic contamination, use isopropyl alcohol. Always rinse thoroughly with deionized water after cleaning.'
  },
  {
    question: 'What affects conductivity measurements?',
    answer: 'Key factors include temperature (conductivity increases ~2% per °C), ionic species in solution, concentration levels, and electrode contamination. Always use ATC (Automatic Temperature Compensation) and follow proper calibration procedures.'
  }
]

const relatedProducts = [
  { name: 'LMI Conductivity Meter CD-650', slug: 'lmi-cd-650', category: 'Conductivity Meters' },
  { name: 'Lovibond Conductivity Tester', slug: 'lovibond-conductivity', category: 'Water Testing' },
  { name: 'Industrial Conductivity Sensor', slug: 'industrial-conductivity-sensor', category: 'Inline Sensors' },
]

export default function WhatIsConductivityMeterPage() {
  return (
    <KnowledgePageTemplate
      category="Technical Guide"
      icon={<Activity className="w-8 h-8" />}
      title="What is a Conductivity Meter? A Complete Guide"
      subtitle="Understanding electrical conductivity measurement, its importance in water quality testing, and how to select the right instrument."
      sections={[
        {
          title: 'Definition: What is Conductivity?',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Electrical conductivity (EC)</strong> is a measure of how well a material can conduct electric current. 
                In water quality testing, conductivity measures the ability of water to carry an electrical current, which 
                depends on the concentration of ions (charged particles) in the solution.
              </p>
              <p>
                Pure water is a poor conductor of electricity. When minerals and salts dissolve in water, they break into 
                ions, increasing the water's conductivity. Therefore, conductivity is a useful indicator of:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Total Dissolved Solids (TDS)</strong>: Higher conductivity typically means higher TDS</li>
                <li><strong>Water Purity</strong>: Deionized and distilled water have very low conductivity</li>
                <li><strong>Ionic Concentration</strong>: Indicates the amount of dissolved minerals and salts</li>
                <li><strong>Water Quality</strong>: Used to monitor process water and wastewater quality</li>
              </ul>
            </div>
          )
        },
        {
          title: 'How Does a Conductivity Meter Work?',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                A conductivity meter measures electrical resistance between two or four electrodes immersed in the sample solution:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Applied Voltage</strong>: The meter applies a small AC voltage between the electrode plates
                </li>
                <li>
                  <strong>Current Measurement</strong>: The resulting current is measured (Ohm's Law: I = V/R)
                </li>
                <li>
                  <strong>Resistance Calculation</strong>: The meter calculates resistance from voltage and current
                </li>
                <li>
                  <strong>Conductivity Conversion</strong>: Using the cell constant (K), resistance is converted to conductivity
                </li>
                <li>
                  <strong>Temperature Compensation</strong>: ATC adjusts readings to the reference temperature (usually 25°C)
                </li>
              </ol>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Formula:</strong> Conductivity (EC) = Cell Constant (K) / Resistance (R)
                  <br />
                  Where K is typically 0.1, 1.0, or 10 cm⁻¹ depending on expected conductivity range.
                </p>
              </div>
            </div>
          )
        },
        {
          title: 'Applications of Conductivity Meters',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>Conductivity measurement is essential across numerous industries:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Water Treatment</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Drinking water quality monitoring</li>
                    <li>• Wastewater treatment control</li>
                    <li>• Desalination monitoring</li>
                    <li>• Boiler water testing</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Industrial</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Pharmaceutical water systems</li>
                    <li>• Electronics manufacturing</li>
                    <li>• Food & beverage production</li>
                    <li>• Cooling tower monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'How to Choose the Right Conductivity Meter',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>Key factors for selecting a conductivity meter:</p>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <strong className="text-gray-900">Measurement Range</strong>
                    <p className="text-sm mt-1">Ultrapure water: 0.01-100 μS/cm | Drinking water: 100-1000 μS/cm | Brackish water: 1-100 mS/cm</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <strong className="text-gray-900">Accuracy Requirements</strong>
                    <p className="text-sm mt-1">Laboratory: ±0.5% of reading | Field: ±1-2% of reading | Process: ±0.1% typical</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <strong className="text-gray-900">Cell Type</strong>
                    <p className="text-sm mt-1">2-electrode for clean water | 4-electrode for varying conductivity | Inductive for harsh environments</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <strong className="text-gray-900">Output & Control</strong>
                    <p className="text-sm mt-1">Manual readings | Data logging | Analog (4-20mA) | Digital (RS485/Modbus) for process control</p>
                  </div>
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
