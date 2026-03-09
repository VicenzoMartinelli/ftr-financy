import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { createContext } from './context'

async function main() {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })

  await server.start()

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({ origin: '*' }),
    express.json(),
    expressMiddleware(server, { context: createContext })
  )

  const PORT = process.env.PORT ?? 4000
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve))
  console.log(`Server ready at http://localhost:${PORT}/graphql`)
}

main().catch(console.error)
