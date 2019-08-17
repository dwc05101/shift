import gql from "graphql-tag"

export const GET_DAYS = gql`
  query GetDays($timetableId: Int!) {
    GetDays(timetableId: $timetableId) {
      days {
        id
        dayNumber
        startTime
        endTime
        isEndTimeNextDay
        timetableId

        slots {
          isFulltime
          startTime
          endTime
          user {
            name
            personalCode
          }
        }
      }
    }
  }
`
