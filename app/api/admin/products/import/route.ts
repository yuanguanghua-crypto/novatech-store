import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for product import
const ImportProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional().default(''),
  brand: z.string().optional(),
  parent_category: z.string().optional(),
  child_category: z.string().min(1, 'Category is required'),
  our_price: z.coerce.number().positive('Price must be positive'),
  list_price: z.coerce.number().positive().optional(),
  cost_price: z.coerce.number().positive().optional(),
  availability: z.enum(['in_stock', 'out_of_stock', 'lead_time']).optional().default('in_stock'),
  stock_qty: z.coerce.number().int().min(0).optional().default(0),
  lead_time_days: z.coerce.number().int().min(0).optional(),
  weight: z.coerce.number().positive().optional(),
  weight_unit: z.enum(['lbs', 'kg', 'oz']).optional().default('lbs'),
  dimension_length: z.coerce.number().positive().optional(),
  dimension_width: z.coerce.number().positive().optional(),
  dimension_height: z.coerce.number().positive().optional(),
  dimension_unit: z.enum(['in', 'cm']).optional().default('in'),
  spec_key_1: z.string().optional(),
  spec_value_1: z.string().optional(),
  spec_key_2: z.string().optional(),
  spec_value_2: z.string().optional(),
  spec_key_3: z.string().optional(),
  spec_value_3: z.string().optional(),
  spec_key_4: z.string().optional(),
  spec_value_4: z.string().optional(),
  spec_key_5: z.string().optional(),
  spec_value_5: z.string().optional(),
  image_url_1: z.string().url().optional(),
  image_url_2: z.string().url().optional(),
  image_url_3: z.string().url().optional(),
  image_url_4: z.string().url().optional(),
  image_url_5: z.string().url().optional(),
  video_url: z.string().url().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  is_active: z.union([z.boolean(), z.string()]).transform(val => {
    if (typeof val === 'boolean') return val
    return val === 'TRUE' || val === '1' || val?.toLowerCase() === 'true'
  }).optional().default(true),
  is_featured: z.union([z.boolean(), z.string()]).transform(val => {
    if (typeof val === 'boolean') return val
    return val === 'TRUE' || val === '1' || val?.toLowerCase() === 'true'
  }).optional().default(false),
  is_new: z.union([z.boolean(), z.string()]).transform(val => {
    if (typeof val === 'boolean') return val
    return val === 'TRUE' || val === '1' || val?.toLowerCase() === 'true'
  }).optional().default(false),
  source_url: z.string().url().optional(),
})

type ImportProduct = z.infer<typeof ImportProductSchema>

interface ImportError {
  row: number
  sku: string
  error: string
}

interface ImportResult {
  success: number
  failed: number
  skipped: number
  errors: ImportError[]
}

// Helper to generate slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper to find or create category
async function findOrCreateCategory(categoryName: string, parentName?: string) {
  // Try to find existing category
  let category = await prisma.category.findFirst({
    where: { name: categoryName },
  })

  if (category) return category

  // Create new category
  let parentId: string | null = null
  
  if (parentName) {
    const parent = await prisma.category.findFirst({
      where: { name: parentName, parentId: null },
    })
    parentId = parent?.id || null
  }

  return prisma.category.create({
    data: {
      name: categoryName,
      slug: slugify(categoryName),
      parentId,
    },
  })
}

// Helper to find or create brand
async function findOrCreateBrand(brandName: string) {
  if (!brandName) return null

  let brand = await prisma.brand.findFirst({
    where: { name: brandName },
  })

  if (brand) return brand

  return prisma.brand.create({
    data: {
      name: brandName,
      slug: slugify(brandName),
    },
  })
}

// Helper to parse specs from row
function parseSpecs(row: ImportProduct): Record<string, string> {
  const specs: Record<string, string> = {}
  
  for (let i = 1; i <= 5; i++) {
    const key = row[`spec_key_${i}` as keyof ImportProduct] as string
    const value = row[`spec_value_${i}` as keyof ImportProduct] as string
    if (key && value) {
      specs[key] = value
    }
  }
  
  return specs
}

// Helper to parse images from row
function parseImages(row: ImportProduct): Array<{ url: string; altText: string; isPrimary: boolean }> {
  const images: Array<{ url: string; altText: string; isPrimary: boolean }> = []
  
  for (let i = 1; i <= 5; i++) {
    const url = row[`image_url_${i}` as keyof ImportProduct] as string
    if (url) {
      images.push({
        url,
        altText: '',
        isPrimary: i === 1,
      })
    }
  }
  
  return images
}

// Helper to build dimension string
function buildDimension(row: ImportProduct): string | undefined {
  const { dimension_length, dimension_width, dimension_height, dimension_unit } = row
  if (dimension_length && dimension_width && dimension_height) {
    return `(${dimension_length} × ${dimension_width} × ${dimension_height} ${dimension_unit})`
  }
  return undefined
}

// Parse CSV content (simple parser)
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []
  
  const headers = parseCSVLine(lines[0])
  const rows: Record<string, string>[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    
    headers.forEach((header, idx) => {
      row[header.trim()] = (values[idx] || '').trim()
    })
    
    rows.push(row)
  }
  
  return rows
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const dryRun = formData.get('dry_run') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Read file content
    const content = await file.text()
    
    // Check file type and parse accordingly
    let rows: Record<string, string>[]
    
    if (file.name.endsWith('.csv')) {
      rows = parseCSV(content)
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // For Excel files, we'd use the xlsx library
      // For now, return an error asking for CSV
      return NextResponse.json({
        error: 'Excel file support requires server configuration. Please use CSV format.',
      }, { status: 400 })
    } else {
      return NextResponse.json({
        error: 'Unsupported file format. Please use CSV format.',
      }, { status: 400 })
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No data rows found in file' }, { status: 400 })
    }

    // Process rows
    const result: ImportResult = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    }

    // Cache for categories and brands to reduce DB queries
    const categoryCache = new Map<string, any>()
    const brandCache = new Map<string, any>()

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNum = i + 2 // +2 because row 1 is header, rows are 0-indexed
      
      try {
        // Validate row
        const validated = ImportProductSchema.parse(row)
        
        // Find or create category
        let category = categoryCache.get(validated.child_category)
        if (!category) {
          category = await findOrCreateCategory(validated.child_category, validated.parent_category)
          categoryCache.set(validated.child_category, category)
        }

        // Find or create brand
        let brand = validated.brand ? brandCache.get(validated.brand) : null
        if (validated.brand && !brand) {
          brand = await findOrCreateBrand(validated.brand)
          if (brand) brandCache.set(validated.brand, brand)
        }

        // Build dimension
        const dimension = buildDimension(validated)

        // Build specs
        const specs = parseSpecs(validated)

        // Build specsFlat for search
        const specsFlat = Object.entries(specs)
          .map(([k, v]) => `${k}: ${v}`)
          .join('; ')

        // Parse images
        const images = parseImages(validated)

        // Prepare product data
        const productData = {
          sku: validated.sku,
          name: validated.name,
          slug: slugify(`${validated.sku}-${validated.name}`),
          description: validated.description || null,
          categoryId: category.id,
          brandId: brand?.id || null,
          ourPrice: validated.our_price,
          listPrice: validated.list_price,
          costPrice: validated.cost_price,
          currency: 'USD',
          availability: validated.availability,
          stockQty: validated.stock_qty,
          leadTimeDays: validated.lead_time_days,
          weight: validated.weight,
          weightUnit: validated.weight_unit,
          dimension,
          specs: Object.keys(specs).length > 0 ? specs : undefined,
          specsFlat: specsFlat || undefined,
          metaTitle: validated.meta_title,
          metaDesc: validated.meta_description,
          sourceUrl: validated.source_url,
          isActive: validated.is_active,
          isFeatured: validated.is_featured,
          isNew: validated.is_new,
        }

        if (dryRun) {
          // Dry run - just validate
          result.success++
        } else {
          // Check if product exists
          const existing = await prisma.product.findUnique({
            where: { sku: validated.sku },
          })

          if (existing) {
            // Update existing product
            await prisma.product.update({
              where: { sku: validated.sku },
              data: productData,
            })
          } else {
            // Create new product
            await prisma.product.create({ data: productData })
          }

          // Handle images (only for new products or if images provided)
          if (images.length > 0) {
            // Delete existing images for this product
            await prisma.productImage.deleteMany({
              where: { product: { sku: validated.sku } },
            })

            // Create new images
            await prisma.productImage.createMany({
              data: images.map((img, idx) => ({
                product: { connect: { sku: validated.sku } },
                url: img.url,
                altText: img.altText,
                isPrimary: img.isPrimary,
                sortOrder: idx,
              })),
            })
          }
        }

        result.success++
      } catch (error) {
        result.failed++
        result.errors.push({
          row: rowNum,
          sku: row.sku || `Row ${rowNum}`,
          error: error instanceof z.ZodError 
            ? error.errors.map(e => e.message).join(', ')
            : (error as Error).message,
        })
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Download template
export async function GET() {
  // Generate CSV template
  const headers = [
    'sku', 'name', 'description', 'brand', 'parent_category', 'child_category',
    'our_price', 'list_price', 'cost_price', 'availability', 'stock_qty',
    'lead_time_days', 'weight', 'weight_unit',
    'dimension_length', 'dimension_width', 'dimension_height', 'dimension_unit',
    'spec_key_1', 'spec_value_1', 'spec_key_2', 'spec_value_2',
    'spec_key_3', 'spec_value_3', 'spec_key_4', 'spec_value_4',
    'spec_key_5', 'spec_value_5',
    'image_url_1', 'image_url_2', 'image_url_3', 'image_url_4', 'image_url_5',
    'video_url', 'meta_title', 'meta_description',
    'is_active', 'is_featured', 'is_new', 'source_url'
  ]

  const exampleRows = [
    'SKU-001,"Sample Product Name","Product description","BrandName","Parent Cat","Child Cat",299.99,399.99,,in_stock,100,,,,,,,,"Max Flow","100 GPH","Voltage","120V',,,,,,,,,,TRUE,FALSE,FALSE,https://example.com',
  ]

  const csv = [headers.join(','), exampleRows.join(',')].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="product-import-template.csv"',
    },
  })
}
