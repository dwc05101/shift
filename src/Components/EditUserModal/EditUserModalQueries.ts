import gql from "graphql-tag"

export const EDIT_USER = gql`
  mutation UpdateUser(
    $userId: Int!
    $personalCode: String
    $userRank: Int
    $name: String
    $phoneNumber: String
  ) {
    UpdateUser(
      userId: $userId
      personalCode: $personalCode
      userRank: $userRank
      name: $name
      phoneNumber: $phoneNumber
    ) {
      ok
      error
    }
  }
`
