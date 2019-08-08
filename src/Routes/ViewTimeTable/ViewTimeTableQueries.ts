import gql from "graphql-tag"

export const GET_ALL_TIMETABLES = gql`
  query GetTimeTables {
    GetTimeTables {
      ok
      error
      timetables {
        id
        isConfirmed
        yearMonthWeek
        createdAt
        updatedAt
        days {
          dayNumber
          startTime
          endTime
          slots {
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
