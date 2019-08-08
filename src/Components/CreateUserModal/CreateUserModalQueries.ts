import gql from "graphql-tag"

export const CREATE_USER = gql`
  mutation CreateUserToOrganization(
    $personalCode: String!
    $name: String!
    $phoneNumber: String!
  ) {
    CreateUserToOrganization(
      personalCode: $personalCode
      name: $name
      phoneNumber: $phoneNumber
    ) {
      ok
      error
    }
  }
`
