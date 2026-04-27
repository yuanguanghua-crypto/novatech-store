/**
 * LabProGlobal 测试账号 Seed 脚本
 *
 * 创建一个管理员 + 两个测试客户账号
 *
 * 用法:
 *   node scripts/seed-test.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const TEST_ACCOUNTS = [
  {
    email: 'admin@novatech.com',
    name: 'Admin',
    password: 'admin123',
    role: 'admin',
    company: 'LabProGlobal',
  },
  {
    email: 'buyer@test.com',
    name: '测试买家',
    password: 'test123456',
    role: 'customer',
    company: '测试实验室有限公司',
  },
  {
    email: 'customer@test.com',
    name: '测试客户',
    password: 'test123456',
    role: 'customer',
    company: '科学仪器采购部',
  },
]

async function main() {
  console.log('')
  console.log('🔧 LabProGlobal 测试账号生成')
  console.log('═══════════════════════════════════════')
  console.log('')

  for (const account of TEST_ACCOUNTS) {
    const passwordHash = await bcrypt.hash(account.password, 12)

    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        passwordHash,
        role: account.role,
        company: account.company,
      },
      create: {
        email: account.email,
        name: account.name,
        passwordHash,
        role: account.role,
        company: account.company,
      },
    })

    console.log(`✅ ${account.role === 'admin' ? '管理员' : '客户'}账号已就绪`)
    console.log(`   邮箱:    ${user.email}`)
    console.log(`   密码:    ${account.password}`)
    console.log(`   角色:    ${user.role}`)
    console.log(`   公司:    ${account.company}`)
    console.log('')
  }

  console.log('═══════════════════════════════════════')
  console.log('🌐 访问地址:')
  console.log('   前台商城: http://localhost:3000')
  console.log('   管理后台: http://localhost:3000/admin')
  console.log('   登录页:   http://localhost:3000/auth/login')
  console.log('')
  console.log('📋 管理员后台测试清单:')
  console.log('   1. http://localhost:3000/admin/products  → 产品管理')
  console.log('   2. http://localhost:3000/admin/orders    → 订单管理')
  console.log('   3. http://localhost:3000/admin/quotes    → 询价单管理')
  console.log('   4. http://localhost:3000/admin/suppliers → 供应商管理')
  console.log('   5. http://localhost:3000/admin/customers → 客户管理')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seed 失败:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
