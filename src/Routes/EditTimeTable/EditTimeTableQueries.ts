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
          id
          isSelected
          isFulltime
          startTime
          endTime
          isStartTimeNextDay
          isEndTimeNextDay
          userId
          dayId
          user {
            name
            personalCode
          }
        }
      }
    }
  }
`

export const CONFIRM_TIMETABLE = gql`
  mutation ConfirmTimeTable($timetableId: Int!) {
    ConfirmTimeTable(timetableId: $timetableId) {
      ok
      error
    }
  }
`
