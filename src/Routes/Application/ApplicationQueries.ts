import gql from "graphql-tag"

export const AUTH_USER = gql`
  mutation AuthenticateUser($personalCode: String!, $organizationId: Int!) {
    AuthenticateUser(
      personalCode: $personalCode
      organizationId: $organizationId
    ) {
      ok
      error
      user {
        slots {
          isFulltime
          startTime
          isEndTimeNextDay
          isStartTimeNextDay
          endTime
          day {
            dayNumber
          }
        }
      }
    }
  }
`
