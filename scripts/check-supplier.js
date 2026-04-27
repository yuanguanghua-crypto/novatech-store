const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()
p.supplier.findMany({ take: 1 }).then(s => {
  console.log(JSON.stringify(s, null, 2))
  p.$disconnect()
}).catch(e => {
  console.error(e.message)
  p.$disconnect()
})
