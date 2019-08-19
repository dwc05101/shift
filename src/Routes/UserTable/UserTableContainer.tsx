import { message } from "antd"
import React from "react"
import { Mutation, Query } from "react-apollo"
import { GET_USERS } from "../../GlobalQuries"
import {
  GetUsers,
  RemoveUserFromOrganization,
  RemoveUserFromOrganizationVariables
} from "../../types/api"
import UserTablePresenter from "./UserTablePresenter"
import { REMOVE_USER } from "./UserTableQueries"

interface IState {
  selectedRowKeys: string[]
  createUserModalVisible: boolean
  editUserModalVisible: boolean
  showDeleteConfirm: boolean
  isConfirmed: boolean
  data: GetUsers | undefined
  userId: number
  name: string
  personalCode: string
  phoneNumber: string
  userRank: number
}

class GetUsersQuery extends Query<GetUsers> {}

class RemoveUserMutation extends Mutation<
  RemoveUserFromOrganization,
  RemoveUserFromOrganizationVariables
> {}

class UserTableContainer extends React.Component<{}, IState> {
  public removeMutationFn

  public state = {
    createUserModalVisible: false,
    data: undefined,
    editUserModalVisible: false,
    isConfirmed: false,
    name: "",
    personalCode: "",
    phoneNumber: "",
    selectedRowKeys: [],
    showDeleteConfirm: false,
    userId: -1,
    userRank: 3
  }

  public render() {
    return (
      <GetUsersQuery
        query={GET_USERS}
        onCompleted={data => this.setState({ data })}
      >
        {({ data, loading }) => (
          <RemoveUserMutation
            mutation={REMOVE_USER}
            variables={{ users: this.state.selectedRowKeys }}
            onCompleted={response => {
              if (response.RemoveUserFromOrganization.ok) {
                message.success("성공적으로 삭제 했습니다.")
                this.setState({
                  isConfirmed: false,
                  selectedRowKeys: [],
                  showDeleteConfirm: false
                })
              } else if (response.RemoveUserFromOrganization.error) {
                message.error(
                  "에러 : " + response.RemoveUserFromOrganization.error
                )
              } else {
                message.error("서버 내부 에러")
              }
            }}
            refetchQueries={[{ query: GET_USERS }]}
          >
            {mutationFn => {
              const {
                selectedRowKeys,
                createUserModalVisible,
                editUserModalVisible,
                showDeleteConfirm,
                userId,
                name,
                userRank,
                personalCode,
                phoneNumber
              } = this.state
              this.removeMutationFn = mutationFn
              return (
                <UserTablePresenter
                  data={data}
                  loading={loading}
                  selectedRowKeys={selectedRowKeys}
                  onChange={this.onChange}
                  createUserModalVisible={createUserModalVisible}
                  openCreateUserModal={this.openCreateUserModal}
                  showDeleteConfirm={showDeleteConfirm}
                  onConfirm={this.onConfirm}
                  onDelete={this.onDelete}
                  userId={userId}
                  name={name}
                  userRank={userRank}
                  personalCode={personalCode}
                  phoneNumber={phoneNumber}
                  editUserModalVisible={editUserModalVisible}
                  onClickEdit={this.onClickEdit}
                />
              )
            }}
          </RemoveUserMutation>
        )}
      </GetUsersQuery>
    )
  }

  public onChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys
    })
  }

  public openCreateUserModal: (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void = event => {
    this.setState({
      createUserModalVisible: !this.state.createUserModalVisible
    })
  }

  public onConfirm = e => {
    this.removeMutationFn()
  }

  public onDelete = e => {
    this.setState({
      showDeleteConfirm: true
    })
  }

  public onClickEdit = target => {
    const data: GetUsers | undefined = this.state.data
    const index = data!.GetUsers.users!.findIndex(
      user => user!.personalCode === target.personalCode
    )
    if (index > -1) {
      const targetUser = data!.GetUsers.users![index]
      this.setState({
        editUserModalVisible: !this.state.editUserModalVisible,
        name: targetUser!.name,
        personalCode: targetUser!.personalCode,
        phoneNumber: targetUser!.phoneNumber,
        userId: targetUser!.id,
        userRank: targetUser!.userRank
      })
    } else {
      message.error("존재하지 않는 유저 입니다.")
    }
  }
}

export default UserTableContainer
