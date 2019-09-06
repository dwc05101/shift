import { Button, Popconfirm, Table, Typography } from "antd"
import React from "react"
import styled from "styled-components"
import CreateUserModal from "../../Components/CreateUserModal"
import EditUserModal from "../../Components/EditUserModal"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"
import { GetUsers, GetUsers_GetUsers_users } from "../../types/api"

interface IProps {
  loading: boolean
  createUserModalVisible: boolean
  editUserModalVisible: boolean
  data: GetUsers | undefined
  selectedRowKeys: string[]
  showDeleteConfirm: boolean
  userId: number
  name: string
  personalCode: string
  phoneNumber: string
  userRank: string
  onChange: (selectedRowKeys: any) => void
  openCreateUserModal: (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void
  onConfirm: (e: any) => void
  onDelete: (e: any) => void
  onClickEdit: (target: any) => void
}

let onClickEditButton

const UserTablePresenter: React.SFC<IProps> = ({
  data,
  selectedRowKeys,
  onChange,
  loading,
  openCreateUserModal,
  createUserModalVisible,
  onConfirm,
  showDeleteConfirm,
  onDelete,
  name,
  userId,
  userRank,
  personalCode,
  phoneNumber,
  editUserModalVisible,
  onClickEdit
}) => {
  onClickEditButton = onClickEdit
  const rowSelection = {
    onChange,
    selectedRowKeys
  }
  return (
    <Container>
      <Content>
        <InnerShadowedBox>
          <Wrapper>
            <Header>
              {createUserModalVisible ? (
                <CreateUserModal visible={createUserModalVisible} />
              ) : null}
              {editUserModalVisible ? (
                <EditUserModal
                  visible={editUserModalVisible}
                  name={name}
                  userId={userId}
                  phoneNumber={phoneNumber}
                  userRank={userRank}
                  personalCode={personalCode}
                />
              ) : null}
              <Typography.Title level={1}>구성원 관리</Typography.Title>
              <Operations>
                <Popconfirm
                  title="정말로 삭제 하시겠습니까?"
                  onConfirm={onConfirm}
                  disabled={selectedRowKeys.length === 0}
                  okText="네"
                  cancelText="아니오"
                >
                  <Button
                    type="danger"
                    disabled={selectedRowKeys.length === 0}
                    style={{ marginRight: "20px" }}
                    onClick={onDelete}
                  >
                    삭제
                  </Button>
                </Popconfirm>
                <Button type="primary" onClick={openCreateUserModal}>
                  추가
                </Button>
              </Operations>
            </Header>
            <Body>
              <Table
                columns={columns}
                rowSelection={rowSelection}
                dataSource={loading ? [] : parseData(data!.GetUsers.users!)}
                loading={loading}
              />
            </Body>
          </Wrapper>
        </InnerShadowedBox>
      </Content>
    </Container>
  )
}

const columns = [
  {
    dataIndex: "userRank",
    render: (text, record) => {
      switch (text) {
        case "ONE":
          return <Typography.Text>1</Typography.Text>
        case "TWO":
          return <Typography.Text>2</Typography.Text>
        case "THREE":
          return <Typography.Text>3</Typography.Text>
        default:
          return null
      }
    },
    title: "랭크"
  },
  {
    dataIndex: "name",
    title: "이름"
  },
  {
    dataIndex: "personalCode",
    title: "개인번호"
  },
  {
    dataIndex: "phoneNumber",
    title: "전화번호"
  },
  {
    render: (text, record) => (
      <Button
        type="link"
        onClick={() => {
          onClickEditButton(text)
        }}
      >
        수정
      </Button>
    ),
    title: ""
  }
]

const parseData = (users: Array<GetUsers_GetUsers_users | null>): any[] => {
  const parsed: any[] = []
  users.forEach(user => {
    const data = {
      key: user!.id,
      name: user!.name,
      personalCode: user!.personalCode,
      phoneNumber: user!.phoneNumber,
      userRank: user!.userRank
    }
    parsed.push(data)
  })
  return parsed
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 10%;
`

const Operations = styled.div`
  width: fit-content;
  height: 100%;
  margin-left: auto;
  display: flex;
`
const Body = styled.div`
  width: 100%;
  height: 90%;
`

export default UserTablePresenter
