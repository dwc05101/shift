import { message } from "antd"
import React from "react"
import { Mutation, Query } from "react-apollo"
import { GET_PROFILE } from "../../GlobalQuries"
import history from "../../history"
import {
  GetOrganizationProfile,
  UpdateOrganization,
  UpdateOrganizationVariables
} from "../../types/api"
import ProfilePresenter from "./ProfilePresenter"
import { UPDATE_PROFILE } from "./ProfileQueries"

interface IState {
  name: string
  password: string
  passwordVerification: string
  email: string
}

class GetProfileQuery extends Query<GetOrganizationProfile> {}

class UpdateProfileMutation extends Mutation<
  UpdateOrganization,
  UpdateOrganizationVariables
> {}

class ProfileContainer extends React.Component<IState> {
  public updateMutation

  public state = {
    email: "",
    name: "",
    password: "",
    passwordVerification: ""
  }

  public render() {
    const { email, name, password, passwordVerification } = this.state
    return (
      <GetProfileQuery
        query={GET_PROFILE}
        onCompleted={data => this.updateFields(data)}
      >
        {() => (
          <UpdateProfileMutation
            mutation={UPDATE_PROFILE}
            variables={{ email, name, password }}
            refetchQueries={[{ query: GET_PROFILE }]}
            onCompleted={data => {
              if (data.UpdateOrganization.ok) {
                message.success("내 정보가 업데이트 되었습니다!")
              } else if (data.UpdateOrganization.error) {
                message.error("인증되지 않았습니다.")
                history.push("/dashboard")
              } else {
                message.error("서버 내부 에러가 발생했습니다.")
              }
            }}
          >
            {(mutation, { loading }) => {
              this.updateMutation = mutation
              return (
                <ProfilePresenter
                  email={email}
                  name={name}
                  password={password}
                  passwordVerification={passwordVerification}
                  onInputChange={this.onInputChange}
                  onSubmit={this.onSubmit}
                  loading={loading}
                />
              )
            }}
          </UpdateProfileMutation>
        )}
      </GetProfileQuery>
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
    this.updateMutation()
  }

  private updateFields = (data: GetOrganizationProfile) => {
    if (data.GetOrganizationProfile) {
      const {
        GetOrganizationProfile: { organization }
      } = data
      if (organization !== null) {
        const { name, email } = organization
        this.setState({
          email,
          name
        } as any)
      }
    }
  }

  private isPasswordEqual = (): boolean => {
    const { password, passwordVerification } = this.state
    return password === passwordVerification
  }
}

export default ProfileContainer
