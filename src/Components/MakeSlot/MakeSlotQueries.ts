import gql from "graphql-tag"

export const CREATE_SLOT = gql`
  mutation CreateSlot(
    $slots: [SlotInfo]!
    $timetableId: Int!
    $organizationId: Int!
  ) {
    CreateSlot(
      slots: $slots
      timetableId: $timetableId
      organizationId: $organizationId
    ) {
      ok
      error
    }
  }
`
