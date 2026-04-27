const http = require('http')

function req(method, path, body = null, cookies = '') {
  return new Promise(resolve => {
    const url = new URL(path, 'http://localhost:3000')
    const opts = {
      hostname: url.hostname, port: url.port,
      path: url.pathname + url.search, method,
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
        let setCookies = res.headers['set-cookie'] || []
        let cookies = setCookies.map(c => c.split(';')[0]).join('; ')
        resolve({ status: res.statusCode, body: data, setCookies: cookies, rawHeaders: res.headers })
      })
    })
    r.on('error', e => resolve({ status: 0, error: e.message }))
    r.setTimeout(10000, () => { r.destroy(); resolve({ status: 0, error: 'TIMEOUT' }) })
    r.end()
  })
}

;(async () => {
  // Step 1: CSRF
  const csrf = await req('GET', '/api/auth/csrf')
  console.log('CSRF status:', csrf.status)
  let csrfToken = null
  try { csrfToken = JSON.parse(csrf.body).csrfToken } catch { console.log('CSRF body:', csrf.body.substring(0, 200)) }

  let cookies = ''
  // Step 2: Login
  const login = await req('POST', '/api/auth/callback/credentials?' + new URLSearchParams({
    email: 'admin@labproglobal.com',
    password: 'Admin@1234',
    csrfToken: csrfToken || '',
    callbackUrl: '/admin',
    json: 'true'
  }).toString(), null, '')

  console.log('Login status:', login.status)
  console.log('Login set-cookies:', login.setCookies.substring(0, 100))
  console.log('Login body:', login.body.substring(0, 200))
  cookies = login.setCookies

  if (login.status === 302 || login.status === 200) {
    // Step 3: Test GET supplier
    const create = await req('POST', '/api/admin/suppliers', {
      name: 'Debug S2', contactName: 'T', email: 't@t.com', rating: 3, isActive: true
    }, cookies)
    console.log('Create supplier:', create.status)
    let supId = null
    try { supId = JSON.parse(create.body).id } catch {}
    console.log('Supplier ID:', supId)

    if (supId) {
      const get = await req('GET', `/api/admin/suppliers/${supId}`, null, cookies)
      console.log('GET supplier:', get.status)
      console.log('Body:', get.body.substring(0, 400))
    }
  }
})()
