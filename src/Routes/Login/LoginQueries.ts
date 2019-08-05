import gql from "graphql-tag"

export const ORGANIZATION_SIGN_IN = gql`
  mutation OrganizationSignIn($loginId: String!, $password: String!) {
    OrganizationSignIn(loginId: $loginId, password: $password) {
      ok
      error
      token
    }
  }
`
