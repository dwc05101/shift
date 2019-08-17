import { message } from "antd"
import React from "react"
import { Mutation } from "react-apollo"
import { RouteComponentProps } from "react-router"
import {
  CreateOrganization,
  CreateOrganizationVariables
} from "../../types/api"
import SignUpPresenter from "./SignUpPresenter"
import { CREATE_ORGANIZATION } from "./SignUpQueries"

interface IState {
  name: string
  loginId: string
  email: string
  password: string
  passwordVerification: string
}

class SignUpMutation extends Mutation<
  CreateOrganization,
  CreateOrganizationVariables
> {}

class SignUpContainer extends React.Component<
  RouteComponentProps<any>,
  IState
> {
  public state = {
    email: "",
    loginId: "",
    name: "",
    password: "",
    passwordVerification: ""
  }
  private signInMutation
  public render() {
    return (
      <SignUpMutation
        mutation={CREATE_ORGANIZATION}
        variables={{
          email: this.state.email,
          loginId: this.state.loginId,
          name: this.state.name,
          password: this.state.password
        }}
        onCompleted={data => {
          const {
            CreateOrganization: { ok, error, token }
          } = data
          if (ok) {
            localStorage.setItem("jwt", token!)
            window.location.reload()
          } else {
            message.error(error)
          }
        }}
      >
        {(mutation, { loading }) => {
          this.signInMutation = mutation
          return (
            <SignUpPresenter
              name={this.state.name}
              loginId={this.state.loginId}
              email={this.state.email}
              password={this.state.password}
              passwordVerification={this.state.passwordVerification}
              loading={loading}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
          )
        }}
      </SignUpMutation>
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
    if (!this.isPasswordEqual()) {
      message.error("비밀번호가 동일하지 않습니다.")
      return
    }
    this.signInMutation()
  }

  private isPasswordEqual = (): boolean => {
    const { password, passwordVerification } = this.state
    return password === passwordVerification
  }
}

export default SignUpContainer
