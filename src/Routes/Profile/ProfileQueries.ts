import gql from "graphql-tag"

export const UPDATE_PROFILE = gql`
  mutation UpdateOrganization(
    $name: String!
    $password: String!
    $email: String!
  ) {
    UpdateOrganization(name: $name, password: $password, email: $email) {
      ok
      error
    }
  }
`
