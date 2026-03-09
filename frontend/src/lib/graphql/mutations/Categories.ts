import { gql } from '@apollo/client'

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $description: String, $icon: String, $color: String) {
    createCategory(name: $name, description: $description, icon: $icon, color: $color) {
      id
      name
      description
      icon
      color
      transactionCount
    }
  }
`

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $name: String, $description: String, $icon: String, $color: String) {
    updateCategory(id: $id, name: $name, description: $description, icon: $icon, color: $color) {
      id
      name
      description
      icon
      color
      transactionCount
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`
