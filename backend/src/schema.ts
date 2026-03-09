export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    description: String
    icon: String!
    color: String!
    transactionCount: Int!
    createdAt: String!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: String!
    date: String!
    category: Category!
    createdAt: String!
  }

  type TransactionPage {
    transactions: [Transaction!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  type CategoryBreakdown {
    category: Category!
    count: Int!
    total: Float!
  }

  type DashboardData {
    balance: Float!
    monthlyIncome: Float!
    monthlyExpenses: Float!
    recentTransactions: [Transaction!]!
    categoryBreakdown: [CategoryBreakdown!]!
  }

  type CategoryStats {
    totalCategories: Int!
    totalTransactions: Int!
    mostUsedCategory: Category
  }

  type Query {
    me: User!
    dashboard: DashboardData!
    categories: [Category!]!
    categoryStats: CategoryStats!
    transactions(
      search: String
      type: String
      categoryId: ID
      month: Int
      year: Int
      page: Int
      limit: Int
    ): TransactionPage!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(name: String!): User!

    createCategory(name: String!, description: String, icon: String, color: String): Category!
    updateCategory(id: ID!, name: String, description: String, icon: String, color: String): Category!
    deleteCategory(id: ID!): Boolean!

    createTransaction(title: String!, amount: Float!, type: String!, categoryId: ID!, date: String!): Transaction!
    updateTransaction(id: ID!, title: String, amount: Float, type: String, categoryId: ID, date: String): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`
