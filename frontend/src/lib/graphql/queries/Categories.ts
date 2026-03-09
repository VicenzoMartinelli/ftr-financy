import { gql } from '@apollo/client'

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      icon
      color
      transactionCount
    }
  }
`

export const GET_CATEGORY_STATS = gql`
  query GetCategoryStats {
    categoryStats {
      totalCategories
      totalTransactions
      mostUsedCategory {
        id
        name
        icon
        color
      }
    }
  }
`
