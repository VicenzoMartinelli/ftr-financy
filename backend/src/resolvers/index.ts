import prisma from '../prisma'
import { Context } from '../context'
import { authResolvers } from './auth'
import { categoryResolvers } from './categories'
import { transactionResolvers } from './transactions'
import { dashboardResolvers } from './dashboard'

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: Context) => {
      if (!ctx.userId) throw new Error('Unauthorized')
      return prisma.user.findUnique({ where: { id: ctx.userId } })
    },
    ...dashboardResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
  Category: categoryResolvers.Category,
  Transaction: transactionResolvers.Transaction,
}
