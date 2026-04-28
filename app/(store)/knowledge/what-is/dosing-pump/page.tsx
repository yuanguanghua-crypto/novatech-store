import type { Metadata } from 'next'
import { Droplets } from 'lucide-react'
import { KnowledgePageTemplate } from '@/components/store/knowledge-page-template'

export const metadata: Metadata = {
  title: 'What is a Dosing Pump? - Complete Guide | LabProGlobal',
  description: 'Learn about dosing pumps, how they work, their applications in water treatment and industrial processes, and how to select the right metering pump.',
  alternates: {
    canonical: '/knowledge/what-is-dosing-pump',
  },
}

const faqs = [
  {
    question: 'What is the difference between a dosing pump and a regular pump?',
    answer: 'Dosing pumps (metering pumps) are precision instruments designed to deliver exact, adjustable volumes of chemicals or fluids. Unlike general-purpose pumps, they offer precise flow control, reproducibility, and chemical resistance for additive applications.'
  },
  {
    question: 'What types of chemicals can dosing pumps handle?',
    answer: 'Dosing pumps can handle a wide range of chemicals including acids, alkalis, oxidizers, reducers, coagulants, flocculants, disinfectants, and various industrial additives. Material selection (PVC, PVDF, stainless steel, etc.) depends on chemical compatibility.'
  },
  {
    question: 'How do I calculate the right dosing pump size?',
    answer: 'Calculate the required flow rate based on: (Desired dose rate × Flow rate of main system) ÷ Pump concentration. For example, if you need 5 ppm chlorine and your system flows 1000 L/h, with NaOCl at 12% concentration, the calculation determines pump output needed.'
  },
  {
    question: 'What is the typical maintenance interval for dosing pumps?',
    answer: 'Diaphragm dosing pumps typically require inspection every 3-6 months and complete service at 8,000-12,000 operating hours. LMI and Pulsafeeder pumps are known for reliability with routine maintenance extending pump life to 10+ years.'
  }
]

const relatedProducts = [
  { name: 'LMI B395SI-3 Electromagnetic Metering Pump', slug: 'lmi-b395si-3', category: 'Metering Pumps' },
  { name: 'Pulsafeeder ID Series Diaphragm Pump', slug: 'pulsafeeder-id-series', category: 'Industrial Pumps' },
  { name: 'LMI Chemical Dosing System', slug: 'lmi-dosing-system', category: 'Dosing Systems' },
]

export default function WhatIsDosingPumpPage() {
  return (
    <KnowledgePageTemplate
      category="Technical Guide"
      icon={<Droplets className="w-8 h-8" />}
      title="What is a Dosing Pump? A Complete Guide"
      subtitle="Understanding metering pump technology, operation principles, and selection criteria for industrial and municipal applications."
      sections={[
        {
          title: 'Definition: What is a Dosing Pump?',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                A <strong>dosing pump</strong> (also called a metering pump) is a positive displacement pump designed to 
                inject precise, adjustable volumes of liquid into a process stream. Unlike general-purpose pumps that 
                move fluid from point A to B, dosing pumps control exactly how much fluid is delivered, making them 
                essential for chemical injection applications.
              </p>
              <p>
                Dosing pumps are characterized by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>High Precision</strong>: Accuracy of ±1% or better of setpoint</li>
                <li><strong>Adjustable Flow</strong>: Manual or automatic flow rate adjustment</li>
                <li><strong>Chemical Resistance</strong>: Materials compatible with various aggressive chemicals</li>
                <li><strong>Reliability</strong>: Designed for continuous or intermittent operation</li>
              </ul>
            </div>
          )
        },
        {
          title: 'How Do Dosing Pumps Work?',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>
                There are two main types of dosing pump technologies:
              </p>
              
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">1. Electromagnetic Dosing Pumps (LMI Series)</h4>
                <p>
                  These pumps use an electromagnetic coil that creates a magnetic field when energized, pulling a 
                  diaphragm back and forth. On the suction stroke, the diaphragm creates negative pressure drawing 
                  liquid into the pump head. On the discharge stroke, it pushes liquid out through the check valve 
                  system. Flow rate is controlled by adjusting stroke length and/or stroke frequency.
                </p>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">2. Motor-Driven Diaphragm Pumps (Pulsafeeder Series)</h4>
                <p>
                  These pumps use an electric motor connected to an adjustable cam or eccentric drive mechanism. 
                  The motor drives a piston that pushes hydraulic fluid, which in turn moves the diaphragm. 
                  Motor-driven pumps typically offer higher flow rates and pressure capabilities than 
                  electromagnetic pumps.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Key Components:</strong> Both types feature a pump head (where chemical contact occurs), 
                  suction and discharge check valves (ensuring one-way flow), and a diaphragm (creating the pumping action).
                </p>
              </div>
            </div>
          )
        },
        {
          title: 'Applications of Dosing Pumps',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>Dosing pumps are critical equipment across numerous industries:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Water Treatment</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Chlorine/Sodium Hypochlorite dosing</li>
                    <li>• pH adjustment (acid/alkali)</li>
                    <li>• Fluoride addition</li>
                    <li>• Phosphate dosing</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Industrial Process</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Chemical processing</li>
                    <li>• Oil & gas production</li>
                    <li>• Food & beverage</li>
                    <li>• Pharmaceutical manufacturing</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">HVAC & Cooling</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Corrosion inhibitors</li>
                    <li>• Scale inhibitors</li>
                    <li>• Biocides</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Agriculture</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Fertigation systems</li>
                    <li>• Pesticide injection</li>
                    <li>• pH adjustment</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'How to Select the Right Dosing Pump',
          content: (
            <div className="space-y-4 text-gray-600">
              <p>Follow these steps to choose the appropriate dosing pump:</p>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <strong className="text-gray-900">Determine Required Flow Rate</strong>
                    <p className="text-sm mt-1">Calculate based on chemical dose rate and process flow. Consider both normal operation and peak demand.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <strong className="text-gray-900">Check Maximum Pressure</strong>
                    <p className="text-sm mt-1">Ensure pump pressure rating exceeds system back pressure. Include safety margin for pressure spikes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <strong className="text-gray-900">Verify Chemical Compatibility</strong>
                    <p className="text-sm mt-1">Select pump head material (PVC, PVDF, SS316, etc.) and seal material compatible with your chemical.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <strong className="text-gray-900">Consider Control Requirements</strong>
                    <p className="text-sm mt-1">Manual adjustment, analog (4-20mA), digital (RS485/Modbus), or pulse signal control options.</p>
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
