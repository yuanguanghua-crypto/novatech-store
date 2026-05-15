#!/usr/bin/env node
/**
 * LABPRO Products Import Script
 * 
 * 将 novatech_nova_products.json 导入 PostgreSQL 数据库
 * 
 * 用法:
 *   node scripts/import-products.js
 *   node scripts/import-products.js --dry-run    (只显示统计，不写入)
 *   node scripts/import-products.js --limit=100  (只导入前100条测试)
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// ====== 参数解析 ======
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const LIMIT = (() => {
  const a = args.find(a => a.startsWith('--limit='))
  return a ? parseInt(a.split('=')[1]) : Infinity
})()
const BATCH_SIZE = 100

// ====== 工具函数 ======
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200)
}

function parsePrice(priceStr) {
  if (!priceStr) return null
  const cleaned = priceStr.replace(/[$,\s]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

function mapAvailability(avail) {
  if (!avail) return 'in_stock'
  const a = avail.toLowerCase()
  if (a.includes('out of stock') || a === 'out_of_stock') return 'out_of_stock'
  if (a.includes('lead time')) return 'lead_time'
  return 'in_stock'
}

// 确保 slug 唯一
const usedSlugs = new Set()
function uniqueSlug(base, index) {
  // 用 base + 序号 确保绝对唯一，避免数据库唯一约束冲突
  let slug = base
  let i = index
  while (usedSlugs.has(slug)) {
    slug = `${base}-${i++}`
  }
  usedSlugs.add(slug)
  return slug
}

// ====== 主流程 ======
async function main() {
  console.log('=' .repeat(60))
  console.log('LABPRO Products Import')
  console.log(DRY_RUN ? '>>> DRY RUN MODE (no writes) <<<' : '>>> LIVE MODE <<<')
  console.log('=' .repeat(60))

  // 读取 JSON 数据
  const jsonPath = path.join(__dirname, '..', '..', 'novatech_nova_products.json')
  if (!fs.existsSync(jsonPath)) {
    // 尝试在同级目录查找
    const altPath = path.join(process.cwd(), 'novatech_nova_products.json')
    if (!fs.existsSync(altPath)) {
      console.error(`ERROR: novatech_nova_products.json not found!`)
      console.error(`Tried: ${jsonPath}`)
      console.error(`Tried: ${altPath}`)
      process.exit(1)
    }
  }

  const actualPath = fs.existsSync(path.join(__dirname, '..', '..', 'novatech_nova_products.json'))
    ? path.join(__dirname, '..', '..', 'novatech_nova_products.json')
    : path.join(process.cwd(), 'novatech_nova_products.json')

  console.log(`\nLoading: ${actualPath}`)
  const rawData = fs.readFileSync(actualPath, 'utf-8')
  let products = JSON.parse(rawData)
  console.log(`Total products loaded: ${products.length}`)

  if (LIMIT < Infinity) {
    products = products.slice(0, LIMIT)
    console.log(`Limiting to: ${LIMIT} products`)
  }

  // ====== 第一步：提取所有分类和品牌 ======
  const categoriesMap = new Map()  // name -> {name, slug, count}
  const brandsMap = new Map()       // name -> {name, slug, count}

  for (const p of products) {
    if (p.category) {
      if (!categoriesMap.has(p.category)) {
        categoriesMap.set(p.category, {
          name: p.category,
          slug: slugify(p.category),
          count: 0,
        })
      }
      categoriesMap.get(p.category).count++
    }
    if (p.brand) {
      if (!brandsMap.has(p.brand)) {
        brandsMap.set(p.brand, {
          name: p.brand,
          slug: slugify(p.brand),
          count: 0,
        })
      }
      brandsMap.get(p.brand).count++
    }
  }

  console.log(`\nCategories found: ${categoriesMap.size}`)
  console.log(`Brands found:     ${brandsMap.size}`)

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Top 10 categories:')
    Array.from(categoriesMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .forEach(c => console.log(`  ${c.name}: ${c.count}`))

    console.log('\n[DRY RUN] Top 10 brands:')
    Array.from(brandsMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .forEach(b => console.log(`  ${b.name}: ${b.count}`))

    const withPrice = products.filter(p => p.our_price && p.our_price !== '')
    const withSpecs = products.filter(p => p.specs && Object.keys(p.specs).length > 0)
    const withImage = products.filter(p => p.image && p.image !== '')
    console.log(`\n[DRY RUN] Data quality:`)
    console.log(`  With price: ${withPrice.length} (${(withPrice.length/products.length*100).toFixed(1)}%)`)
    console.log(`  With specs: ${withSpecs.length} (${(withSpecs.length/products.length*100).toFixed(1)}%)`)
    console.log(`  With image: ${withImage.length} (${(withImage.length/products.length*100).toFixed(1)}%)`)
    console.log('\nDry run complete. Run without --dry-run to import.')
    return
  }

  // ====== 第二步：写入分类 ======
  console.log('\nStep 1/4: Upserting categories...')
  const categoryIds = new Map()  // name -> id

  for (const cat of categoriesMap.values()) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: 0,
        isActive: true,
      },
    })
    categoryIds.set(cat.name, record.id)
  }
  console.log(`  ✓ ${categoryIds.size} categories ready`)

  // ====== 第三步：写入品牌 ======
  console.log('Step 2/4: Upserting brands...')
  const brandIds = new Map()  // name -> id

  for (const brand of brandsMap.values()) {
    const record = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: {
        name: brand.name,
        slug: brand.slug,
        isActive: true,
      },
    })
    brandIds.set(brand.name, record.id)
  }
  console.log(`  ✓ ${brandIds.size} brands ready`)

  // ====== 第四步：批量导入产品 ======
  console.log(`Step 3/4: Importing ${products.length} products in batches of ${BATCH_SIZE}...`)

  let imported = 0
  let skipped = 0
  let errors = 0

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE)
    const batchStart = i

    await Promise.all(
      batch.map(async (p, batchIdx) => {
        try {
          const categoryId = categoryIds.get(p.category)
          const brandId = brandIds.get(p.brand)

          if (!categoryId) {
            skipped++
            return
          }

          const price = parsePrice(p.our_price)
          const listPrice = parsePrice(p.list_price)

          // 清理 specs（移除 ns_ 前缀字段）
          const specs = p.specs
            ? Object.fromEntries(
                Object.entries(p.specs).filter(([k]) => !k.startsWith('ns_'))
              )
            : undefined

          const slug = uniqueSlug(slugify(p.sku || p.name), batchStart + batchIdx)

          await prisma.product.upsert({
            where: { sku: p.sku },
            update: {
              name: p.name || p.sku,
              description: p.description || null,
              ourPrice: price || 0,
              listPrice: listPrice || null,
              availability: mapAvailability(p.availability),
              specs: specs || undefined,
              specsFlat: p.specs_flat || null,
              images: p.image
                ? {
                    upsert: {
                      where: {
                        // 利用 productId+sortOrder 的组合来 upsert
                        // 实际上用 deleteMany + create 更简单
                        id: 'placeholder-never-matches',
                      },
                      update: { url: p.image },
                      create: {
                        url: p.image,
                        isPrimary: true,
                        sortOrder: 0,
                      },
                    },
                  }
                : undefined,
              updatedAt: new Date(),
            },
            create: {
              sku: p.sku,
              internalId: p.internalid ? String(p.internalid) : null,
              name: p.name || p.sku,
              slug,
              description: p.description || null,
              categoryId,
              brandId: brandId || null,
              ourPrice: price || 0,
              listPrice: listPrice || null,
              availability: mapAvailability(p.availability),
              specs: specs || undefined,
              specsFlat: p.specs_flat || null,
              sourceUrl: p.url || null,
              isActive: true,
              isFeatured: false,
              images: p.image
                ? {
                    create: {
                      url: p.image,
                      isPrimary: true,
                      sortOrder: 0,
                    },
                  }
                : undefined,
            },
          })
          imported++
        } catch (err) {
          errors++
          if (errors <= 5) {
            console.error(`  Error on SKU ${p.sku}:`, err.message)
          }
        }
      })
    )

    const progress = Math.min(i + BATCH_SIZE, products.length)
    const pct = (progress / products.length * 100).toFixed(1)
    process.stdout.write(`\r  Progress: ${progress}/${products.length} (${pct}%) | ✓${imported} ✗${errors} ⏭${skipped}`)
  }

  console.log(`\n\nStep 4/4: Verifying...`)
  const dbCount = await prisma.product.count()
  console.log(`  Database product count: ${dbCount}`)

  console.log('\n' + '='.repeat(60))
  console.log('Import Complete!')
  console.log(`  Imported: ${imported}`)
  console.log(`  Skipped:  ${skipped}`)
  console.log(`  Errors:   ${errors}`)
  console.log(`  DB total: ${dbCount}`)
  console.log('='.repeat(60))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
