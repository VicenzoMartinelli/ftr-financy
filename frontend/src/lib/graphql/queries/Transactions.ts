import { gql } from '@apollo/client'

export const GET_TRANSACTIONS = gql`
  query GetTransactions(
    $search: String
    $type: String
    $categoryId: ID
    $month: Int
    $year: Int
    $page: Int
    $limit: Int
  ) {
    transactions(
      search: $search
      type: $type
      categoryId: $categoryId
      month: $month
      year: $year
      page: $page
      limit: $limit
    ) {
      transactions {
        id
        title
        amount
        type
        date
        category {
          id
          name
          icon
          color
        }
      }
      total
      page
      limit
    }
  }
`
