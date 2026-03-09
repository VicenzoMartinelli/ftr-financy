import { gql } from '@apollo/client'

export const GET_DASHBOARD = gql`
  query GetDashboard {
    dashboard {
      balance
      monthlyIncome
      monthlyExpenses
      recentTransactions {
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
      categoryBreakdown {
        category {
          id
          name
          icon
          color
        }
        count
        total
      }
    }
  }
`
