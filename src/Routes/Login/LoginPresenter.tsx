import { Button, Form, Icon, Input } from "antd"
import React from "react"
import Helmet from "react-helmet"
import { Link } from "react-router-dom"
import styled from "styled-components"
import background from "../../images/background.png"
import logo from "../../images/logo_colored.png"
import { CenterContainerWithBackground } from "../../styledComponents"
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
  <CenterContainerWithBackground>
    <Helmet>
      <title>Shift | 로그인</title>
    </Helmet>
    <ImageContainer />
    <LoginContainer>
      <LogoContainer>
        <Logo alt="logo" src={logo} />
      </LogoContainer>
      <Content>
        <Login>
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
    </LoginContainer>
  </CenterContainerWithBackground>
)

const ImageContainer = styled.div`
  width: 60%;
  height: 100%;
  background-image: url(${background});
  background-size: 100% 100%;
  /* filter: brightness(90%); */
`

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 40%;
  height: 100%;
  background-color: ${theme.colors.grey};
`

const LogoContainer = styled.div`
  width: inherit;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  height: 40%;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50%;
`

const Login = styled.div`
  width: 80%;
  height: 100%;
  padding: 10%;
  padding-top: 0;
`

const Card = styled.div`
  border-radius: 10px;
  background-color: ${theme.colors.white};
  height: 100%;
  min-height: 250px;
  width: 100%;
  padding: 5%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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
