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
}

class GetUsersQuery extends Query<GetUsers> {}

class RemoveUserMutation extends Mutation<
  RemoveUserFromOrganization,
  RemoveUserFromOrganizationVariables
> {}

class UserTableContainer extends React.Component<IState> {
  public removeMutationFn

  public state = {
    createUserModalVisible: false,
    selectedRowKeys: []
  }

  public render() {
    return (
      <GetUsersQuery query={GET_USERS}>
        {({ data, loading }) => (
          <RemoveUserMutation mutation={REMOVE_USER}>
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
}

export default UserTableContainer
