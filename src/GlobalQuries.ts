import gql from "graphql-tag"

export const GET_USERS = gql`
  query GetUsers {
    GetUsers {
      ok
      error
      users {
        id
        userRank
        personalCode
        name
        phoneNumber
        organizationId
        slots {
          id
          day {
            timetable {
              id
              yearMonthWeek
            }
          }
        }
      }
    }
  }
`

export const GET_PROFILE = gql`
  query GetOrganizationProfile {
    GetOrganizationProfile {
      ok
      error
      organization {
        name
        email
        users {
          id
        }
      }
    }
  }
`
