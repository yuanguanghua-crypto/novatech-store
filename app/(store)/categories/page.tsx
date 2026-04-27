import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { CategoriesClient } from '@/components/store/categories-client'

export const metadata: Metadata = {
  title: 'All Categories',
  description: 'Browse all product categories',
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
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
  } catch {
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  return <CategoriesClient categories={categories} />
}
