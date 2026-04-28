// Brand semantic profiles for AEO enhancement
// This data provides AI-readable content about each major brand

export interface BrandProfile {
  name: string
  slug: string
  founded?: string
  headquarters?: string
  specialty: string
  description: string
  advantage: string[]
  applications: string[]
  certifications?: string[]
  heroProducts?: string[]
  knowledgeUrl?: string
}

export const brandProfiles: Record<string, BrandProfile> = {
  'lmi': {
    name: 'LMI',
    slug: 'lmi',
    founded: '1979',
    headquarters: 'United States',
    specialty: 'Electromagnetic Metering Pumps',
    description: 'LMI (Liquid Controls) is a leading manufacturer of electromagnetic metering pumps and water analysis instruments. Founded in 1979, LMI has built a reputation for precision, reliability, and innovative design in chemical dosing applications.',
    advantage: [
      'High precision dosing accuracy (±1%)',
      'Excellent turndown ratios (up to 1000:1)',
      'Compact, lightweight design',
      'Easy to install and maintain',
      'Proven reliability with thousands of installations'
    ],
    applications: [
      'Water treatment and wastewater management',
      'Chemical processing',
      'Pool and spa disinfection',
      'Food and beverage production',
      'Agriculture and irrigation'
    ],
    certifications: ['ISO 9001', 'CE', 'NSF/ANSI 61'],
    heroProducts: [
      'LMI B395SI Series Electromagnetic Metering Pump',
      'LMI Ponsel B-131 Portable pH/ORP Meter'
    ],
    knowledgeUrl: '/knowledge/what-is-dosing-pump'
  },
  'pulsafeeder': {
    name: 'Pulsafeeder',
    slug: 'pulsafeeder',
    founded: '1946',
    headquarters: 'United States',
    specialty: 'Industrial Diaphragm Pumps',
    description: 'Pulsafeeder is a pioneer in pumping technology, established in 1946. The company specializes in industrial-grade diaphragm pumps,齿轮泵, and metering systems designed for demanding applications in chemical processing, oil and gas, and pharmaceutical industries.',
    advantage: [
      'High pressure capabilities (up to 250 PSI)',
      'Wide range of materials (316 SS, Alloy C, PTFE)',
      'FDA-compliant models available',
      'Motor-driven for continuous duty',
      'Industrial-grade construction'
    ],
    applications: [
      'Oil and gas production',
      'Pharmaceutical manufacturing',
      'Chemical processing',
      'Food and beverage',
      'Mining and mineral processing'
    ],
    certifications: ['ISO 9001', 'FDA', '3A Sanitary'],
    heroProducts: [
      'Pulsafeeder ID Series Industrial Diaphragm Pump',
      'Pulsafeeder Mec-O-Matic Electronic Dosing Pump'
    ],
    knowledgeUrl: '/knowledge/how-to-choose-dosing-pump'
  },
  'lovibond': {
    name: 'Lovibond',
    slug: 'lovibond',
    founded: '1882',
    headquarters: 'Germany',
    specialty: 'Water Quality Analysis',
    description: 'Lovibond, a German company founded in 1882, is a world leader in water testing and analysis instrumentation. With over 140 years of experience, Lovibond provides comprehensive solutions for color measurement, water testing, and environmental analysis.',
    advantage: [
      'Over 140 years of industry experience',
      'Comprehensive water testing solutions',
      'Photometric precision technology',
      'Wide range of test parameters',
      'German engineering quality'
    ],
    applications: [
      'Drinking water analysis',
      'Wastewater treatment monitoring',
      'Environmental monitoring',
      'Pool and spa water testing',
      'Food and beverage quality control'
    ],
    certifications: ['ISO 9001', 'DIN', 'CE'],
    heroProducts: [
      'Lovibond MD 600 Photometer',
      'Lovibond Pooltester Comparator'
    ],
    knowledgeUrl: '/knowledge/what-is-ph-meter'
  },
  'united-scientific': {
    name: 'United Scientific',
    slug: 'united-scientific',
    founded: '1990',
    headquarters: 'United States',
    specialty: 'Laboratory Equipment',
    description: 'United Scientific Supplies provides high-quality laboratory equipment and scientific instruments for education, research, and industrial applications. The company focuses on value-driven solutions without compromising on quality.',
    advantage: [
      'Cost-effective solutions',
      'Wide product range',
      'Education-focused design',
      'Reliable performance',
      'Good customer support'
    ],
    applications: [
      'Educational laboratories',
      'Research institutions',
      'Quality control testing',
      'Field sampling',
      'General laboratory use'
    ],
    certifications: ['ISO 9001'],
    heroProducts: [
      'United Scientific pH Test Kits',
      'United Scientific Titration Sets'
    ]
  },
  'gf': {
    name: 'GF+',
    slug: 'gf',
    founded: '1902',
    headquarters: 'Switzerland',
    specialty: 'Process Instrumentation',
    description: 'Georg Fischer (GF) Piping Systems, established in 1902, is a Swiss multinational corporation providing high-quality piping systems and process instrumentation for industrial applications worldwide.',
    advantage: [
      'Swiss engineering precision',
      'Complete system solutions',
      'Corrosion-resistant materials',
      'Global support network',
      'Long-term durability'
    ],
    applications: [
      'Chemical processing',
      'Water treatment plants',
      'Power generation',
      'Marine applications',
      'Industrial manufacturing'
    ],
    certifications: ['ISO 9001', 'ISO 14001', 'DVGW'],
    heroProducts: [
      'GF+ Signet pH/ORP Sensors',
      'GF+ Conductivity Sensors'
    ]
  },
  'walchem': {
    name: 'Walchem',
    slug: 'walchem',
    founded: '1970s',
    headquarters: 'United States',
    specialty: 'Cooling Water Treatment',
    description: 'Walchem is a manufacturer of advanced instrumentation and controllers for cooling towers, boilers, and industrial water treatment applications. Known for innovative controller technology and reliable performance.',
    advantage: [
      'Advanced controller technology',
      'Integrated system solutions',
      'Easy programming and operation',
      'Remote monitoring capability',
      'Energy-efficient designs'
    ],
    applications: [
      'Cooling tower management',
      'Boiler water treatment',
      'Industrial process water',
      'HVAC systems',
      'Commercial buildings'
    ],
    certifications: ['UL', 'CE'],
    heroProducts: [
      'Walchem WEC401 Controller',
      'Walchem Ik400 Series'
    ]
  }
}

// Get brand profile by slug
export function getBrandProfile(slug: string): BrandProfile | undefined {
  return brandProfiles[slug.toLowerCase()]
}

// Get all brand slugs
export function getBrandSlugs(): string[] {
  return Object.keys(brandProfiles)
}
