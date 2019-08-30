import { message } from "antd"
import React from "react"
import { Mutation } from "react-apollo"
import { GET_USERS } from "../../GlobalQuries"
import { UpdateUser, UpdateUserVariables } from "../../types/api"
import EditUserModalPresenter from "./EditUserModalPresenter"
import { EDIT_USER } from "./EditUserModalQueries"

interface IProps {
  visible: boolean
  userId: number
  name: string
  personalCode: string
  phoneNumber: string
  userRank: number
}

interface IState {
  userId: number
  name: string
  personalCode: string
  phoneNumber: string
  userRank: number
  visible: boolean
}

class EditUserMutation extends Mutation<UpdateUser, UpdateUserVariables> {}

class EditUserModalContainer extends React.Component<IProps, IState> {
  public mutationFn

  public state = {
    name: this.props.name,
    personalCode: this.props.personalCode,
    phoneNumber: this.props.phoneNumber,
    userId: this.props.userId,
    userRank: this.props.userRank,
    visible: this.props.visible
  }

  public render() {
    const {
      userId,
      name,
      personalCode,
      phoneNumber,
      userRank,
      visible
    } = this.state
    return (
      <EditUserMutation
        mutation={EDIT_USER}
        variables={{ userId, name, personalCode, phoneNumber, userRank }}
        onCompleted={data => {
          if (data.UpdateUser.ok) {
            message.success("성공적으로 수정하였습니다!")
            this.setState({
              visible: false
            })
          } else {
            message.error("정보 수정에 실패했습니다.")
          }
        }}
        refetchQueries={[{ query: GET_USERS }]}
      >
        {(mutation, { loading }) => {
          this.mutationFn = mutation
          return (
            <EditUserModalPresenter
              loading={loading}
              visible={visible}
              name={name}
              personalCode={personalCode}
              phoneNumber={phoneNumber}
              userRank={userRank}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
              onCancel={this.onCancel}
              onSelectChange={this.onSelectChange}
            />
          )
        }}
      </EditUserMutation>
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
    this.mutationFn()
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

export default EditUserModalContainer
