/**
 * LabProGlobal Admin Seed Script
 * 
 * Usage:
 *   node scripts/seed.js                          → creates admin@labproglobal.com / Admin@1234
 *   node scripts/seed.js user@email.com Password  → custom email & password
 *   node scripts/seed.js user@email.com Password "My Name" → with name
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@labproglobal.com'
  const name = process.argv[4] || 'Admin'
  const password = process.argv[3] || 'Admin@1234'

  console.log('')
  console.log('🔧 LabProGlobal Admin Seed')
  console.log('─────────────────────────────')

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: 'admin' },
    create: {
      email,
      name,
      passwordHash,
      role: 'admin',
    },
  })

  console.log(`✅ Admin user ready:`)
  console.log(`   Email:    ${user.email}`)
  console.log(`   Password: ${password}`)
  console.log(`   Role:     ${user.role}`)
  console.log('')
  console.log('🌐 Login at: http://localhost:3000/auth/login')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
