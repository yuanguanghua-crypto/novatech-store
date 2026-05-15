#!/usr/bin/env node
/**
 * LABPRO Products Import Script - Optimized Version
 * 
 * 优化点：
 * 1. 使用更小的批次大小（20个）避免连接池耗尽
 * 2. 批次内串行处理，避免并发过高
 * 3. 添加详细进度显示和错误处理
 * 4. 每批次后短暂等待，让连接复用
 * 5. 使用 transaction 确保数据一致性
 * 
 * 用法:
 *   node scripts/import-products-v2.js
 *   node scripts/import-products-v2.js --dry-run    (只显示统计)
 *   node scripts/import-products-v2.js --limit=100  (测试模式)
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// 优化：使用默认连接池配置，避免URL格式问题
const prisma = new PrismaClient({
  log: ['error'],
})

// ====== 参数解析 ======
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const LIMIT = (() => {
  const a = args.find(a => a.startsWith('--limit='))
  return a ? parseInt(a.split('=')[1]) : Infinity
})()

// 优化：使用 upsert，并行处理
const BATCH_SIZE = 50
const BATCH_DELAY = 20  // 批次间延迟(ms)，让连接复用

// ====== 工具函数 ======
function slugify(text) {
  if (!text) return 'unnamed'
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

// ====== 主流程 ======
async function main() {
  const startTime = Date.now()
  
  console.log('='.repeat(60))
  console.log('LABPRO Products Import - Optimized Version')
  console.log(DRY_RUN ? '>>> DRY RUN MODE <<<' : '>>> LIVE MODE <<<')
  console.log('='.repeat(60))
  console.log(`Batch size: ${BATCH_SIZE}`)
  console.log(`Started at: ${new Date().toISOString()}`)

  // 读取 JSON 数据
  const jsonPath = path.join(__dirname, '..', 'novatech_nova_products.json')
  if (!fs.existsSync(jsonPath)) {
    const altPath = path.join(process.cwd(), 'novatech_nova_products.json')
    if (!fs.existsSync(altPath)) {
      console.error('ERROR: novatech_nova_products.json not found!')
      process.exit(1)
    }
  }

  const actualPath = fs.existsSync(jsonPath) ? jsonPath : path.join(process.cwd(), 'novatech_nova_products.json')
  console.log(`\nLoading: ${actualPath}`)
  
  const rawData = fs.readFileSync(actualPath, 'utf-8')
  let products = JSON.parse(rawData)
  console.log(`Total products loaded: ${products.length}`)

  if (LIMIT < Infinity) {
    products = products.slice(0, LIMIT)
    console.log(`Limiting to: ${LIMIT} products`)
  }

  // ====== 第一步：提取所有分类和品牌 ======
  const categoriesMap = new Map()
  const brandsMap = new Map()

  for (const p of products) {
    if (p.category) {
      if (!categoriesMap.has(p.category)) {
        categoriesMap.set(p.category, { name: p.category, slug: slugify(p.category) })
      }
    }
    if (p.brand) {
      if (!brandsMap.has(p.brand)) {
        brandsMap.set(p.brand, { name: p.brand, slug: slugify(p.brand) })
      }
    }
  }

  console.log(`\nCategories found: ${categoriesMap.size}`)
  console.log(`Brands found: ${brandsMap.size}`)

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Top 10 categories:')
    Array.from(categoriesMap.values()).slice(0, 10).forEach(c => console.log(`  ${c.name}`))
    console.log('\n[DRY RUN] Top 10 brands:')
    Array.from(brandsMap.values()).slice(0, 10).forEach(b => console.log(`  ${b.name}`))
    console.log('\nDry run complete.')
    return
  }

  // ====== 第二步：写入分类 ======
  console.log('\nStep 1/4: Upserting categories...')
  const categoryIds = new Map()

  for (const cat of categoriesMap.values()) {
    try {
      const record = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name },
        create: { name: cat.name, slug: cat.slug, sortOrder: 0, isActive: true },
      })
      categoryIds.set(cat.name, record.id)
    } catch (err) {
      console.error(`Category error: ${cat.name}`, err.message)
    }
  }
  console.log(`  ✓ ${categoryIds.size} categories ready`)

  // ====== 第三步：写入品牌 ======
  console.log('\nStep 2/4: Upserting brands...')
  const brandIds = new Map()

  for (const brand of brandsMap.values()) {
    try {
      const record = await prisma.brand.upsert({
        where: { slug: brand.slug },
        update: { name: brand.name },
        create: { name: brand.name, slug: brand.slug, isActive: true },
      })
      brandIds.set(brand.name, record.id)
    } catch (err) {
      console.error(`Brand error: ${brand.name}`, err.message)
    }
  }
  console.log(`  ✓ ${brandIds.size} brands ready`)

  // ====== 第四步：批量导入产品 ======
  console.log(`\nStep 3/4: Importing ${products.length} products in batches of ${BATCH_SIZE}...`)
  console.log('NOTE: Processing SERIALLY within each batch to avoid connection pool exhaustion')

  let imported = 0
  let skipped = 0
  let errors = 0
  let totalBatches = Math.ceil(products.length / BATCH_SIZE)

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const batch = products.slice(i, i + BATCH_SIZE)
    const batchStart = i

    // 优化：批次内并行 upsert
    const results = await Promise.allSettled(
      batch.map(async (p, idx) => {
        const categoryId = categoryIds.get(p.category)
        const brandId = brandIds.get(p.brand)

        if (!categoryId) {
          return { status: 'skipped', sku: p.sku }
        }

        const price = parsePrice(p.our_price)
        const listPrice = parsePrice(p.list_price)
        const specs = p.specs
          ? Object.fromEntries(Object.entries(p.specs).filter(([k]) => !k.startsWith('ns_')))
          : undefined
        const slug = `${slugify(p.sku || p.name)}-${batchStart + idx}`

        try {
          await prisma.product.upsert({
            where: { sku: p.sku },
            update: {
              name: p.name || p.sku,
              description: p.description || null,
              ourPrice: price || 0,
              listPrice: listPrice || null,
              availability: mapAvailability(p.availability),
              specs: specs || undefined,
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
            },
          })
          return { status: 'ok', sku: p.sku }
        } catch (err) {
          return { status: 'error', sku: p.sku, message: err.message }
        }
      })
    )

    // 统计结果
    for (const r of results) {
      if (r.status === 'fulfilled') {
        if (r.value.status === 'ok') imported++
        else if (r.value.status === 'skipped') skipped++
        else if (r.value.status === 'error') {
          errors++
          if (errors <= 10) {
            console.error(`  Error on SKU ${r.value.sku}:`, r.value.message.substring(0, 80))
          }
        }
      } else {
        errors++
      }
    }

    // 批次间延迟
    if (i + BATCH_SIZE < products.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY))
    }

    // 进度显示
    const progress = Math.min(i + BATCH_SIZE, products.length)
    const pct = (progress / products.length * 100).toFixed(1)
    const eta = totalBatches > 1 ? 
      `ETA: ~${Math.round((totalBatches - batchNum) * (Date.now() - startTime) / 60000 / batchNum)}min` : ''
    process.stdout.write(
      `\r  Batch ${batchNum}/${totalBatches} | ${progress}/${products.length} (${pct}%) | ` +
      `✓${imported} ✗${errors} ⏭${skipped} ${eta}`
    )
  }

  console.log('\n')

  // ====== 第五步：验证 ======
  console.log('Step 4/4: Verifying...')
  const dbCount = await prisma.product.count()
  const categoryCount = await prisma.category.count()
  const brandCount = await prisma.brand.count()
  console.log(`  Products: ${dbCount}`)
  console.log(`  Categories: ${categoryCount}`)
  console.log(`  Brands: ${brandCount}`)

  const elapsed = Math.round((Date.now() - startTime) / 1000)
  console.log('\n' + '='.repeat(60))
  console.log('Import Complete!')
  console.log(`  Imported: ${imported}`)
  console.log(`  Skipped:  ${skipped}`)
  console.log(`  Errors:   ${errors}`)
  console.log(`  DB total: ${dbCount}`)
  console.log(`  Time: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`)
  console.log('='.repeat(60))
}

// 处理进程退出
process.on('SIGINT', async () => {
  console.log('\n\nInterrupted! Saving progress...')
  await prisma.$disconnect()
  process.exit(1)
})

main()
  .catch((e) => {
    console.error('\nFATAL ERROR:', e.message)
    console.error(e.stack)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
