import gql from "graphql-tag"

export const REMOVE_USER = gql`
  mutation RemoveUserFromOrganization($users: [Int]!) {
    RemoveUserFromOrganization(users: $users) {
      ok
      error
    }
  }
`
