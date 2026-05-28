const test = require('node:test')
const assert = require('node:assert/strict')

const {
  normalizeQuoteRequestType,
  buildQuoteSubmissionPayload,
} = require('../lib/quote-workflow')

test('normalizeQuoteRequestType maps unknown values to standard quote', () => {
  assert.equal(normalizeQuoteRequestType(undefined), 'quote')
  assert.equal(normalizeQuoteRequestType('bulk'), 'bulk')
  assert.equal(normalizeQuoteRequestType('sample'), 'sample')
  assert.equal(normalizeQuoteRequestType('anything-else'), 'quote')
})

test('buildQuoteSubmissionPayload prefers quote items over cart items and preserves request type', () => {
  const payload = buildQuoteSubmissionPayload({
    formData: {
      customerName: 'Dr. Alice',
      customerEmail: 'alice@example.com',
      customerCompany: 'North Lab',
      customerPhone: '',
      message: 'Need a fast quote',
    },
    quoteItems: [
      { productId: 'p1', sku: 'SKU-1', name: 'Beaker', quantity: 2, notes: 'fragile' },
    ],
    cartItems: [
      { productId: 'p2', sku: 'SKU-2', name: 'Flask', quantity: 4, price: 12.5 },
    ],
    requestType: 'sample',
  })

  assert.equal(payload.requestType, 'sample')
  assert.equal(payload.customerName, 'Dr. Alice')
  assert.equal(payload.items.length, 1)
  assert.deepEqual(payload.items[0], {
    productId: 'p1',
    sku: 'SKU-1',
    name: 'Beaker',
    quantity: 2,
    notes: 'fragile',
  })
})
