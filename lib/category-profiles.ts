// Category semantic profiles for AEO enhancement
// This data provides AI-readable content about each product category

export interface CategoryProfile {
  name: string
  slug: string
  definition: string
  howItWorks: string
  keyParameters: { name: string; unit: string; description: string }[]
  industries: string[]
  topBrands: string[]
  selectionTips: string[]
  commonApplications: string[]
  relatedKnowledge: string
}

export const categoryProfiles: Record<string, CategoryProfile> = {
  'ph-meters': {
    name: 'pH Meters',
    slug: 'ph-meters',
    definition: 'pH meters are scientific instruments that measure the acidity or alkalinity of water-based solutions on a scale of 0-14, where 7 is neutral.',
    howItWorks: 'pH meters use a glass electrode to detect hydrogen ion activity and convert it to an electrical signal, which is then displayed as a pH value.',
    keyParameters: [
      { name: 'Accuracy', unit: '±pH', description: 'Measurement precision, typically ±0.01 to ±0.1' },
      { name: 'Range', unit: 'pH units', description: 'Measurement range, usually 0-14' },
      { name: 'Resolution', unit: 'pH', description: 'Smallest detectable change, typically 0.01' },
      { name: 'Temperature', unit: '°C', description: 'Operating temperature range' }
    ],
    industries: ['Water Treatment', 'Pharmaceutical', 'Food & Beverage', 'Environmental', 'Laboratory'],
    topBrands: ['LMI', 'Lovibond', 'United Scientific', 'GF+'],
    selectionTips: [
      'Choose accuracy based on application needs (laboratory: ±0.01, industrial: ±0.1)',
      'Always select ATC (Automatic Temperature Compensation) models',
      'Match electrode type to sample (standard, semi-micro, spear-tip)'
    ],
    commonApplications: ['Water quality testing', 'Chemical process control', 'Soil testing', 'Aquarium monitoring'],
    relatedKnowledge: '/knowledge/what-is-ph-meter'
  },
  'dosing-pumps': {
    name: 'Dosing Pumps',
    slug: 'dosing-pumps',
    definition: 'Dosing pumps (metering pumps) are positive displacement pumps that inject precise, adjustable volumes of liquid into a process stream.',
    howItWorks: 'Dosing pumps use a diaphragm or piston to create alternating suction and discharge strokes, with check valves ensuring one-way flow and precise dosing volume.',
    keyParameters: [
      { name: 'Flow Rate', unit: 'L/h', description: 'Maximum output volume per hour' },
      { name: 'Pressure', unit: 'PSI/bar', description: 'Maximum system pressure rating' },
      { name: 'Turndown Ratio', unit: ':1', description: 'Range between max and min flow' },
      { name: 'Accuracy', unit: '%', description: 'Dosing precision, typically ±1-2%' }
    ],
    industries: ['Water Treatment', 'Chemical Processing', 'Oil & Gas', 'Food & Beverage', 'Agriculture'],
    topBrands: ['LMI', 'Pulsafeeder', 'Walchem'],
    selectionTips: [
      'Ensure pump pressure rating exceeds system back pressure by 25%',
      'Select materials compatible with your chemical (PVC, PVDF, SS316)',
      'Consider control requirements: manual, 4-20mA, or pulse signal'
    ],
    commonApplications: ['Chlorine dosing', 'pH adjustment', 'Fertilizer injection', 'Corrosion inhibitor dosing'],
    relatedKnowledge: '/knowledge/how-to-choose-dosing-pump'
  },
  'conductivity-meters': {
    name: 'Conductivity Meters',
    slug: 'conductivity-meters',
    definition: 'Conductivity meters measure the ability of water to conduct electrical current, which indicates the concentration of dissolved ions.',
    howItWorks: 'Conductivity meters apply an AC voltage between electrodes and measure the resulting current, converting resistance to conductivity using the cell constant.',
    keyParameters: [
      { name: 'Range', unit: 'μS/cm', description: 'Measurement range from ultrapure to seawater' },
      { name: 'Accuracy', unit: '%', description: 'Typical ±0.5-1% of reading' },
      { name: 'Cell Constant', unit: 'cm⁻¹', description: 'K=0.1 (low), K=1 (standard), K=10 (high)' },
      { name: 'TDS Factor', unit: '', description: 'Conversion factor for TDS calculation' }
    ],
    industries: ['Water Treatment', 'Pharmaceutical', 'Electronics', 'Environmental', 'Laboratory'],
    topBrands: ['LMI', 'Lovibond', 'GF+'],
    selectionTips: [
      'Select cell constant based on expected conductivity (K=0.1 for pure water, K=1 for drinking water)',
      'Choose 4-electrode cells for varying conductivity ranges',
      'Verify temperature compensation is included'
    ],
    commonApplications: ['Water purity monitoring', 'RO/DI system verification', 'Concentration measurement', 'Environmental monitoring'],
    relatedKnowledge: '/knowledge/what-is-conductivity-meter'
  },
  'orp-meters': {
    name: 'ORP Meters',
    slug: 'orp-meters',
    definition: 'ORP (Oxidation-Reduction Potential) meters measure the water\'s ability to oxidize or reduce substances, indicating sanitization effectiveness.',
    howItWorks: 'ORP meters use a platinum electrode to measure the electrical potential between the sample and a reference electrode, expressed in millivolts.',
    keyParameters: [
      { name: 'Range', unit: 'mV', description: 'Typical range -1000 to +1000 mV' },
      { name: 'Accuracy', unit: 'mV', description: 'Typical ±1-5 mV' },
      { name: 'Response Time', unit: 'sec', description: 'Time to reach stable reading' },
      { name: 'Reference', unit: '', description: 'Silver/silver chloride or calomel' }
    ],
    industries: ['Pool & Spa', 'Water Treatment', 'Aquaculture', 'Food Processing'],
    topBrands: ['LMI', 'Pulsafeeder'],
    selectionTips: [
      'For chlorine disinfection, target ORP of 650-700 mV',
      'Platinum electrodes are most common; gold for specific applications',
      'Consider combined pH/ORP meters for pool applications'
    ],
    commonApplications: ['Pool sanitization monitoring', 'Drinking water disinfection', 'Industrial oxidation processes'],
    relatedKnowledge: '/knowledge/compare/ph-meter-vs-orp-meter'
  },
  'tds-meters': {
    name: 'TDS Meters',
    slug: 'tds-meters',
    definition: 'TDS (Total Dissolved Solids) meters measure the total concentration of dissolved substances in water, expressed in mg/L or ppm.',
    howItWorks: 'TDS meters measure electrical conductivity and apply a conversion factor to calculate TDS, which represents all dissolved ions.',
    keyParameters: [
      { name: 'Range', unit: 'ppm', description: 'Measurement range up to 10,000+ ppm' },
      { name: 'Accuracy', unit: '%', description: 'Typical ±1-2% of reading' },
      { name: 'Conversion Factor', unit: '', description: 'Typically 0.5-0.7 for natural waters' },
      { name: 'Resolution', unit: 'ppm', description: 'Typically 1 ppm' }
    ],
    industries: ['Aquarium', 'Hydroponics', 'Laboratory', 'Environmental', 'Drinking Water'],
    topBrands: ['LMI', 'Lovibond'],
    selectionTips: [
      'Use appropriate conversion factor for your water type (0.67 for drinking water)',
      'EPA maximum TDS for drinking water is 500 mg/L',
      'Lower TDS may indicate aggressive water that can corrode pipes'
    ],
    commonApplications: ['Aquarium monitoring', 'Hydroponics nutrient control', 'RO system verification', 'Drinking water quality'],
    relatedKnowledge: '/knowledge/what-is-tds-meter'
  },
  'turbidity-meters': {
    name: 'Turbidity Meters',
    slug: 'turbidity-meters',
    definition: 'Turbidity meters measure water clarity by detecting suspended particles that scatter light, expressed in NTU (Nephelometric Turbidity Units).',
    howItWorks: 'Turbidity meters shine a light through the sample and measure the scattered light at 90 degrees, which is proportional to turbidity.',
    keyParameters: [
      { name: 'Range', unit: 'NTU', description: 'From 0 to 10,000+ NTU' },
      { name: 'Accuracy', unit: '%', description: 'Typically ±2% of reading' },
      { name: 'Resolution', unit: 'NTU', description: 'As low as 0.001 NTU for low-range' },
      { name: 'Light Source', unit: '', description: 'LED or tungsten lamp at 860 nm' }
    ],
    industries: ['Water Treatment', 'Environmental', 'Food & Beverage', 'Pharmaceutical'],
    topBrands: ['Lovibond', 'LMI'],
    selectionTips: [
      'EPA drinking water standard: <1 NTU (0.1 NTU recommended)',
      'Choose range based on application (low range for drinking water, high for wastewater)',
      'Consider EPA-approved methods for compliance monitoring'
    ],
    commonApplications: ['Drinking water quality', 'Wastewater monitoring', 'Environmental compliance', 'Pool testing'],
    relatedKnowledge: '/knowledge/what-is-tds-meter'
  },
  'chlorine-analyzers': {
    name: 'Chlorine Analyzers',
    slug: 'chlorine-analyzers',
    definition: 'Chlorine analyzers continuously measure free or total chlorine levels in water to ensure effective disinfection.',
    howItWorks: 'Chlorine analyzers use colorimetric, amperometric, or UV absorbance methods to determine chlorine concentration in water.',
    keyParameters: [
      { name: 'Range', unit: 'mg/L', description: 'Typically 0-10 or 0-200 mg/L' },
      { name: 'Accuracy', unit: '%', description: 'Typically ±3-5% of reading' },
      { name: 'Type', unit: '', description: 'Free, Total, or Combined chlorine' },
      { name: 'Response Time', unit: 'sec', description: 'Continuous vs periodic measurement' }
    ],
    industries: ['Water Treatment', 'Pool & Spa', 'Food & Beverage', 'Cooling Towers'],
    topBrands: ['LMI', 'Pulsafeeder', 'Walchem'],
    selectionTips: [
      'Choose free chlorine for real-time disinfection monitoring',
      'Total chlorine includes combined chlorine (chloramines)',
      'Consider amperometric sensors for lowest maintenance'
    ],
    commonApplications: ['Drinking water disinfection', 'Pool and spa monitoring', 'Cooling tower cycles', 'Process water'],
    relatedKnowledge: '/knowledge/compare/ph-meter-vs-orp-meter'
  }
}

// Get category profile by slug
export function getCategoryProfile(slug: string): CategoryProfile | undefined {
  return categoryProfiles[slug.toLowerCase()]
}

// Get all category slugs
export function getCategorySlugs(): string[] {
  return Object.keys(categoryProfiles)
}
