import { Button, Table, Typography } from "antd"
import React from "react"
import styled from "styled-components"
import CreateUserModal from "../../Components/CreateUserModal"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"
import { GetUsers, GetUsers_GetUsers_users } from "../../types/api"

interface IProps {
  loading: boolean
  createUserModalVisible: boolean
  data: GetUsers | undefined
  selectedRowKeys: string[]
  onChange: (selectedRowKeys: any) => void
  openCreateUserModal: (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void
}

const UserTablePresenter: React.SFC<IProps> = ({
  data,
  selectedRowKeys,
  onChange,
  loading,
  openCreateUserModal,
  createUserModalVisible
}) => {
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
              <Typography.Title level={1}>구성원 관리</Typography.Title>
              <Operations>
                <Button
                  type="danger"
                  disabled={selectedRowKeys.length === 0}
                  style={{ marginRight: "20px" }}
                >
                  삭제
                </Button>
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
  }
]

const parseData = (users: Array<GetUsers_GetUsers_users | null>): any[] => {
  const parsed: any[] = []
  users.forEach(user => {
    const data = {
      key: user!.id,
      name: user!.name,
      personalCode: user!.personalCode,
      phoneNumber: user!.phoneNumber
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
