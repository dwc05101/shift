import gql from "graphql-tag"

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization(
    $name: String!
    $loginId: String!
    $email: String!
    $password: String!
  ) {
    CreateOrganization(
      name: $name
      loginId: $loginId
      email: $email
      password: $password
    ) {
      ok
      error
      token
    }
  }
`
