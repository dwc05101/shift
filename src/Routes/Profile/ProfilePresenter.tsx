import { Button, Form, Icon, Input, Typography } from "antd"
import React from "react"
import Avatar from "react-avatar"
import styled from "styled-components"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"

interface IProps {
  name: string
  password: string
  passwordVerification: string
  email: string
  loading: boolean
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const ProfilePresenter: React.SFC<IProps> = ({
  name,
  password,
  passwordVerification,
  email,
  loading,
  onInputChange,
  onSubmit
}) => (
  <Container>
    <Content>
      <InnerShadowedBox
        style={{
          minHeight: "600px",
          minWidth: "1100px"
        }}
      >
        <EditAccountContainer>
          <Typography.Title>내 정보</Typography.Title>
          <Preview>
            <AvatarContainer>
              <Avatar name={name} round={true} />
            </AvatarContainer>
            <InfoContainer>
              <Info>
                <Typography.Title level={3}>{name}</Typography.Title>
              </Info>
              <Info>{email}</Info>
            </InfoContainer>
          </Preview>
          <Form onSubmit={onSubmit}>
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
            <Button type="primary" loading={loading} htmlType="submit">
              업데이트
            </Button>
          </Form>
        </EditAccountContainer>
      </InnerShadowedBox>
    </Content>
  </Container>
)

const EditAccountContainer = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 600px;
`

const Preview = styled.div`
  width: 100%;
  height: 30%;
  display: flex;
`

const AvatarContainer = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const InfoContainer = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Info = styled.div`
  width: 100%;
`

export default ProfilePresenter
