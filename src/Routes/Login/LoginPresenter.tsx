import { Button, Form, Icon, Input } from "antd"
import React from "react"
import Helmet from "react-helmet"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { CenterContainer } from "../../styledComponents"
import { theme } from "../../theme"

interface IProps {
  organizationId: string
  password: string
  loading: boolean
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClickSignUp: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const LoginPresenter: React.SFC<IProps> = ({
  organizationId,
  password,
  loading,
  onInputChange,
  onSubmit,
  onClickSignUp
}) => (
  <CenterContainer>
    <Helmet>
      <title>Shift | 로그인</title>
    </Helmet>
    <Image />
    <Content>
      <Login>
        <Header>
          <h1>Shift</h1>
        </Header>
        <Card>
          <Form onSubmit={onSubmit}>
            <Form.Item>
              <Input
                required={true}
                value={organizationId}
                onChange={onInputChange}
                name="organizationId"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25" }} />
                }
                placeholder="아이디"
              />
            </Form.Item>
            <Form.Item>
              <Input
                required={true}
                value={password}
                name="password"
                onChange={onInputChange}
                type="password"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25" }} />
                }
                placeholder="비밀번호"
              />
            </Form.Item>
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              style={{ width: "100%" }}
            >
              로그인
            </Button>
            <Button
              type="default"
              style={{ width: "100%", marginTop: "2%" }}
              onClick={onClickSignUp}
            >
              회원가입
            </Button>
          </Form>
          <Footer>
            <Link to={"/forgot"}>아...기억이 안나요</Link>
          </Footer>
        </Card>
      </Login>
    </Content>
  </CenterContainer>
)

const Image = styled.div`
  width: 50%;
  height: inherit;
  background-image: url(https://images3.alphacoders.com/658/658828.jpg);
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: inherit;
  background-color: ${theme.colors.grey};
`

const Login = styled.div`
  width: 40%;
  height: 50vh;
`

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30%;
  width: 100%;
`

const Card = styled.div`
  border-radius: 10px;
  background-color: ${theme.colors.white};
  height: 65%;
  min-height: 240px;
  width: 100%;
  padding: 5%;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 10%;
  width: 100%;
  margin-top: 5%;
`

export default LoginPresenter
