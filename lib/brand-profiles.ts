// Brand profile for NovaTech — single-brand laboratory glassware store
// This data provides AI-readable content for AEO enhancement

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
  'novatech': {
    name: 'NovaTech',
    slug: 'novatech',
    specialty: 'Borosilicate 3.3 Laboratory Glassware',
    description: 'NovaTech manufactures precision borosilicate 3.3 glassware for analytical chemistry, research laboratories, and industrial quality control. All products are crafted from Type I, Class A borosilicate glass offering superior thermal shock resistance and chemical durability.',
    advantage: [
      'Type I Class A borosilicate 3.3 glass — superior thermal shock resistance',
      'Precision-ground joints (ISO 3269) for leak-free assembly',
      'Every piece laser-etched with batch traceability code',
      'CE-marked and shipped with Certificate of Analysis',
      'Fast worldwide shipping from US/EU warehouses'
    ],
    applications: [
      'Analytical chemistry and titration',
      'Reflux and distillation setups',
      'Sample preparation and digestion',
      'Filtration and vacuum applications',
      'General-purpose laboratory work'
    ],
    certifications: ['ISO 3269', 'CE', 'DIN/ISO 3585'],
    heroProducts: [
      'NovaTech Erlenmeyer Flask Set',
      'NovaTech Borosilicate Graduated Cylinder',
      'NovaTech Round-Bottom Flask Kit'
    ],
    knowledgeUrl: '/knowledge/what-is/graduated-cylinder'
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
