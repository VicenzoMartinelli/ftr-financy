import { gql } from '@apollo/client'

const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
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
`

export const CREATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  mutation CreateTransaction(
    $title: String!
    $amount: Float!
    $type: String!
    $categoryId: ID!
    $date: String!
  ) {
    createTransaction(
      title: $title
      amount: $amount
      type: $type
      categoryId: $categoryId
      date: $date
    ) {
      ...TransactionFields
    }
  }
`

export const UPDATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  mutation UpdateTransaction(
    $id: ID!
    $title: String
    $amount: Float
    $type: String
    $categoryId: ID
    $date: String
  ) {
    updateTransaction(
      id: $id
      title: $title
      amount: $amount
      type: $type
      categoryId: $categoryId
      date: $date
    ) {
      ...TransactionFields
    }
  }
`

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
