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
  showDeleteConfirm: boolean
  isConfirmed: boolean
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
    isConfirmed: false,
    selectedRowKeys: [],
    showDeleteConfirm: false
  }

  public render() {
    return (
      <GetUsersQuery query={GET_USERS}>
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
              this.removeMutationFn = mutationFn
              return (
                <UserTablePresenter
                  data={data}
                  loading={loading}
                  selectedRowKeys={this.state.selectedRowKeys}
                  onChange={this.onChange}
                  createUserModalVisible={this.state.createUserModalVisible}
                  openCreateUserModal={this.openCreateUserModal}
                  showDeleteConfirm={this.state.showDeleteConfirm}
                  onConfirm={this.onConfirm}
                  onDelete={this.onDelete}
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
}

export default UserTableContainer
