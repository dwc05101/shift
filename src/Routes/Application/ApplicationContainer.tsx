import { message } from "antd"
import React from "react"
import { Mutation } from "react-apollo"
import { RouteComponentProps } from "react-router"
import { AuthenticateUser, AuthenticateUserVariables } from "../../types/api"
import ApplicationPresenter from "./ApplicationPresenter"
import { AUTH_USER } from "./ApplicationQueries"

interface IMatchParams {
  organizationId: string
  timetableId: string
}

class AuthUserMutation extends Mutation<
  AuthenticateUser,
  AuthenticateUserVariables
> {}

class ApplicationContainer extends React.Component<
  RouteComponentProps<IMatchParams>
> {
  public mutationFn

  public state = {
    isAuthenticated: false,
    organizationId: parseInt(this.props.match.params.organizationId, 10),
    personalCode: "",
    slots: [],
    timetableId: parseInt(this.props.match.params.timetableId, 10)
  }

  public render() {
    const {
      isAuthenticated,
      organizationId,
      personalCode,
      slots,
      timetableId
    } = this.state
    return (
      <AuthUserMutation
        mutation={AUTH_USER}
        variables={{
          organizationId,
          personalCode
        }}
        onCompleted={data => {
          if (data.AuthenticateUser.ok) {
            this.setState({
              isAuthenticated: true,
              slots: data.AuthenticateUser.user!.slots
                ? data.AuthenticateUser.user!.slots
                : []
            })
          } else if (data.AuthenticateUser.error) {
            message.error(data.AuthenticateUser.error)
          } else {
            message.error("서버내부에러")
          }
        }}
      >
        {(mutation, { loading }) => {
          this.mutationFn = mutation
          return (
            <ApplicationPresenter
              slots={slots}
              isAuthenticated={isAuthenticated}
              organizationId={organizationId}
              timetableId={timetableId}
              personalCode={personalCode}
              onChange={this.onChange}
              loading={loading}
              onClick={this.onClick}
            />
          )
        }}
      </AuthUserMutation>
    )
  }

  public onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      personalCode: event.target.value
    })
  }

  public onClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (this.state.personalCode === "") {
      message.error("개인번호를 입력해주세요.")
      return
    }

    this.mutationFn()
  }
}

export default ApplicationContainer
