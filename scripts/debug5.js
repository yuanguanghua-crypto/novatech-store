const http = require('http')

function req(method, path, body = null, cookies = '') {
  return new Promise(resolve => {
    const url = new URL(path, 'http://localhost:3000')
    const opts = {
      hostname: url.hostname, port: url.port,
      path: url.pathname, method,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Test/1.0',
        ...(cookies ? { 'Cookie': cookies } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      }
    }
    const r = http.request(opts, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        const setCookies = (res.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ')
        try { resolve({ status: res.statusCode, body: JSON.parse(data), setCookies }) }
        catch { resolve({ status: res.statusCode, body: data.substring(0, 500), setCookies }) }
      })
    })
    r.on('error', e => resolve({ status: 0, error: e.message }))
    r.setTimeout(10000, () => { r.destroy(); resolve({ status: 0, error: 'TIMEOUT' }) })
    r.end(JSON.stringify(body))
  })
}

// Simple follow-redirect
async function followRedirects(method, path, body, cookies) {
  let currentCookies = cookies || ''
  let url = path
  let maxFollow = 5
  while (maxFollow-- > 0) {
    const res = await req(method, url, body, currentCookies)
    // capture cookies
    if (res.setCookies) {
      const map = new Map()
      for (const c of currentCookies.split('; ').filter(Boolean)) {
        const [name] = c.split('=')
        map.set(name.trim(), c)
      }
      for (const c of res.setCookies.split('; ').filter(Boolean)) {
        const [name] = c.split('=')
        map.set(name.trim(), c)
      }
      currentCookies = Array.from(map.values()).join('; ')
    }
    if (res.status === 302 || res.status === 303) {
      const loc = res.headers?.location || res.body?.url || res.body?.redirect
      if (loc) { url = loc.startsWith('/') ? loc : '/' + path.split('/').slice(1, 3).join('/') + loc; continue }
    }
    return { ...res, cookies: currentCookies }
  }
  return { status: 0, error: 'Too many redirects' }
}

;(async () => {
  const csrf = await req('GET', '/api/auth/csrf')
  const token = csrf.body?.csrfToken
  console.log('Token:', token?.substring(0, 20))

  const login = await followRedirects('POST',
    '/api/auth/callback/credentials?' + new URLSearchParams({
      email: 'admin@labproglobal.com', password: 'Admin@1234',
      csrfToken: token || '', callbackUrl: '/admin', json: 'true'
    }).toString(),
    null, '')
  console.log('Login done:', login.status, 'cookies:', login.cookies?.substring(0, 60))

  const create = await req('POST', '/api/admin/suppliers', {
    name: 'Debug X Supplier', contactName: 'T', email: 't@t.com', rating: 3, isActive: true
  }, login.cookies)
  console.log('Create:', create.status, create.body?.id || JSON.stringify(create.body).substring(0, 100))
  const supId = create.body?.id

  if (supId) {
    const get = await req('GET', `/api/admin/suppliers/${supId}`, null, login.cookies)
    console.log('GET supplier:', get.status, JSON.stringify(get.body).substring(0, 400))
  }

  const qi = await req('GET', '/api/admin/quotes/nonexistent', null, login.cookies)
  console.log('GET invalid quote:', qi.status, JSON.stringify(qi.body).substring(0, 300))
})()
