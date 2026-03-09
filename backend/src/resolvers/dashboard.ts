import prisma from '../prisma'
import { Context } from '../context'

function requireAuth(ctx: Context): string {
  if (!ctx.userId) throw new Error('Unauthorized')
  return ctx.userId
}

export const dashboardResolvers = {
  Query: {
    dashboard: async (_: unknown, __: unknown, ctx: Context) => {
      const userId = requireAuth(ctx)
      const now = new Date()
      const monthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
      const monthEnd   = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1))

      const [allTransactions, monthlyTransactions, recentTransactions, categories] =
        await Promise.all([
          prisma.transaction.findMany({ where: { userId } }),
          prisma.transaction.findMany({
            where: { userId, date: { gte: monthStart, lt: monthEnd } },
          }),
          prisma.transaction.findMany({
            where: { userId },
            include: { category: true },
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
            take: 5,
          }),
          prisma.category.findMany({
            where: { userId },
            include: { transactions: true },
          }),
        ])

      const balance = allTransactions.reduce(
        (acc, tx) => (tx.type === 'income' ? acc + tx.amount : acc - tx.amount),
        0
      )
      const monthlyIncome = monthlyTransactions
        .filter(tx => tx.type === 'income')
        .reduce((acc, tx) => acc + tx.amount, 0)
      const monthlyExpenses = monthlyTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((acc, tx) => acc + tx.amount, 0)

      const categoryBreakdown = categories
        .filter(cat => cat.transactions.length > 0)
        .map(cat => ({
          category: cat,
          count: cat.transactions.length,
          total: cat.transactions.reduce((acc, tx) => acc + tx.amount, 0),
        }))
        .sort((a, b) => b.total - a.total)

      return { balance, monthlyIncome, monthlyExpenses, recentTransactions, categoryBreakdown }
    },
  },
}
