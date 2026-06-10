import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { CategoriesClient } from '@/components/store/categories-client'

export const metadata: Metadata = {
  title: 'All Categories',
  description: 'Browse all product categories',
}

export const dynamic = 'force-dynamic'

async function getCategories() {
  try {
    const groups = await prisma.categoryGroup.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { spus: true } },
      },
      orderBy: { sortOrder: 'asc' },
    })

    return groups.map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      description: g.description,
      imageUrl: null as string | null,
      parentId: null as string | null,
      sortOrder: g.sortOrder,
      isActive: g.isActive,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
      _count: { products: g._count.spus },
      children: [] as any[],
      parent: null,
    }))
  } catch {
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  return <CategoriesClient categories={categories as any} />
}
