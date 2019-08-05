import React from "react"

import { graphql } from "react-apollo"
import { ThemeProvider } from "styled-components"
import { theme } from "../../theme"
import AppPresenter from "./AppPresenter"
import { IS_LOGGED_IN } from "./AppQueries.local"

import "antd/dist/antd.css"

const AppContainer: React.SFC<any> = ({ data }) => {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme} />
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </React.Fragment>
  )
}

export default graphql(IS_LOGGED_IN)(AppContainer)
