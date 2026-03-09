import { Request } from 'express'
import jwt from 'jsonwebtoken'

export interface Context {
  userId: string | null
}

export async function createContext({ req }: { req: Request }): Promise<Context> {
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) return { userId: null }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return { userId: payload.userId }
  } catch {
    return { userId: null }
  }
}
