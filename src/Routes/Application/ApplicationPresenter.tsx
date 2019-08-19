import { Button, Icon, Input } from "antd"
import React from "react"
import styled from "styled-components"
import MakeSlot from "../../Components/MakeSlot"
import logo from "../../images/logo_colored.png"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"

interface IProps {
  isAuthenticated: boolean
  organizationId: number
  personalCode: string
  slots: any[]
  timetableId: number
  loading: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const Application: React.SFC<IProps> = ({
  isAuthenticated,
  organizationId,
  personalCode,
  slots,
  loading,
  timetableId,
  onChange,
  onClick
}) => {
  return isAuthenticated ? (
    <MakeSlot
      organizationId={organizationId}
      personalCode={personalCode}
      slots={slots}
      timetableId={timetableId}
    />
  ) : (
    <Container style={{ height: "100vh" }}>
      <Content>
        <InnerShadowedBox
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <InfoContent>
            <LogoContainer>
              <img src={logo} alt="logo" style={{ width: "50%" }} />
            </LogoContainer>
            <InputContainer>
              <Input
                placeholder="개인번호"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                value={personalCode}
                onChange={onChange}
              />
              <Button
                type="primary"
                loading={loading}
                onClick={onClick}
                style={{ marginTop: "10px" }}
              >
                다음으로
              </Button>
            </InputContainer>
          </InfoContent>
        </InnerShadowedBox>
      </Content>
    </Container>
  )
}

const InfoContent = styled.div`
  width: 50%;
  height: 50%;
  display: flex;
  flex-direction: column;
`

const LogoContainer = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const InputContainer = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export default Application
