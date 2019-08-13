import React from "react"
import { Query } from "react-apollo"
import { GET_PROFILE } from "../../GlobalQuries"
import history from "../../history"
import { GetOrganizationProfile } from "../../types/api"
import NavPresenter from "./NavPresenter"

interface IState {
  isProfile: boolean
  current: string
}

const parseLocation = (pathname: string) => {
  const parsedPathname = pathname.split("/")
  return parsedPathname[1]
}

class GetProfileQuery extends Query<GetOrganizationProfile> {}

class Nav extends React.Component<{}, IState> {
  public state = {
    current:
      parseLocation(history.location.pathname) === ""
        ? "dashboard"
        : parseLocation(history.location.pathname),
    isProfile: false
  }

  public render() {
    return (
      <GetProfileQuery query={GET_PROFILE}>
        {({ data, loading }) => {
          return (
            <NavPresenter
              isProfile={this.state.isProfile}
              loading={loading}
              profile={data}
              current={this.state.current}
              handleClick={this.handleClick}
              goToProfile={this.goToProfile}
              doLogout={this.doLogout}
              goToHome={this.goToHome}
            />
          )
        }}
      </GetProfileQuery>
    )
  }

  public handleClick = e => {
    history.push(`/${e.key}`)
    this.setState({
      current: e.key
    })
  }

  public goToProfile = e => {
    window.location.pathname = "/profile"
    this.setState({
      current: "profile",
      isProfile: true
    })
  }

  public doLogout = e => {
    localStorage.removeItem("jwt")
    window.location.reload()
  }

  public goToHome = e => {
    history.push("/")
    this.setState({
      current: "dashboard",
      isProfile: false
    })
  }
}

export default Nav
