import React from "react"
import { Query } from "react-apollo"
import { GET_PROFILE } from "../../GlobalQuries"
import { GetOrganizationProfile } from "../../types/api"
import NavPresenter from "./NavPresenter"

interface IProps {
  isSettings: boolean
  isProfile: boolean
  defaultKey: string
}

class GetProfileQuery extends Query<GetOrganizationProfile> {}

class Nav extends React.Component<IProps> {
  public state = {
    current: this.props.defaultKey
  }

  public render() {
    return (
      <GetProfileQuery query={GET_PROFILE}>
        {({ data, loading }) => {
          return (
            <NavPresenter
              isSettings={this.props.isSettings}
              isProfile={this.props.isProfile}
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
    window.location.pathname = e.key
    this.setState({
      current: e.key
    })
  }

  public goToProfile = e => {
    window.location.pathname = "/profile"
  }

  public doLogout = e => {
    localStorage.removeItem("jwt")
    window.location.reload()
  }

  public goToHome = e => {
    window.location.pathname = "/"
  }
}

export default Nav
