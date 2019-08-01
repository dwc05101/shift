import React from "react"

import { graphql } from "react-apollo"
import AppPresenter from "./AppPresenter"
import { IS_LOGGED_IN } from "./AppQueries"

const AppContainer: React.SFC<any> = ({ data }) => {
  return (
    <React.Fragment>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </React.Fragment>
  )
}

export default graphql(IS_LOGGED_IN)(AppContainer)
