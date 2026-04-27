const http = require('http')

function req(method, path, body = null, cookies = '') {
  return new Promise(resolve => {
    const url = new URL(path, 'http://localhost:3000')
    const opts = {
      hostname: url.hostname, port: url.port,
      path: url.pathname, method,
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Debug/1.0',
        ...(cookies ? { 'Cookie': cookies } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      }
    }
    const r = http.request(opts, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data.substring(0, 600), headers: res.headers })
      })
    })
    r.on('error', e => resolve({ status: 0, error: e.message }))
    r.setTimeout(10000, () => { r.destroy(); resolve({ status: 0, error: 'TIMEOUT' }) })
    r.end()
  })
}

;(async () => {
  const csrf = await req('GET', '/api/auth/csrf')
  const token = csrf.body.match(/"csrfToken":"([^"]+)"/)?.[1]
  const login = await req('POST', '/api/auth/callback/credentials', {
    email: 'admin@labproglobal.com', password: 'Admin@1234', csrfToken: token, json: true
  })
  let cookies = ''
  const setCookie = login.headers?.['set-cookie']
  if (setCookie) cookies = setCookie.map(c => c.split(';')[0]).join('; ')

  // Create a supplier
  const create = await req('POST', '/api/admin/suppliers', {
    name: 'Debug Supplier', contactName: 'Test', email: 'test@test.com', rating: 3, isActive: true,
  }, cookies)
  const supId = create.body.match(/"id":"([^"]+)"/)?.[1]
  console.log('Created:', create.status, 'ID:', supId)

  // GET it
  if (supId) {
    const get = await req('GET', `/api/admin/suppliers/${supId}`, null, cookies)
    console.log('GET supplier:', get.status)
    console.log('Body:', get.body.substring(0, 400))
  }

  // Also test invalid quote ID
  const qi = await req('GET', '/api/admin/quotes/nonexistent-id')
  console.log('GET invalid quote:', qi.status)
  console.log('Body:', qi.body.substring(0, 400))
})()
