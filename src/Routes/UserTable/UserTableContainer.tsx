import React from "react"
import { Query } from "react-apollo"
import { GET_USERS } from "../../GlobalQuries"
import { GetUsers } from "../../types/api"
import UserTablePresenter from "./UserTablePresenter"

interface IState {
  selectedRowKeys: string[]
  createUserModalVisible: boolean
}

class GetUsersQuery extends Query<GetUsers> {}

class UserTableContainer extends React.Component<IState> {
  public state = {
    createUserModalVisible: false,
    selectedRowKeys: []
  }

  public render() {
    return (
      <GetUsersQuery query={GET_USERS}>
        {({ data, loading }) => {
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
