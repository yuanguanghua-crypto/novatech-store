import type { Metadata } from 'next'
import { Scale } from 'lucide-react'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'

export const metadata: Metadata = {
  title: 'What is a TDS Meter? - Complete Guide | LabProGlobal',
  description: 'Learn about TDS meters, how they measure total dissolved solids in water, and their importance in water quality testing and monitoring.',
  alternates: {
    canonical: '/knowledge/what-is-tds-meter',
  },
}

const faqs = [
  {
    question: 'What is the difference between a TDS meter and a conductivity meter?',
    answer: 'A conductivity meter measures electrical conductivity (EC) directly, while a TDS meter measures EC and converts it to TDS using a conversion factor. TDS meters display results in mg/L (ppm), while conductivity meters display in μS/cm or mS/cm. Many instruments offer both measurements.'
  },
  {
    question: 'What conversion factor should I use for my TDS meter?',
    answer: 'The conversion factor (also called the "TDS multiplier") varies by water type: 0.5-0.6 for freshwater, 0.7 for brackish water, 0.8-1.0 for seawater. For most drinking water, 0.67 is commonly used. Always check your specific application requirements.'
  },
  {
    question: 'What TDS level is safe for drinking water?',
    answer: 'EPA drinking water standard for TDS is 500 mg/L (ppm) maximum. Waters below 50 mg/L may taste flat, while above 500 mg/L may taste salty or bitter. For industrial applications like brewing or laboratories, much lower TDS levels may be required.'
  },
  {
    question: 'How often should I calibrate my TDS meter?',
    answer: 'Calibrate your TDS meter regularly with certified standard solutions. For general use, calibrate weekly with 100-200 ppm buffer solution. For critical applications, calibrate before each use. Rinse the electrode with deionized water between measurements.'
  }
]

const relatedProducts = [
  { name: 'LMI TDS Meter T-901', slug: 'lmi-tds-t901', category: 'TDS Meters' },
  { name: 'Handheld TDS/Conductivity Tester', slug: 'handheld-tds-tester', category: 'Portable Testers' },
  { name: 'Inline TDS Monitor', slug: 'inline-tds-monitor', category: 'Process Monitors' },
]

export default function WhatIsTDSMeterPage() {
  return (
    <KnowledgePageTemplate
      category="Technical Guide"
      icon={<Scale className="w-8 h-8" />}
      title="What is a TDS Meter? A Complete Guide"
      subtitle="Understanding Total Dissolved Solids measurement, its importance in water quality testing, and how to use and select TDS meters."
      sections={[
        {
          title: 'Definition: What is TDS?',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Total Dissolved Solids (TDS)</strong> refers to the total concentration of dissolved substances 
                in water. These dissolved substances include minerals, salts, metals, cations, and anions that are 
                small enough to pass through a filter with pores of 2 microns (0.002 cm) or smaller.
              </p>
              <p>
                TDS is measured in milligrams per liter (mg/L) or parts per million (ppm), where 1 ppm = 1 mg/L.
              </p>
              <p>
                Common dissolved solids include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Calcium</strong> (Ca²⁺) and <strong>Magnesium</strong> (Mg²⁺) - hardness minerals</li>
                <li><strong>Sodium</strong> (Na⁺) and <strong>Potassium</strong> (K⁺)</li>
                <li><strong>Bicarbonates</strong> (HCO₃⁻), <strong>Sulfates</strong> (SO₄²⁻), <strong>Chlorides</strong> (Cl⁻)</li>
                <li><strong>Iron</strong>, <strong>Manganese</strong>, and trace metals</li>
              </ul>
            </div>
          )
        },
        {
          title: 'How Does a TDS Meter Work?',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                A TDS meter works by measuring the electrical conductivity (EC) of water and converting it to TDS:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Conductivity Measurement</strong>: The meter's electrodes measure how well the water conducts electricity
                </li>
                <li>
                  <strong>EC to TDS Conversion</strong>: The meter applies a conversion factor (typically 0.5-1.0) to calculate TDS from EC
                </li>
                <li>
                  <strong>Temperature Compensation</strong>: ATC ensures readings are normalized to 25°C (77°F)
                </li>
                <li>
                  <strong>Digital Display</strong>: The calculated TDS value is shown in ppm (mg/L)
                </li>
              </ol>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Conversion Formula:</strong> TDS (mg/L) = EC (μS/cm) × Conversion Factor
                  <br />
                  Example: 300 μS/cm × 0.67 = 201 mg/L TDS
                </p>
              </div>
            </div>
          )
        },
        {
          title: 'Applications of TDS Meters',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>TDS measurement is critical in numerous applications:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Water Quality</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Drinking water assessment</li>
                    <li>• Aquarium & fishkeeping</li>
                    <li>• Swimming pool maintenance</li>
                    <li>• Hydroponics nutrient monitoring</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Industrial</h4>
                  <ul className="text-sm space-y-1">
                    <li>• RO/DI water systems</li>
                    <li>• Laboratory water purification</li>
                    <li>• Food & beverage production</li>
                    <li>• Pharmaceutical manufacturing</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'How to Choose the Right TDS Meter',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>Consider these factors when selecting a TDS meter:</p>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <strong className="text-gray-900">Range Requirements</strong>
                    <p className="text-sm mt-1">Freshwater: 0-1000 ppm | Industrial: 0-5000 ppm | Brackish: up to 20,000 ppm</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <strong className="text-gray-900">Accuracy Needs</strong>
                    <p className="text-sm mt-1">±1-2% for general use | ±0.5% for laboratory | ±10 ppm for field work</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <strong className="text-gray-900">Portability</strong>
                    <p className="text-sm mt-1">Handheld pen-style for spot checks | Benchtop for laboratory | Inline for continuous monitoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <strong className="text-gray-900">Features</strong>
                    <p className="text-sm mt-1">Temperature display | ATC | Waterproof body | Data hold | Replaceable sensor</p>
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
