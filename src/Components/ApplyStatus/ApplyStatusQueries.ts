import gql from "graphql-tag"

export const REMOVE_SLOT = gql`
  mutation RemoveSlot($slotIds: [Int]!, $timetableId: Int!) {
    RemoveSlot(slotIds: $slotIds, timetableId: $timetableId) {
      ok
      error
    }
  }
`
