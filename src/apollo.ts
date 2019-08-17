import ApolloClient, { Operation } from "apollo-boost"

const client = new ApolloClient({
  clientState: {
    defaults: {
      auth: {
        __typename: "Auth",
        isLoggedIn: Boolean(localStorage.getItem("jwt"))
      }
    }
  },
  request: async (operation: Operation) => {
    operation.setContext({
      headers: {
        "X-JWT": localStorage.getItem("jwt") || ""
      }
    })
  },
  resolvers: {
    Mutation: {
      logUserIn: (_, { token }, { cache }) => {
        localStorage.setItem("jwt", token)
        cache.writeData({
          data: {
            auth: {
              __typename: "Auth",
              isLoggedIn: true
            }
          }
        })
        return null
      },
      logUserOut: (_, __, { cache }) => {
        localStorage.removeItem("jwt")
        cache.writeData({
          data: {
            auth: {
              __typename: "Auth",
              isLoggedIn: false
            }
          }
        })
        return null
      }
    }
  },
  uri: "https://server-shift.herokuapp.com/graphql"
})

export default client
