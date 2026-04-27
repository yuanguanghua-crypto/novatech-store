const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()
p.supplier.findMany({ take: 1, include: { _count: { select: { products: true } } } })
  .then(s => {
    console.log('OK:', JSON.stringify(s))
    p.$disconnect()
  })
  .catch(e => {
    console.error('ERR:', e.message.substring(0, 300))
    p.$disconnect()
  })
