const test = require('node:test')
const assert = require('node:assert/strict')

const {
  buildProductWhereClause,
  buildProductOrderBy,
} = require('../lib/catalog-filters')

test('buildProductWhereClause includes laboratory search filters', () => {
  const where = buildProductWhereClause({
    search: 'beaker',
    category: 'glassware',
    brand: 'labpro',
    availability: 'in_stock',
    featured: 'true',
    minPrice: '10',
    maxPrice: '50',
  })

  assert.equal(where.isActive, true)
  assert.deepEqual(where.category, { slug: 'glassware' })
  assert.deepEqual(where.brand, { slug: 'labpro' })
  assert.equal(where.availability, 'in_stock')
  assert.equal(where.isFeatured, true)
  assert.deepEqual(where.ourPrice, { gte: 10, lte: 50 })
  assert.equal(where.OR.length, 5)
  assert.equal(where.OR[0].name.contains, 'beaker')
  assert.equal(where.OR[4].brand.name.contains, 'beaker')
})

test('buildProductOrderBy maps sort modes to Prisma ordering', () => {
  assert.deepEqual(buildProductOrderBy('price_asc'), { ourPrice: 'asc' })
  assert.deepEqual(buildProductOrderBy('price_desc'), { ourPrice: 'desc' })
  assert.deepEqual(buildProductOrderBy('newest'), { createdAt: 'desc' })
  assert.deepEqual(buildProductOrderBy('featured'), { isFeatured: 'desc' })
})
