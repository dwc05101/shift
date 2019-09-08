import { message } from "antd"
import React from "react"
import { Mutation } from "react-apollo"
import { GET_USERS } from "../../GlobalQuries"
import {
  CreateUserToOrganization,
  CreateUserToOrganizationVariables
} from "../../types/api"
import CreateUserModalPresenter from "./CreateUserModalPresenter"
import { CREATE_USER } from "./CreateUserModalQueries"

interface IProps {
  visible: boolean
}

class CreateUserMutation extends Mutation<
  CreateUserToOrganization,
  CreateUserToOrganizationVariables
> {}

class CreateUserModalContainer extends React.Component<IProps> {
  public createMutation

  public state = {
    name: "",
    personalCode: "",
    phoneNumber: "",
    userRank: 3,
    visible: this.props.visible
  }

  public render() {
    const { name, personalCode, phoneNumber, visible, userRank } = this.state
    return (
      <CreateUserMutation
        mutation={CREATE_USER}
        variables={{ name, personalCode, phoneNumber, userRank }}
        onCompleted={data => {
          if (data.CreateUserToOrganization.ok) {
            message.success("구성원이 추가되었습니다!")
            this.setState({
              visible: false
            })
          } else {
            message.error("개인번호가 중복되었습니다.")
          }
        }}
        refetchQueries={[{ query: GET_USERS }]}
      >
        {(mutation, { loading }) => {
          this.createMutation = mutation
          return (
            <CreateUserModalPresenter
              visible={visible}
              name={name}
              userRank={userRank}
              personalCode={personalCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
              loading={loading}
              onCancel={this.onCancel}
              onSelectChange={this.onSelectChange}
            />
          )
        }}
      </CreateUserMutation>
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

  public onSubmit: (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void = event => {
    const { name, phoneNumber, personalCode } = this.state
    event.preventDefault()
    if (name === "" || phoneNumber === "" || personalCode === "") {
      message.error("정보를 모두 입력해 주세요.")
      return
    }
    this.createMutation()
  }

  public onCancel: (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void = event => {
    this.setState({
      visible: false
    })
  }

  public onSelectChange = value => {
    this.setState({
      userRank: value
    })
  }
}

export default CreateUserModalContainer
