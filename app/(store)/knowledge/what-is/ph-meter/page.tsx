import type { Metadata } from 'next'
import { Beaker } from 'lucide-react'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'

export const metadata: Metadata = {
  title: 'What is a pH Meter? - Complete Guide | LabProGlobal',
  description: 'Learn what a pH meter is, how it works, its applications in laboratories and industry, and how to choose the right pH meter for your needs.',
  alternates: {
    canonical: '/knowledge/what-is-ph-meter',
  },
}

const faqs = [
  {
    question: 'What is the difference between a pH meter and pH strips?',
    answer: 'pH meters provide digital, highly accurate readings (typically ±0.01 pH) with repeatable results, while pH strips offer approximate readings (±0.5-1.0 pH) and are single-use. For laboratory and industrial applications requiring precision, pH meters are essential.'
  },
  {
    question: 'How often should I calibrate a pH meter?',
    answer: 'For most applications, calibrate your pH meter before each use or at least daily. In regulated industries (pharmaceutical, food), follow your SOPs which typically require 2-point calibration with certified buffer solutions.'
  },
  {
    question: 'What is the difference between ATC and non-ATC pH meters?',
    answer: 'ATC (Automatic Temperature Compensation) pH meters automatically adjust readings based on sample temperature, as pH values vary with temperature. Non-ATC meters require manual temperature compensation. ATC is recommended for most applications.'
  },
  {
    question: 'Can pH meters be used for industrial wastewater testing?',
    answer: 'Yes, industrial pH meters are designed for harsh environments with features like sealed probes, anti-clogging designs, and corrosion-resistant materials. They can be installed inline or used for spot sampling.'
  }
]

const relatedProducts = [
  { name: 'LMI Ponsel pH Meter B-131', slug: 'lmipph-b131', category: 'pH Meters' },
  { name: 'Pulsafeeder pH Controller', slug: 'pulsafeeder-ph-controller', category: 'pH Controllers' },
  { name: 'Lovibond pH Test Kit', slug: 'lovibond-ph-test-kit', category: 'Water Testing' },
]

export default function WhatIsPHMeterPage() {
  return (
    <KnowledgePageTemplate
      category="Technical Guide"
      icon={<Beaker className="w-8 h-8" />}
      title="What is a pH Meter? A Complete Guide"
      subtitle="Understanding pH measurement technology, applications, and selection criteria for laboratories and industrial use."
      sections={[
        {
          title: 'Definition: What is a pH Meter?',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                A <strong>pH meter</strong> is a scientific instrument that measures the hydrogen-ion activity in water-based solutions, 
                indicating its acidity or alkalinity on a scale of 0-14. The term "pH" stands for "potential of hydrogen" and 
                represents the negative logarithm of the hydrogen ion concentration.
              </p>
              <p>
                Modern pH meters consist of two main components:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>pH Electrode (Probe)</strong>: A glass membrane sensor that generates a small electrical voltage proportional to the hydrogen ion activity</li>
                <li><strong>Meter (Electronics)</strong>: A digital display unit that amplifies, processes, and displays the voltage as a pH value</li>
              </ul>
              <p>
                A reading of 7.0 is considered neutral, below 7.0 indicates acidity (more H+ ions), and above 7.0 indicates alkalinity (more OH- ions).
              </p>
            </div>
          )
        },
        {
          title: 'How Does a pH Meter Work?',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                The pH measurement process involves the following steps:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Reference Electrode</strong>: Maintains a constant electrical potential (typically 0V) using a saturated KCl solution
                </li>
                <li>
                  <strong>Measuring Electrode</strong>: The glass membrane responds to H+ ions, generating a voltage that changes with pH
                </li>
                <li>
                  <strong>Potential Difference</strong>: The meter measures the voltage difference between the two electrodes
                </li>
                <li>
                  <strong>Temperature Compensation</strong>: Modern meters automatically adjust for temperature effects using ATC (Automatic Temperature Compensation)
                </li>
                <li>
                  <strong>Digital Display</strong>: The processed signal is converted to a pH value shown on the display
                </li>
              </ol>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Key Principle:</strong> The Nernst equation describes the relationship between electrode potential and ion activity. 
                  At 25°C, the electrode produces approximately 59.16 mV per pH unit.
                </p>
              </div>
            </div>
          )
        },
        {
          title: 'Applications of pH Meters',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>pH meters are essential instruments across numerous industries:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Laboratory</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Research & Development</li>
                    <li>• Quality Control Testing</li>
                    <li>• Educational Institutions</li>
                    <li>• Pharmaceutical Testing</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Industrial</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Water & Wastewater Treatment</li>
                    <li>• Food & Beverage Production</li>
                    <li>• Chemical Manufacturing</li>
                    <li>• Agriculture & Hydroponics</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'How to Choose the Right pH Meter',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>Consider these key factors when selecting a pH meter:</p>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <strong className="text-gray-900">Accuracy Requirements</strong>
                    <p className="text-sm mt-1">Laboratory: ±0.01 pH | Industrial: ±0.1 pH | Field: ±0.2 pH</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <strong className="text-gray-900">Sample Type</strong>
                    <p className="text-sm mt-1">Clean water, viscous solutions, semi-solids, or with particulates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <strong className="text-gray-900">Portability</strong>
                    <p className="text-sm mt-1">Benchtop for labs, handheld for field work, inline for continuous monitoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <strong className="text-gray-900">Temperature Compensation</strong>
                    <p className="text-sm mt-1">Always choose ATC (Automatic Temperature Compensation) unless measuring at 25°C only</p>
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
