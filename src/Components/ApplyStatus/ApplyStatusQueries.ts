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

export const REMOVE_SLOT = gql`
  mutation RemoveSlot($slotIds: [Int]!, $timetableId: Int!) {
    RemoveSlot(slotIds: $slotIds, timetableId: $timetableId) {
      ok
      error
    }
  }
`
