import prisma from '../prisma'
import { Context } from '../context'

function requireAuth(ctx: Context): string {
  if (!ctx.userId) throw new Error('Unauthorized')
  return ctx.userId
}

export const categoryResolvers = {
  Query: {
    categories: async (_: unknown, __: unknown, ctx: Context) => {
      const userId = requireAuth(ctx)
      return prisma.category.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' }
      })
    },

    categoryStats: async (_: unknown, __: unknown, ctx: Context) => {
      const userId = requireAuth(ctx)

      const [totalCategories, totalTransactions, mostUsedCategory] = await Promise.all([
        prisma.category.count({ where: { userId } }),
        prisma.transaction.count({ where: { userId } }),
        prisma.category.findFirst({
          where: { userId },
          orderBy: { transactions: { _count: 'desc' } }
        })
      ])

      return { totalCategories, totalTransactions, mostUsedCategory }
    }
  },

  Category: {
    transactionCount: (parent: { id: string }) =>
      prisma.transaction.count({ where: { categoryId: parent.id } })
  },

  Mutation: {
    createCategory: async (
      _: unknown,
      args: { name: string; description?: string; icon?: string; color?: string },
      ctx: Context
    ) => {
      const userId = requireAuth(ctx)
      return prisma.category.create({
        data: {
          name: args.name,
          description: args.description,
          icon: args.icon ?? 'tag',
          color: args.color ?? 'blue',
          userId
        }
      })
    },

    updateCategory: async (
      _: unknown,
      args: { id: string; name?: string; description?: string; icon?: string; color?: string },
      ctx: Context
    ) => {
      const userId = requireAuth(ctx)
      const category = await prisma.category.findFirst({ where: { id: args.id, userId } })
      if (!category) throw new Error('Category not found')

      return prisma.category.update({
        where: { id: args.id },
        data: {
          ...(args.name !== undefined && { name: args.name }),
          ...(args.description !== undefined && { description: args.description }),
          ...(args.icon !== undefined && { icon: args.icon }),
          ...(args.color !== undefined && { color: args.color })
        }
      })
    },

    deleteCategory: async (_: unknown, args: { id: string }, ctx: Context) => {
      const userId = requireAuth(ctx)
      const category = await prisma.category.findFirst({ where: { id: args.id, userId } })
      if (!category) throw new Error('Category not found')

      await prisma.category.delete({ where: { id: args.id } })
      return true
    }
  }
}
