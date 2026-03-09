import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma'
import { Context } from '../context'

export const authResolvers = {
  Mutation: {
    register: async (
      _: unknown,
      args: { name: string; email: string; password: string }
    ) => {
      const existing = await prisma.user.findUnique({ where: { email: args.email } })
      if (existing) throw new Error('Email already in use')

      const hashed = await bcrypt.hash(args.password, 10)
      const user = await prisma.user.create({
        data: { name: args.name, email: args.email, password: hashed }
      })

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
      return { token, user }
    },

    login: async (
      _: unknown,
      args: { email: string; password: string }
    ) => {
      const user = await prisma.user.findUnique({ where: { email: args.email } })
      if (!user) throw new Error('Invalid credentials')

      const valid = await bcrypt.compare(args.password, user.password)
      if (!valid) throw new Error('Invalid credentials')

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
      return { token, user }
    },

    updateUser: async (_: unknown, args: { name: string }, ctx: Context) => {
      if (!ctx.userId) throw new Error('Unauthorized')
      return prisma.user.update({
        where: { id: ctx.userId },
        data: { name: args.name }
      })
    }
  }
}
