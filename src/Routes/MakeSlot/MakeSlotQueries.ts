import gql from "graphql-tag"

export const CREATE_SLOT = gql`
  mutation CreateSlot(
    $slots: [SlotInfo]!
    $timetableId: Int!
    $personalCode: String!
    $organizationId: Int!
  ) {
    CreateSlot(
      slots: $slots
      timetableId: $timetableId
      personalCode: $personalCode
      organizationId: $organizationId
    ) {
      ok
      error
    }
  }
`
