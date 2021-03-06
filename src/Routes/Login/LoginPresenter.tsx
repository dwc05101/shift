import { Button, Form, Icon, Input } from "antd"
import React from "react"
import Helmet from "react-helmet"
import { Link } from "react-router-dom"
import styled from "styled-components"
import background from "../../images/background.png"
import logo from "../../images/logo_horizontal_reversed.png"
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
}

const LoginPresenter: React.SFC<IProps> = ({
  organizationId,
  password,
  loading,
  onInputChange,
  onSubmit
}) => (
  <CenterContainerWithBackground>
    <Helmet>
      <title>Shift | 로그인</title>
    </Helmet>
    <ImageContainer>
      <LoginContainer>
        <Content>
          <Typography>
            <b>빠르다.</b> 시간표 제작
            <br />
            <b>가볍다.</b> 모바일 지원
            <br />
            <b>바꾸다.</b> <HeaderImage src={logo} />
          </Typography>
        </Content>
        <Login>
          <LoginHeader>환영합니다.</LoginHeader>
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
                addonAfter={<Link to={"/"}>잊어버렸어요</Link>}
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
            <SignUp>
              처음 이용하시나요?
              <Link to={"/sign-up"} style={{ marginLeft: "10px" }}>
                회원가입
              </Link>
            </SignUp>
          </Form>
        </Login>
      </LoginContainer>
    </ImageContainer>
  </CenterContainerWithBackground>
)

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${background});
  background-size: 100% 100%;
  /* filter: brightness(90%); */
`

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 70%;
  border: 5px solid ${theme.colors.grey};
  background-color: white;
  min-width: 880px;
  max-width: 1080px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 50%;
`

const HeaderImage = styled.img`
  height: 60px;
  margin-bottom: 10px;
  margin-left: -10px;
`

const Typography = styled.div`
  width: fit-content;
  height: fit-content;
  font-family: "Nanum Gothic", sans-serif;
  color: black;
  font-size: 3em;
`

const Login = styled.div`
  width: 50%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const LoginHeader = styled.div`
  font-family: "Nanum Gothic", sans-serif;
  padding: 10px;
  font-size: 1.5em;
`

const SignUp = styled.div`
  height: fit-content;
  margin-top: 20px;
  display: flex;
  justify-content: center;
`

export default LoginPresenter
