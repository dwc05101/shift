import { Button, Form, Icon, Input, Typography } from "antd"
import React from "react"
import Helmet from "react-helmet"
import styled from "styled-components"

import logo from "../../images/logo_colored.png"
import { CenterContainerWithBackground } from "../../styledComponents"
import { theme } from "../../theme"

interface IProps {
  name: string
  loginId: string
  email: string
  password: string
  passwordVerification: string
  loading: boolean
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const SignUpPresenter: React.SFC<IProps> = ({
  name,
  loginId,
  email,
  password,
  passwordVerification,
  loading,
  onInputChange,
  onSubmit
}) => (
  <CenterContainerWithBackground
    style={{
      alignItems: "center",
      backgroundColor: theme.colors.grey,
      justifyContent: "center"
    }}
  >
    <Helmet>
      <title>Shift | 회원가입</title>
    </Helmet>
    <Content>
      <Header>
        <img alt="logo" src={logo} height={"100px"} />
      </Header>
      <Title>
        <Typography.Title level={3}>회원가입</Typography.Title>
      </Title>
      <Body>
        <Information>
          <Form onSubmit={onSubmit}>
            <Form.Item>
              <Input
                required={true}
                name="loginId"
                value={loginId}
                onChange={onInputChange}
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25" }} />
                }
                placeholder="아이디"
              />
            </Form.Item>

            <Form.Item>
              <Input
                required={true}
                name="password"
                type="password"
                value={password}
                onChange={onInputChange}
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25" }} />
                }
                placeholder="비밀번호"
              />
            </Form.Item>
            <Form.Item>
              <Input
                required={true}
                name="passwordVerification"
                type="password"
                value={passwordVerification}
                onChange={onInputChange}
                prefix={
                  <Icon type="check" style={{ color: "rgba(0,0,0,.25" }} />
                }
                placeholder="비밀번호 재입력"
              />
            </Form.Item>
            <Form.Item>
              <Input
                required={true}
                name="name"
                value={name}
                onChange={onInputChange}
                prefix={
                  <Icon type="team" style={{ color: "rgba(0,0,0,.25" }} />
                }
                placeholder="그룹 이름"
              />
            </Form.Item>
            <Form.Item>
              <Input
                required={true}
                name="email"
                value={email}
                type="email"
                onChange={onInputChange}
                prefix={
                  <Icon type="mail" style={{ color: "rgba(0,0,0,.25" }} />
                }
                placeholder="이메일"
              />
            </Form.Item>
            <Button type="primary" loading={loading} htmlType="submit">
              확인
            </Button>
          </Form>
        </Information>
      </Body>
    </Content>
  </CenterContainerWithBackground>
)

const Content = styled.div`
  height: 70%;
  width: 30%;
  min-height: 560px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`

const Header = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 20%;
  padding-top: 5%;
`

const Title = styled.div`
  height: 10%;
  width: 100%;
  padding: 5%;
`

const Body = styled.div`
  width: 100%;
  height: 70%;
`

const Information = styled.div`
  width: 100%;
  height: 100%;
  padding: 5%;
`

export default SignUpPresenter
