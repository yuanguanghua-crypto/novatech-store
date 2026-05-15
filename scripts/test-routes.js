/**
 * LABPRO Store - Automated Route Testing System v2
 *
 * Features:
 * 1. Scan ALL pages (including route groups like (store))
 * 2. Extract navigation links from all source files
 * 3. Test HTTP endpoints
 * 4. Test DB dynamic routes
 * 5. Generate comprehensive report
 *
 * Usage: node scripts/test-routes.js [--server=http://localhost:3000]
 */

const fs = require('fs')
const path = require('path')
const http = require('http')

const SERVER = process.argv.find(a => a.startsWith('--server='))
  ? process.argv.find(a => a.startsWith('--server=')).split('=')[1]
  : 'http://localhost:3000'

// ====== All pages that should exist ======
// Format: { url: '/path', fsPath: 'app/path/page.tsx' }
function getAllPages() {
  const appDir = path.join(__dirname, '..', 'app')
  const pages = []

  function walk(dir, urlPrefix) {
    const entries = fs.readdirSync(dir)
    const dirs = []
    const hasPage = entries.includes('page.tsx')

    for (const entry of entries) {
      const full = path.join(dir, entry)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) {
        dirs.push(entry)
      }
    }

    // 如果有 page.tsx，记录这个 URL
    if (hasPage) {
      pages.push({
        url: urlPrefix || '/',
        fsPath: path.join(dir, 'page.tsx').replace(appDir, 'app')
      })
    }

    // 继续递归（跳过 api/）
    for (const dirName of dirs) {
      // 跳过非路由目录
      if (dirName === 'api' || dirName === 'node_modules' || dirName === '.next') continue

      // 处理路由组 (group) - 不加入 URL
      if (dirName.startsWith('(') && dirName.endsWith(')')) {
        walk(path.join(dir, dirName), urlPrefix)  // 路由组不影响 URL
      } else {
        const newPrefix = urlPrefix ? urlPrefix + '/' + dirName : '/' + dirName
        walk(path.join(dir, dirName), newPrefix)
      }
    }
  }

  walk(appDir, '')
  return pages
}

// ====== Extract links from source files ======
function extractLinks() {
  const links = new Map()
  const appDir = path.join(__dirname, '..', 'app')

  function scanDir(dir) {
    try {
      const files = fs.readdirSync(dir)
      for (const file of files) {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
          // Skip only api/ for link extraction
          if (file !== 'api') {
            scanDir(fullPath)
          }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8')
            const hrefMatches = content.matchAll(/href\s*=\s*(?:{`(.*?)`}|"(.*?)")/g)
            for (const match of hrefMatches) {
              let href = match[1] || match[2]
              if (href && href.startsWith('/') && !href.startsWith('//')) {
                // Clean template strings - but keep dynamic segments as [param]
                href = href.replace(/\$\{[^}]+\}/g, '[param]')
                // Clean query params
                href = href.split('?')[0]
                if (!links.has(href)) {
                  links.set(href, {
                    href,
                    source: fullPath.replace(appDir, 'app')
                  })
                }
              }
            }
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  scanDir(appDir)
  return Array.from(links.values())
}

// ====== HTTP test ======
function testHttp(href) {
  return new Promise((resolve) => {
    try {
      const url = new URL(href, SERVER)
      const req = http.get(url, { timeout: 5000 }, (res) => {
        res.resume()
        resolve({ status: res.statusCode, ok: res.statusCode < 400 })
      })
      req.on('error', (e) => resolve({ status: 'ERR:' + e.message, ok: false }))
      req.on('timeout', () => { req.destroy(); resolve({ status: 'TIMEOUT', ok: false }) })
    } catch (e) {
      resolve({ status: 'ERR', ok: false })
    }
  })
}

async function testHttpAll(urls) {
  const results = []
  for (const url of urls) {
    const result = await testHttp(url)
    results.push({ url, ...result })
    await new Promise(r => setTimeout(r, 100)) // Rate limit
  }
  return results
}

// ====== DB routes ======
async function testDbRoutes() {
  try {
    const { PrismaClient } = require('@prisma/client')
    const p = new PrismaClient()
    const [categories, brands, products] = await Promise.all([
      p.category.findMany({ where: { isActive: true }, select: { slug: true }, take: 5 }),
      p.brand.findMany({ where: { isActive: true }, select: { slug: true }, take: 5 }),
      p.product.findMany({ where: { isActive: true }, select: { slug: true }, take: 5 }),
    ])
    await p.$disconnect()

    const routes = []
    for (const c of categories) routes.push({ type: 'CATEGORY', url: '/categories/' + c.slug })
    for (const b of brands) routes.push({ type: 'BRAND', url: '/brands/' + b.slug })
    for (const p of products) routes.push({ type: 'PRODUCT', url: '/products/' + p.slug })

    const results = []
    for (const r of routes) {
      const result = await testHttp(r.url)
      results.push({ ...r, ...result })
      await new Promise(r => setTimeout(r, 100))
    }
    return results
  } catch (e) {
    return []
  }
}

// ====== Main ======
async function main() {
  console.log('='.repeat(70))
  console.log('LABPRO Store - Automated Route Testing System v2')
  console.log('='.repeat(70))
  console.log('Server: ' + SERVER)

  // Get all existing pages
  console.log('\n[1] Mapping all page files...')
  const allPages = getAllPages()
  const pageUrls = new Set(allPages.map(p => p.url))
  console.log('  Found ' + allPages.length + ' page files:')
  for (const p of allPages) {
    console.log('    ' + p.url.padEnd(40) + ' -> ' + p.fsPath)
  }

  // Extract links from code
  console.log('\n[2] Extracting navigation links from source...')
  const links = extractLinks()
  console.log('  Found ' + links.length + ' navigation links')

  // Compare: which links have no page?
  console.log('\n[3] Cross-checking links vs pages...')
  const linkProblems = []
  const linkOk = []
  for (const link of links) {
    const cleanHref = link.href.replace(/\?.*/, '')  // Remove query params for matching
      if (pageUrls.has(cleanHref)) {
        linkOk.push(link)
      } else {
        // Check if it's a dynamic route - check for any [xxx] pattern
        const segments = cleanHref.split('/').filter(Boolean)
        const dynamicIndex = segments.findIndex(s => s.startsWith('['))
        if (dynamicIndex >= 0) {
          // Try to find a matching page with any dynamic segment
          const baseSegments = segments.slice(0, dynamicIndex)
          const basePath = baseSegments.join('/')
          const matchingUrl = Array.from(pageUrls).find(pu => {
            const puSegs = pu.split('/').filter(Boolean)
            if (puSegs.length !== segments.length) return false
            for (let i = 0; i < dynamicIndex; i++) {
              if (puSegs[i] !== segments[i]) return false
            }
            // The last segment should be a dynamic route
            return puSegs[dynamicIndex].startsWith('[')
          })
          if (matchingUrl) {
            linkOk.push(link)  // It's a valid dynamic route
          } else {
            linkProblems.push(link)
          }
        } else {
          linkProblems.push(link)
        }
      }
  }

  console.log('  Links with pages: ' + linkOk.length)
  console.log('  Links to missing pages: ' + linkProblems.length)

  // HTTP test all page URLs (skip dynamic routes like /[slug])
  console.log('\n[4] HTTP testing all pages...')
  const staticPageUrls = Array.from(pageUrls).filter(url => !url.includes('['))
  const httpResults = await testHttpAll(staticPageUrls)
  const http404 = httpResults.filter(r => r.status === 404)

  // Test DB routes
  console.log('\n[5] Testing DB dynamic routes...')
  const dbResults = await testDbRoutes()
  const db404 = dbResults.filter(r => r.status === 404)

  // ====== Report ======
  console.log('\n' + '='.repeat(70))
  console.log('TEST REPORT')
  console.log('='.repeat(70))

  if (linkProblems.length > 0) {
    console.log('\n[CRITICAL] Navigation links to non-existent pages:')
    for (const link of linkProblems) {
      console.log('  MISSING PAGE: ' + link.href)
      console.log('    Referenced in: ' + link.source)
    }
  }

  if (http404.length > 0) {
    console.log('\n[CRITICAL] Pages that return HTTP 404:')
    for (const r of http404) {
      console.log('  404: ' + r.url)
    }
  }

  if (db404.length > 0) {
    console.log('\n[CRITICAL] DB routes that return HTTP 404:')
    for (const r of db404) {
      console.log('  404 ' + r.type + ': ' + r.url + ' (slug: ' + r.slug + ')')
    }
  }

  const totalProblems = linkProblems.length + http404.length + db404.length
  console.log('\n' + '='.repeat(70))
  if (totalProblems === 0) {
    console.log('ALL TESTS PASSED - No issues found!')
  } else {
    console.log('PROBLEMS FOUND: ' + totalProblems)
    console.log('  - Missing pages referenced in nav: ' + linkProblems.length)
    console.log('  - HTTP 404 pages: ' + http404.length)
    console.log('  - DB route 404s: ' + db404.length)
  }
  console.log('='.repeat(70))

  // Summary table
  console.log('\n[Page File Summary]')
  for (const p of allPages) {
    const isDynamic = p.url.includes('[')
    if (isDynamic) {
      console.log('  [DY] ' + p.url.padEnd(40) + 'Dynamic route (needs param)')
    } else {
      const httpR = httpResults.find(r => r.url === p.url)
      const ok = httpR && httpR.status === 200
      const status = httpR ? (ok ? 'OK' : 'HTTP ' + httpR.status) : 'NOT TESTED'
      console.log('  ' + (ok ? '[OK]' : '[--]') + ' ' + p.url.padEnd(40) + status)
    }
  }

  return { allPages, linkProblems, http404, db404, totalProblems }
}

main().then(r => {
  process.exit(r.totalProblems > 0 ? 1 : 0)
}).catch(e => {
  console.error(e)
  process.exit(1)
})
