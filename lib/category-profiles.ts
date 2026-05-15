// Category semantic profiles for LABPRO laboratory glassware
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
  'basic-glassware': {
    name: 'Basic Glassware',
    slug: 'basic-glassware',
    definition: 'Everyday laboratory borosilicate 3.3 glassware including beakers, Erlenmeyer flasks, graduated cylinders, test tubes, and bottles — the foundational tools of any lab.',
    howItWorks: 'Molded or hand-blown from borosilicate 3.3 glass, these pieces offer thermal shock resistance up to 500°C and excellent chemical durability. Volumetric markings are fired onto the surface for permanent readability.',
    keyParameters: [
      { name: 'Volume', unit: 'mL', description: 'Capacity range from 5 mL to 2000 mL' },
      { name: 'Tolerance', unit: '±%', description: 'Measurement accuracy class (A or B)' },
      { name: 'Material', unit: '', description: 'Borosilicate 3.3 (Type I, Class A)' },
      { name: 'Thermal Shock', unit: '°C', description: 'Max ΔT without cracking (~170°C continuous)' }
    ],
    industries: ['Research Laboratories', 'Education', 'Quality Control', 'Clinical Labs', 'Industrial Testing'],
    topBrands: ['LABPRO'],
    selectionTips: [
      'Choose Class A (ISO 1042) for analytical work; Class B for general use',
      'Match flask shape to application: conical for mixing, flat for evaporation',
      'Select graduated cylinders with hexagonal base for stability'
    ],
    commonApplications: ['Solution preparation', 'Mixing and heating', 'Volume measurement', 'Sample storage'],
    relatedKnowledge: '/knowledge/what-is/graduated-cylinder'
  },
  'analytical-glassware': {
    name: 'Analytical Glassware',
    slug: 'analytical-glassware',
    definition: 'Precision volumetric glassware including volumetric flasks, burettes, pipettes, and measuring cylinders — designed for accurate quantitative analysis.',
    howItWorks: 'Calibrated to tight tolerances (±0.01 mL for Class A) using precision bore tubing. Single-mark volumetric flasks and burettes are calibrated "to deliver" (TD) or "to contain" (TC) per ISO 648/1042.',
    keyParameters: [
      { name: 'Accuracy Class', unit: '', description: 'Class A (tight tolerance) or Class B (standard)' },
      { name: 'Calibration', unit: '', description: 'TD (to deliver) or TC (to contain)' },
      { name: 'Tolerance', unit: 'mL', description: 'Typically ±0.01 to ±0.50 mL depending on size' },
      { name: 'Joint Type', unit: '', description: 'Standard taper ground glass joints' }
    ],
    industries: ['Analytical Chemistry', 'Pharmaceutical QC', 'Environmental Testing', 'Food Testing', 'Clinical Chemistry'],
    topBrands: ['LABPRO'],
    selectionTips: [
      'Always use Class A for regulatory compliance and traceable results',
      'Burettes: choose PTFE stopcock for acid/alkali resistance',
      'Volumetric flasks: ensure single-mark design for dilution accuracy'
    ],
    commonApplications: ['Titration', 'Standard solution preparation', 'Serial dilutions', 'Sample quantification'],
    relatedKnowledge: '/knowledge/what-is/graduated-cylinder'
  },
  'reaction-systems': {
    name: 'Reaction Systems',
    slug: 'reaction-systems',
    definition: 'Borosilicate reaction vessels including round-bottom flasks, boiling flasks, Schlenk flasks, and three-neck flasks for chemical synthesis and controlled reactions.',
    howItWorks: 'Round-bottom flasks distribute heat evenly in heating mantles or oil baths. Multiple neck configurations allow simultaneous addition, stirring, reflux, and temperature monitoring during synthesis.',
    keyParameters: [
      { name: 'Volume', unit: 'mL', description: 'Range from 50 mL to 5000 mL' },
      { name: 'Neck Configuration', unit: '', description: 'Single, double, or three-neck' },
      { name: 'Joint Size', unit: 'mm', description: 'Standard taper joints (14/20, 19/22, 24/40)' },
      { name: 'Wall Thickness', unit: 'mm', description: 'Uniform wall for even heat distribution' }
    ],
    industries: ['Organic Chemistry', 'Pharmaceutical R&D', 'Materials Science', 'Catalysis Research', 'Petrochemical'],
    topBrands: ['LABPRO'],
    selectionTips: [
      'Match joint size to your condenser and addition funnel setup',
      'Use three-neck flasks for complex reactions requiring multiple attachments',
      'Select flask volume at 2-3x the reaction volume for safety margin'
    ],
    commonApplications: ['Chemical synthesis', 'Reflux reactions', 'Evaporation', 'Distillation feed'],
    relatedKnowledge: '/knowledge/what-is/distillation'
  },
  'distillation-systems': {
    name: 'Distillation Systems',
    slug: 'distillation-systems',
    definition: 'Complete borosilicate distillation apparatus including condensers (Liebig, Graham, Allihn), distillation heads, adapters, receiving flasks, and vacuum distillation setups.',
    howItWorks: 'Vapors rise from a heated flask through a distillation head, condense in a water-cooled condenser, and collect as purified distillate. Different condenser types optimize for different boiling point ranges and reflux requirements.',
    keyParameters: [
      { name: 'Condenser Type', unit: '', description: 'Liebig (straight), Graham (coil), Allihn (bulb)' },
      { name: 'Condenser Length', unit: 'mm', description: 'Typical 200-600 mm effective cooling length' },
      { name: 'Joint Compatibility', unit: '', description: 'Must match distillation head and receiver' },
      { name: 'Cooling', unit: '', description: 'Water jacket flow rate and temperature' }
    ],
    industries: ['Chemical Manufacturing', 'Pharmaceutical', 'Essential Oil Extraction', 'Solvent Recovery', 'Academic Research'],
    topBrands: ['LABPRO'],
    selectionTips: [
      'Liebig condenser: best for general distillation (simple, efficient)',
      'Graham condenser: highest surface area for low-boiling solvents',
      'Allihn condenser: for reflux (bulbs prevent flooding, NOT for distillation)'
    ],
    commonApplications: ['Solvent purification', 'Essential oil distillation', 'Fractional distillation', 'Solvent recovery'],
    relatedKnowledge: '/knowledge/what-is/distillation'
  },
  'filtration-systems': {
    name: 'Filtration Systems',
    slug: 'filtration-systems',
    definition: 'Borosilicate filtration apparatus including Büchner funnels, vacuum flask assemblies, filter flasks, and fritted glass filters for solid-liquid separation.',
    howItWorks: 'Vacuum filtration uses reduced pressure to accelerate liquid flow through a filter medium. The Büchner funnel sits on a filter flask connected to a vacuum source, pulling filtrate through while retaining solids.',
    keyParameters: [
      { name: 'Funnel Diameter', unit: 'mm', description: 'Matched to filter paper size (30-145 mm)' },
      { name: 'Filtration Area', unit: 'cm²', description: 'Determines throughput capacity' },
      { name: 'Fritted Glass Pore', unit: 'μm', description: 'Coarse (40-100), medium (10-40), fine (1-10)' },
      { name: 'Vacuum Rating', unit: 'inHg', description: 'Max vacuum for filter flask (typically 25 inHg)' }
    ],
    industries: ['Analytical Chemistry', 'Environmental Testing', 'Pharmaceutical', 'Food & Beverage', 'Quality Control'],
    topBrands: ['LABPRO'],
    selectionTips: [
      'Fritted glass funnels: reusable, no filter paper needed, choose pore by particle size',
      'Büchner funnels: require filter paper, more economical for routine filtration',
      'Use filter flask side-arm with thick-wall tubing for vacuum connection'
    ],
    commonApplications: ['Gravimetric analysis', 'Precipitate collection', 'Sample clarification', 'Particle size analysis'],
    relatedKnowledge: '/knowledge/what-is/vacuum-pump'
  },
  'storage-systems': {
    name: 'Storage Systems',
    slug: 'storage-systems',
    definition: 'Borosilicate glass reagent bottles, media bottles, volumetric storage flasks, and desiccators for secure chemical and sample storage.',
    howItWorks: 'Amber glass protects light-sensitive reagents from UV degradation. Borosilicate construction resists chemical attack from acids, alkalis, and organic solvents. Ground glass or PTFE-lined caps ensure leak-proof sealing.',
    keyParameters: [
      { name: 'Capacity', unit: 'mL', description: 'Range from 30 mL to 5000 mL' },
      { name: 'Glass Type', unit: '', description: 'Clear or amber borosilicate 3.3' },
      { name: 'Cap Type', unit: '', description: 'Ground glass stopper, GL-thread, or snap-cap' },
      { name: 'Autoclavable', unit: '', description: 'Yes — up to 140°C' }
    ],
    industries: ['Research Labs', 'Pharmaceutical', 'Chemical Manufacturing', 'Food Testing', 'Clinical Labs'],
    topBrands: ['LABPRO'],
    selectionTips: [
      'Amber bottles for light-sensitive chemicals (silver nitrate, hydrogen peroxide)',
      'GL45-thread bottles for compatibility with most dispensing caps',
      'Media bottles with pouring rings for clean, drip-free dispensing'
    ],
    commonApplications: ['Reagent storage', 'Sample collection', 'Buffer preparation', 'Media storage'],
    relatedKnowledge: '/knowledge/what-is/graduated-cylinder'
  },
  'kit-products': {
    name: 'Kit Products',
    slug: 'kit-products',
    definition: 'Curated glassware kits bundling multiple pieces — complete setups for distillation, titration, filtration, or general-purpose lab starter collections.',
    howItWorks: 'Kits are pre-configured with compatible glassware pieces, matched by joint size and volume. Each kit includes a parts list and assembly diagram for immediate setup.',
    keyParameters: [
      { name: 'Kit Contents', unit: 'pcs', description: 'Number of pieces included' },
      { name: 'Joint Compatibility', unit: '', description: 'All pieces use matching joint sizes' },
      { name: 'Application', unit: '', description: 'Specific workflow (distillation, titration, etc.)' },
      { name: 'Storage', unit: '', description: 'Some kits include foam inserts or carrying cases' }
    ],
    industries: ['Educational Labs', 'Startup Labs', 'Field Research', 'Quality Control', 'DIY Chemistry'],
    topBrands: ['LABPRO'],
    selectionTips: [
      'Choose application-specific kits over general collections for better value',
      'Verify all joint sizes match before purchasing — 24/40 is most common',
      'Consider kits with PTFE stopcocks for acid/base resistance'
    ],
    commonApplications: ['Lab startup kits', 'Teaching labs', 'Field testing setups', 'Gift kits for new researchers'],
    relatedKnowledge: '/knowledge/what-is/graduated-cylinder'
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
