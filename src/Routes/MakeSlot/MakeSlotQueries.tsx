import gql from "graphql-tag"

export const CREATE_SLOT = gql`
  mutation CreateSlot(
    $startTime: String!
    $endTime: String!
    $dayNumber: Int!
    $timetableId: Int!
    $personalCode: String!
    $organizationId: Int!
  ) {
    CreateSlot(
      startTime: $startTime
      endTime: $endTime
      dayNumber: $dayNumber
      timetableId: $timetableId
      personalCode: $personalCode
      organizationId: $organizationId
    ) {
      ok
      error
    }
  }
`
