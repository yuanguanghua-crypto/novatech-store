const http = require('http')

const SERVER = 'http://localhost:3000'

function req(method, path, body = null, cookies = '') {
  return new Promise(resolve => {
    const url = new URL(path, SERVER)
    const opts = {
      hostname: url.hostname, port: url.port,
      path: url.pathname, method,
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
    r.end()
  })
}

;(async () => {
  // Quick login
  const csrf = await req('GET', '/api/auth/csrf')
  const token = csrf.body?.csrfToken
  let cookies = ''
  const login = await req('POST', '/api/auth/callback/credentials', {
    email: 'admin@labproglobal.com', password: 'Admin@1234', csrfToken: token, json: true
  })
  // capture cookie
  const cookieHeader = login.headers?.['set-cookie']
  if (cookieHeader) cookies = cookieHeader.map(c => c.split(';')[0]).join('; ')

  // Test products API
  const p = await req('GET', '/api/products', null, cookies)
  console.log('GET /api/products:', p.status, JSON.stringify(p.body).substring(0, 300))

  // Test admin supplier read
  const s = await req('GET', '/api/admin/suppliers', null, cookies)
  const supId = s.body?.suppliers?.[0]?.id
  console.log('First supplier ID:', supId)
  if (supId) {
    const detail = await req('GET', `/api/admin/suppliers/${supId}`, null, cookies)
    console.log(`GET /api/admin/suppliers/${supId}:`, detail.status, JSON.stringify(detail.body).substring(0, 300))
  }
})()
