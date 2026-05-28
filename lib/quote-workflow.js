function normalizeQuoteRequestType(value) {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (normalized === 'bulk' || normalized === 'sample' || normalized === 'quote') {
    return normalized
  }
  return 'quote'
}

function normalizeCartItem(item) {
  return {
    productId: item.productId,
    sku: item.sku,
    name: item.name,
    quantity: item.quantity,
  }
}

function normalizeQuoteItem(item) {
  const normalized = normalizeCartItem(item)
  if (item.notes) {
    normalized.notes = item.notes
  }
  return normalized
}

function buildQuoteSubmissionPayload({ formData, quoteItems = [], cartItems = [], requestType }) {
  const items = quoteItems.length > 0
    ? quoteItems.map(normalizeQuoteItem)
    : cartItems.map(normalizeCartItem)

  return {
    customerName: formData.customerName,
    customerEmail: formData.customerEmail,
    customerCompany: formData.customerCompany,
    customerPhone: formData.customerPhone,
    message: formData.message,
    requestType: normalizeQuoteRequestType(requestType),
    items,
  }
}

module.exports = {
  normalizeQuoteRequestType,
  buildQuoteSubmissionPayload,
}
