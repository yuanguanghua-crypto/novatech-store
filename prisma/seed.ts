import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@labproglobal.com'
  const name = process.argv[3] || 'Admin'
  const password = process.argv[4] || 'Admin@1234'

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

  console.log(`✅ Admin user created/updated:`)
  console.log(`   Email:    ${user.email}`)
  console.log(`   Password: ${password}`)
  console.log(`   Role:     ${user.role}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
