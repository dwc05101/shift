import gql from "graphql-tag"

export const CREATE_USER = gql`
  mutation CreateUserToOrganization(
    $personalCode: String!
    $name: String!
    $phoneNumber: String!
    $userRank: UserRank!
  ) {
    CreateUserToOrganization(
      personalCode: $personalCode
      name: $name
      phoneNumber: $phoneNumber
      userRank: $userRank
    ) {
      ok
      error
    }
  }
`
