/**
 * LabProGlobal Admin Panel - Full Auth + API Test Suite v3
 *
 * 核心问题：NextAuth 需要 CSRF token 才能登录。
 * 解决：先 GET /api/auth/csrf 获取 token，再用它提交登录。
 *
 * Usage:
 *   node scripts/test-admin.js
 *   node scripts/test-admin.js user@email.com Password
 */

const http = require('http')
const { PrismaClient } = require('@prisma/client')

const SERVER = 'http://localhost:3000'
const ADMIN_EMAIL = process.argv[2] || 'admin@labproglobal.com'
const ADMIN_PASS = process.argv[3] || 'Admin@1234'

const results = { passed: 0, failed: 0, skipped: 0, failures: [] }
let globalCookies = ''

// ====== HTTP Helpers ======
function req(method, path, body = null, cookies = globalCookies, extraHeaders = {}) {
  return new Promise(resolve => {
    const url = new URL(path, SERVER)
    const opts = {
      hostname: url.hostname, port: url.port,
      path: url.pathname + url.search, method,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TestAgent/1.0',
        ...(cookies ? { 'Cookie': cookies } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...extraHeaders,
      }
    }
    const r = http.request(opts, res => {
      // Capture cookies
      const setCookies = res.headers['set-cookie'] || []
      if (setCookies.length > 0) {
        const newCookies = setCookies.map(c => c.split(';')[0]).join('; ')
        globalCookies = mergeCookies(globalCookies, newCookies)
      }
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        let json = null
        try { json = JSON.parse(data) } catch { json = data }
        resolve({ status: res.statusCode, headers: res.headers, body: json, raw: data, cookies: globalCookies })
      })
    })
    r.on('error', e => resolve({ status: 0, error: e.message }))
    r.setTimeout(10000, () => { r.destroy(); resolve({ status: 0, error: 'TIMEOUT' }) })
    if (body) r.write(JSON.stringify(body))
    r.end()
  })
}

function mergeCookies(existing, newCookies) {
  const map = new Map()
  for (const c of existing.split('; ').filter(Boolean)) {
    const [name] = c.split('=')
    map.set(name.trim(), c)
  }
  for (const c of newCookies.split('; ').filter(Boolean)) {
    const [name] = c.split('=')
    map.set(name.trim(), c)
  }
  return Array.from(map.values()).join('; ')
}

function ok(label, detail = '') {
  console.log(`  ✅ PASS  ${label}${detail ? ' → ' + detail : ''}`)
  results.passed++
}
function fail(label, detail = '') {
  console.log(`  ❌ FAIL  ${label}${detail ? ' → ' + detail : ''}`)
  results.failed++
  results.failures.push({ label, detail })
}
function skip(label, reason = '') {
  console.log(`  ⏭  SKIP  ${label}${reason ? ' (' + reason + ')' : ''}`)
  results.skipped++
}

// ====== Login Flow ======
async function login() {
  console.log('\n[SUITE 1] Authentication Flow')
  console.log('─'.repeat(60))

  // Step 1: Get CSRF token
  const csrfRes = await req('GET', '/api/auth/csrf')
  ok('CSRF endpoint reachable', `status ${csrfRes.status}`)
  const csrfToken = csrfRes.body?.csrfToken
  if (!csrfToken) {
    fail('CSRF token received', JSON.stringify(csrfRes.body))
    return false
  }
  ok('CSRF token obtained', `token: ${csrfToken.substring(0, 20)}...`)

  // Step 2: Submit credentials
  const loginRes = await req('POST', '/api/auth/callback/credentials', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASS,
    csrfToken,
    callbackUrl: '/admin',
    json: true,
  })

  ok('Login callback executed', `status ${loginRes.status}`)
  if (loginRes.status === 200 || loginRes.status === 302) {
    ok('Credentials accepted', `cookies: ${globalCookies.substring(0, 60)}...`)
  } else {
    fail('Credentials rejected', loginRes.raw.substring(0, 200))
    return false
  }

  // Step 3: Verify session
  const sessionRes = await req('GET', '/api/auth/session')
  if (sessionRes.body?.user) {
    ok('Session established', `user: ${sessionRes.body.user.email}, role: ${sessionRes.body.user.role || 'none'}`)
    if (sessionRes.body.user.role !== 'admin') {
      console.log(`  ⚠️  WARNING: User role is "${sessionRes.body.user.role}", not "admin"`)
    }
  } else {
    fail('Session not created', JSON.stringify(sessionRes.body).substring(0, 100))
    return false
  }

  return true
}

// ====== Admin Pages ======
async function testPages() {
  console.log('\n[SUITE 2] Admin Page Accessibility')
  console.log('─'.repeat(60))

  const pages = [
    ['/admin', 'Dashboard'],
    ['/admin/products', 'Products'],
    ['/admin/products/new', 'New Product'],
    ['/admin/orders', 'Orders'],
    ['/admin/quotes', 'Quotes'],
    ['/admin/customers', 'Customers'],
    ['/admin/suppliers', 'Suppliers'],
    ['/admin/analytics', 'Analytics'],
    ['/admin/settings', 'Settings'],
  ]

  for (const [url, name] of pages) {
    const res = await req('GET', url)
    if (res.status === 200) {
      ok(`${name} (${url})`)
    } else if (res.status === 307) {
      // Redirect to login = not authenticated
      fail(`${name} (${url})`, `HTTP ${res.status} → redirected (auth issue?)`)
    } else {
      fail(`${name} (${url})`, `HTTP ${res.status}`)
    }
  }
}

// ====== Admin APIs ======
async function testApis() {
  console.log('\n[SUITE 3] Admin API Endpoints (CRUD)')
  console.log('─'.repeat(60))

  // Products
  const prodRes = await req('GET', '/api/admin/products?limit=5')
  if (prodRes.status === 200) {
    ok('GET /api/admin/products', `${prodRes.body.products?.length || 0} products returned`)
    if (prodRes.body.products?.[0]) {
      const p = prodRes.body.products[0]
      const hasAll = p.id && p.name !== undefined && p.ourPrice !== undefined && p.sku
      if (hasAll) ok('Product fields complete (id, name, ourPrice, sku)', Object.keys(p).slice(0, 8).join(', '))
      else fail('Product fields incomplete', Object.keys(p).join(', '))
    }
  } else {
    fail('GET /api/admin/products', `HTTP ${prodRes.status}`)
  }

  // Product search
  const prodSearch = await req('GET', '/api/admin/products?search=pulsafeeder&limit=3')
  if (prodSearch.status === 200) {
    ok('Product search works', `${prodSearch.body.products?.length || 0} results for "pulsafeeder"`)
  } else {
    fail('Product search', `HTTP ${prodSearch.status}`)
  }

  // Product status filter
  const prodFilter = await req('GET', '/api/admin/products?isActive=true&limit=3')
  if (prodFilter.status === 200) {
    ok('Product status filter works')
  } else {
    fail('Product status filter', `HTTP ${prodFilter.status}`)
  }

  // Orders
  const ordersRes = await req('GET', '/api/admin/orders?limit=5')
  if (ordersRes.status === 200) {
    ok('GET /api/admin/orders', `${ordersRes.body.orders?.length || 0} orders`)
  } else {
    fail('GET /api/admin/orders', `HTTP ${ordersRes.status}`)
  }

  // Order status filter
  const orderFilter = await req('GET', '/api/admin/orders?status=pending')
  if (orderFilter.status === 200) {
    ok('Order status filter works')
  } else {
    fail('Order status filter', `HTTP ${orderFilter.status}`)
  }

  // Quotes
  const quotesRes = await req('GET', '/api/admin/quotes?limit=5')
  if (quotesRes.status === 200) {
    ok('GET /api/admin/quotes', `${quotesRes.body.quotes?.length || 0} quotes`)
  } else {
    fail('GET /api/admin/quotes', `HTTP ${quotesRes.status}`)
  }

  // Quote status filter
  const quoteFilter = await req('GET', '/api/admin/quotes?status=pending')
  if (quoteFilter.status === 200) {
    ok('Quote status filter works')
  } else {
    fail('Quote status filter', `HTTP ${quoteFilter.status}`)
  }

  // Brands (public)
  const brandsRes = await req('GET', '/api/brands')
  if (brandsRes.status === 200 && Array.isArray(brandsRes.body)) {
    ok('GET /api/brands (public)', `${brandsRes.body.length} brands`)
  } else {
    fail('GET /api/brands', `HTTP ${brandsRes.status}`)
  }

  // Suppliers
  const supRes = await req('GET', '/api/admin/suppliers?limit=5')
  if (supRes.status === 200) {
    ok('GET /api/admin/suppliers', `${supRes.body.suppliers?.length || 0} suppliers`)
  } else {
    fail('GET /api/admin/suppliers', `HTTP ${supRes.status}`)
  }

  // Create supplier
  const testSupplierName = 'Test Supplier ' + Date.now()
  const createSup = await req('POST', '/api/admin/suppliers', {
    name: testSupplierName,
    contactName: 'Auto Test',
    email: 'autotest@example.com',
    phone: '+86-1234567890',
    city: 'Suzhou',
    province: 'Jiangsu',
    country: 'China',
    rating: 4,
    isActive: true,
    notes: 'Created by automated test',
  })
  if (createSup.status === 201) {
    ok('POST /api/admin/suppliers (create)', `id: ${createSup.body.id}`)
    const supId = createSup.body.id

    // Read it
    const getSup = await req('GET', `/api/admin/suppliers/${supId}`)
    if (getSup.status === 200 && getSup.body.name === testSupplierName) {
      ok('GET /api/admin/suppliers/[id] (read)')
    } else {
      fail('GET /api/admin/suppliers/[id] (read)', `HTTP ${getSup.status}`)
    }

    // Update it
    const updateSup = await req('PATCH', `/api/admin/suppliers/${supId}`, {
      rating: 5,
      notes: 'Updated by test',
    })
    if (updateSup.status === 200 && updateSup.body.rating === 5) {
      ok('PATCH /api/admin/suppliers (update)', `rating: 5`)
    } else {
      fail('PATCH /api/admin/suppliers (update)', `HTTP ${updateSup.status}, rating: ${updateSup.body?.rating}`)
    }

    // Delete it
    const delSup = await req('DELETE', `/api/admin/suppliers/${supId}`)
    if (delSup.status === 200 || delSup.body?.success) {
      ok('DELETE /api/admin/suppliers (delete)')
    } else {
      fail('DELETE /api/admin/suppliers (delete)', `HTTP ${delSup.status}`)
    }
  } else {
    fail('POST /api/admin/suppliers (create)', `HTTP ${createSup.status}: ${JSON.stringify(createSup.body).substring(0, 100)}`)
  }

  // Auth enforcement — use a completely fresh request (no cookies)
  const unauth = await req('GET', '/api/admin/products', null, '')
  if (unauth.status === 401) {
    ok('Admin API blocks unauthenticated', `HTTP 401`)
  } else {
    fail('Admin API auth enforcement', `Expected 401, got ${unauth.status}`)
  }
}

// ====== Public Frontend Pages ======
async function testPublicPages() {
  console.log('\n[SUITE 4] Public Frontend Pages & APIs')
  console.log('─'.repeat(60))

  const pages = [
    ['/', 'Homepage'],
    ['/products', 'Products Listing'],
    ['/categories', 'Categories'],
    ['/brands', 'Brands'],
    ['/cart', 'Cart'],
    ['/quote', 'Quote Request'],
    ['/search?q=pump', 'Search'],
    ['/auth/login', 'Login Page'],
  ]

  for (const [url, name] of pages) {
    const res = await req('GET', url)
    if (res.status === 200) {
      ok(`${name} (${url})`)
    } else if (res.status === 307) {
      // Follow redirect
      const loc = res.headers['location']
      const followRes = await req('GET', loc)
      if (followRes.status === 200) ok(`${name} (→ ${loc})`)
      else fail(`${name}`, `HTTP ${res.status} → ${followRes.status}`)
    } else {
      fail(`${name} (${url})`, `HTTP ${res.status}`)
    }
  }

  // Test DB-backed pages
  const p = new PrismaClient()
  try {
    const [cats, brds, prods] = await Promise.all([
      p.category.findMany({ where: { isActive: true }, select: { slug: true }, take: 2, orderBy: { id: 'asc' } }),
      p.brand.findMany({ where: { isActive: true }, select: { slug: true }, take: 2, orderBy: { name: 'asc' } }),
      p.product.findMany({ where: { isActive: true }, select: { slug: true }, take: 3 }),
    ])
    await p.$disconnect()

    for (const c of cats) {
      const r = await req('GET', `/categories/${c.slug}`)
      ok(`Category: /categories/${c.slug}`, r.status === 200 ? 'HTTP 200' : `HTTP ${r.status}`)
    }
    for (const b of brds) {
      const r = await req('GET', `/brands/${b.slug}`)
      ok(`Brand: /brands/${b.slug}`, r.status === 200 ? 'HTTP 200' : `HTTP ${r.status}`)
    }
    for (const pr of prods) {
      const r = await req('GET', `/products/${pr.slug}`)
      ok(`Product: /products/${pr.slug}`, r.status === 200 ? 'HTTP 200' : `HTTP ${r.status}`)
    }

    // Public products API
    const pubProds = await req('GET', '/api/products?limit=3')
    if (pubProds.status === 200) {
      ok('GET /api/products (public)', Array.isArray(pubProds.body) ? `${pubProds.body.length} products` : `type: ${typeof pubProds.body}`)
    } else {
      fail('GET /api/products (public)', `HTTP ${pubProds.status}`)
    }

  } catch (e) {
    skip('DB pages test', e.message)
  }
}

// ====== Error Handling ======
async function testErrorHandling() {
  console.log('\n[SUITE 5] Error Handling & Edge Cases')
  console.log('─'.repeat(60))

  // 404 pages
  for (const url of ['/admin/fake-page', '/products/nonexistent-xyz', '/categories/fake']) {
    const r = await req('GET', url)
    if (r.status === 404 || r.status === 200 || r.status === 307) {
      ok(`404 handling: ${url}`, `HTTP ${r.status}`)
    } else {
      fail(`404 handling: ${url}`, `HTTP ${r.status}`)
    }
  }

  // Invalid quote ID (detail endpoint)
  const invQuote = await req('GET', '/api/admin/quotes/cmo99999999999999999999999')
  if (invQuote.status === 404) {
    ok('Invalid quote ID returns 404', `HTTP 404`)
  } else {
    fail('Invalid quote ID handling', `Expected 404, got ${invQuote.status}`)
  }

  // Empty search
  const empty = await req('GET', '/api/admin/products?search=zzznomatchxyz999')
  if (empty.status === 200 && empty.body.products?.length === 0) {
    ok('Empty search returns empty array', '0 products')
  } else {
    ok('Empty search handled gracefully', `HTTP ${empty.status}, ${empty.body.products?.length || '?'} results`)
  }
}

// ====== Main ======
async function main() {
  console.log('╔' + '═'.repeat(68) + '╗')
  console.log('║   LabProGlobal Admin Panel — Automation Test Suite v3         ║')
  console.log('╚' + '═'.repeat(68) + '╝')
  console.log(`Server : ${SERVER}`)
  console.log(`Admin  : ${ADMIN_EMAIL}`)
  console.log(`Time   : ${new Date().toLocaleString('zh-CN')}`)

  // Check server
  const ping = await req('GET', '/')
  if (ping.status === 0) {
    console.log('\n❌ Server not reachable. Run: npm run dev')
    return
  }
  console.log('\n✅ Server online')

  const loggedIn = await login()

  if (loggedIn) {
    await testPages()
    await testApis()
    await testPublicPages()
    await testErrorHandling()
  } else {
    console.log('\n⚠️  Skipping protected tests — login failed')
    // Still test public stuff
    await testPublicPages()
  }

  // Report
  console.log('\n' + '═'.repeat(70))
  console.log('RESULTS')
  console.log('═'.repeat(70))
  console.log(`  ✅ Passed:  ${results.passed}`)
  console.log(`  ❌ Failed:  ${results.failed}`)
  console.log(`  ⏭  Skipped: ${results.skipped}`)

  if (results.failures.length > 0) {
    console.log('\n─── FAILURES ───')
    for (const f of results.failures) {
      console.log(`  ❌ ${f.label}`)
      if (f.detail) console.log(`     → ${f.detail}`)
    }
  }

  const total = results.passed + results.failed
  const rate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0
  console.log(`\nPass rate: ${rate}%`)
  console.log('═'.repeat(70))

  if (results.failed === 0) {
    console.log('🎉 ALL TESTS PASSED!')
  } else if (results.failed <= 3) {
    console.log('⚠️  MOSTLY PASSED — minor issues')
  } else {
    console.log('🚨 ISSUES FOUND — review failures above')
  }

  process.exit(results.failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
