const http = require('http')

function req(method, path, body = null, cookies = '') {
  return new Promise(resolve => {
    const url = new URL(path, SERVER)
    const opts = {
      hostname: url.hostname, port: url.port,
      path: url.pathname + url.search, method,
      headers: {
        'Accept': 'application/json',
        ...(cookies ? { 'Cookie': cookies } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      }
    }
    const r = http.request(opts, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }) }
        catch { resolve({ status: res.statusCode, body: data.substring(0, 500) }) }
      })
    })
    r.on('error', e => resolve({ status: 0, error: e.message }))
    r.setTimeout(8000, () => { r.destroy(); resolve({ status: 0, error: 'TIMEOUT' }) })
    r.end()
  })
}

const SERVER = 'http://localhost:3000'

;(async () => {
  const csrf = await req('GET', '/api/auth/csrf')
  const token = csrf.body?.csrfToken
  let cookies = ''
  const login = await req('POST', '/api/auth/callback/credentials', {
    email: 'admin@labproglobal.com', password: 'Admin@1234', csrfToken: token, json: true
  })
  const cookieHeader = login.headers?.['set-cookie']
  if (cookieHeader) cookies = cookieHeader.map(c => c.split(';')[0]).join('; ')

  // Test products
  const p = await req('GET', '/api/products')
  console.log('GET /api/products:', p.status)
  if (p.status >= 400) console.log('  Error:', JSON.stringify(p.body).substring(0, 300))

  // Test suppliers list
  const s = await req('GET', '/api/admin/suppliers', null, cookies)
  console.log('GET /api/admin/suppliers:', s.status)
  console.log('  Keys:', Object.keys(s.body || {}))
  console.log('  Sample:', JSON.stringify(s.body).substring(0, 200))

  // Test creating a supplier
  const create = await req('POST', '/api/admin/suppliers', {
    name: 'Debug Test Supplier',
    contactName: 'Test',
    email: 'test@test.com',
    rating: 3,
    isActive: true,
  }, cookies)
  console.log('POST /api/admin/suppliers:', create.status, create.body?.id || create.body)
})()
