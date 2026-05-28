function trimString(value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function buildSearchConditions(search) {
  const q = trimString(search)
  if (!q) return undefined

  return [
    { name: { contains: q, mode: 'insensitive' } },
    { sku: { contains: q, mode: 'insensitive' } },
    { description: { contains: q, mode: 'insensitive' } },
    { specsFlat: { contains: q, mode: 'insensitive' } },
    { brand: { name: { contains: q, mode: 'insensitive' } } },
  ]
}

function buildProductWhereClause(filters = {}) {
  const where = { isActive: true }

  const search = buildSearchConditions(filters.search)
  if (search) {
    where.OR = search
  }

  const category = trimString(filters.category)
  if (category) {
    where.category = { slug: category }
  }

  const brand = trimString(filters.brand)
  if (brand) {
    where.brand = { slug: brand }
  }

  const availability = trimString(filters.availability)
  if (availability === 'in_stock' || availability === 'out_of_stock' || availability === 'lead_time') {
    where.availability = availability
  }

  if (trimString(filters.featured) === 'true') {
    where.isFeatured = true
  }

  const minPrice = trimString(filters.minPrice)
  const maxPrice = trimString(filters.maxPrice)
  if (minPrice || maxPrice) {
    where.ourPrice = {}
    if (minPrice) where.ourPrice.gte = Number(minPrice)
    if (maxPrice) where.ourPrice.lte = Number(maxPrice)
  }

  return where
}

function buildProductOrderBy(sort) {
  const value = trimString(sort)
  if (value === 'price_asc') return { ourPrice: 'asc' }
  if (value === 'price_desc') return { ourPrice: 'desc' }
  if (value === 'newest') return { createdAt: 'desc' }
  return { isFeatured: 'desc' }
}

module.exports = {
  buildProductWhereClause,
  buildProductOrderBy,
  buildSearchConditions,
}
