import gql from "graphql-tag"

export const GET_TIMETABLE = gql`
  query GetCurrentTimeTable($yearMonthWeek: String!, $organizationId: Int) {
    GetCurrentTimeTable(
      yearMonthWeek: $yearMonthWeek
      organizationId: $organizationId
    ) {
      ok
      error
      timetable {
        id
        isConfirmed
        links {
          url
        }
        days {
          startTime
          endTime
          dayNumber
          slots {
            id
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
  }
`

export const CREATE_LINK = gql`
  mutation CreateLink($timetableId: Int!) {
    CreateLink(timetableId: $timetableId) {
      ok
      error
      link {
        url
      }
    }
  }
`
