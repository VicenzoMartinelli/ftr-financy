import prisma from '../prisma'
import { Context } from '../context'

function requireAuth(ctx: Context): string {
  if (!ctx.userId) throw new Error('Unauthorized')
  return ctx.userId
}

interface TransactionArgs {
  search?: string
  type?: string
  categoryId?: string
  month?: number
  year?: number
  page?: number
  limit?: number
}

export const transactionResolvers = {
  Query: {
    transactions: async (_: unknown, args: TransactionArgs, ctx: Context) => {
      const userId = requireAuth(ctx)
      const page = args.page ?? 1
      const limit = args.limit ?? 10
      const skip = (page - 1) * limit

      const where: Record<string, unknown> = { userId }

      if (args.search) {
        where.title = { contains: args.search }
      }
      if (args.type && args.type !== 'all') {
        where.type = args.type
      }
      if (args.categoryId) {
        where.categoryId = args.categoryId
      }
      if (args.month && args.year) {
        where.date = {
          gte: new Date(Date.UTC(args.year, args.month - 1, 1)),
          lt:  new Date(Date.UTC(args.year, args.month, 1)),
        }
      } else if (args.year) {
        where.date = {
          gte: new Date(Date.UTC(args.year, 0, 1)),
          lt:  new Date(Date.UTC(args.year + 1, 0, 1)),
        }
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          include: { category: true },
          orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
          skip,
          take: limit,
        }),
        prisma.transaction.count({ where }),
      ])

      return { transactions, total, page, limit }
    },
  },

  Transaction: {
    date: (parent: { date: Date }) => parent.date.toISOString(),
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
  },

  Mutation: {
    createTransaction: async (
      _: unknown,
      args: { title: string; amount: number; type: string; categoryId: string; date: string },
      ctx: Context
    ) => {
      const userId = requireAuth(ctx)
      const category = await prisma.category.findFirst({ where: { id: args.categoryId, userId } })
      if (!category) throw new Error('Category not found')

      return prisma.transaction.create({
        data: {
          title: args.title,
          amount: args.amount,
          type: args.type,
          date: new Date(args.date),
          categoryId: args.categoryId,
          userId,
        },
        include: { category: true },
      })
    },

    updateTransaction: async (
      _: unknown,
      args: { id: string; title?: string; amount?: number; type?: string; categoryId?: string; date?: string },
      ctx: Context
    ) => {
      const userId = requireAuth(ctx)
      const transaction = await prisma.transaction.findFirst({ where: { id: args.id, userId } })
      if (!transaction) throw new Error('Transaction not found')

      if (args.categoryId) {
        const category = await prisma.category.findFirst({ where: { id: args.categoryId, userId } })
        if (!category) throw new Error('Category not found')
      }

      return prisma.transaction.update({
        where: { id: args.id },
        data: {
          ...(args.title !== undefined && { title: args.title }),
          ...(args.amount !== undefined && { amount: args.amount }),
          ...(args.type !== undefined && { type: args.type }),
          ...(args.date !== undefined && { date: new Date(args.date) }),
          ...(args.categoryId !== undefined && { categoryId: args.categoryId }),
        },
        include: { category: true },
      })
    },

    deleteTransaction: async (_: unknown, args: { id: string }, ctx: Context) => {
      const userId = requireAuth(ctx)
      const transaction = await prisma.transaction.findFirst({ where: { id: args.id, userId } })
      if (!transaction) throw new Error('Transaction not found')

      await prisma.transaction.delete({ where: { id: args.id } })
      return true
    },
  },
}
