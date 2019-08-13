import gql from "graphql-tag"

export const REMOVE_USER = gql`
  mutation RemoveUserFromOrganization($userId: Int!) {
    RemoveUserFromOrganization(userId: $userId) {
      ok
      error
    }
  }
`
