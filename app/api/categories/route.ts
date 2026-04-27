import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const parentOnly = searchParams.get('parent') === 'true'

  // 只返回有子分类的顶级分类（用于导航栏下拉）
  if (parentOnly) {
    const parents = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            _count: { select: { products: { where: { isActive: true } } } },
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    // 过滤出有子分类的顶级分类
    const withChildren = parents.filter(p => p.children.length > 0)
    return NextResponse.json(withChildren)
  }

  // 返回所有分类
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
      children: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { products: { where: { isActive: true } } } },
        },
        take: 20,
      },
    },
    orderBy: { sortOrder: 'asc' },
    take: 50,
  })

  return NextResponse.json(categories)
}
