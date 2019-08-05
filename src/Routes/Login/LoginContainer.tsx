import { message } from "antd"
import React from "react"
import { Mutation } from "react-apollo"
import { RouteComponentProps } from "react-router"
import {
  OrganizationSignIn,
  OrganizationSignInVariables
} from "../../types/api"
import LoginPresenter from "./LoginPresenter"
import { ORGANIZATION_SIGN_IN } from "./LoginQueries"

interface IState {
  organizationId: string
  password: string
}

class LogInMutation extends Mutation<
  OrganizationSignIn,
  OrganizationSignInVariables
> {}

class LoginContainer extends React.Component<RouteComponentProps<any>, IState> {
  public loginMutation

  public state = {
    organizationId: "",
    password: ""
  }

  public render() {
    return (
      <LogInMutation
        mutation={ORGANIZATION_SIGN_IN}
        variables={{
          loginId: this.state.organizationId,
          password: this.state.password
        }}
        onCompleted={data => {
          const {
            OrganizationSignIn: { ok, error, token }
          } = data
          if (ok) {
            localStorage.setItem("jwt", token!)
            window.location.pathname = "/"
          } else {
            message.error(error)
          }
        }}
      >
        {(mutation, { loading }) => {
          this.loginMutation = mutation
          return (
            <LoginPresenter
              organizationId={this.state.organizationId}
              password={this.state.password}
              loading={loading}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
              onClickSignUp={this.onClickSignUp}
            />
          )
        }}
      </LogInMutation>
    )
  }

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = event => {
    const {
      target: { name, value }
    } = event
    this.setState({
      [name]: value
    } as any)
  }

  public onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()
    this.loginMutation()
  }

  public onClickSignUp: React.MouseEventHandler<HTMLElement> = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    window.location.pathname = "/sign-up"
  }
}

export default LoginContainer
