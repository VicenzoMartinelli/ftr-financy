export interface Category {
  id: string
  name: string
  description?: string | null
  icon: string
  color: string
  transactionCount: number
}

export interface CategoryStats {
  totalCategories: number
  totalTransactions: number
  mostUsedCategory?: Category | null
}

export interface User {
  id: string
  name: string
  email: string
}

export interface Transaction {
  id: string
  title: string
  amount: number
  type: string
  date: string
  category: Category
}

export interface TransactionPage {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
}
