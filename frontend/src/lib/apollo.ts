import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { authStore } from '@/stores/auth'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BACKEND_URL,
})

const authLink = setContext((_, { headers }) => {
  const token = authStore.getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors?.some(e => e.message === 'Unauthorized')) {
    authStore.clearToken()
    window.location.replace('/login')
  }
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
