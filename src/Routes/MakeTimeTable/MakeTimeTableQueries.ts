import gql from "graphql-tag"

export const MAKE_TIMETABLE = gql`
  mutation CreateTimeTable($yearMonthWeek: String!, $days: [TimeTableDay]!) {
    CreateTimeTable(yearMonthWeek: $yearMonthWeek, days: $days) {
      ok
      error
      timetableId
    }
  }
`
