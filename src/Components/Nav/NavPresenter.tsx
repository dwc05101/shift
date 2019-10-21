import { Button, Icon, Menu } from "antd"
import React from "react"
import Avatar from "react-avatar"
import styled from "styled-components"
import logo from "../../images/logo_horizontal_color.png"
import { GetOrganizationProfile } from "../../types/api"
import Loading from "../Loading"

interface IProps {
  isMain: boolean
  loading: boolean
  profile: GetOrganizationProfile | undefined
  current: string
  mainCurrent: string
  handleClick: (e: any) => any
  goToProfile: (e: any) => any
  doLogout: (e: any) => any
  goToHome: (e: any) => any
  goToLogin: (e: any) => any
  isProfile: boolean
  mainHandler: (event: any) => void
}

const NavPresenter: React.SFC<IProps> = ({
  isMain,
  loading,
  profile,
  current,
  mainCurrent,
  handleClick,
  goToProfile,
  doLogout,
  goToHome,
  goToLogin,
  isProfile,
  mainHandler
}) => {
  return (
    <NavContainer>
      <ImageContainer onClick={goToHome}>
        <Image alt="logo" src={logo} />
      </ImageContainer>
      {!isMain ? (
        <Menu
          onClick={handleClick}
          selectedKeys={[current]}
          mode="horizontal"
          theme="light"
          style={{ marginTop: "auto" }}
        >
          <Menu.Item key="dashboard" style={{ height: "64px" }}>
            <div style={{ marginTop: "8px" }}>
              <Icon type="dashboard" />
              대시보드
            </div>
          </Menu.Item>
          <Menu.Item key="timetable" style={{ height: "64px" }}>
            <div style={{ marginTop: "8px" }}>
              <Icon type="table" />
              시간표
            </div>
          </Menu.Item>
          <Menu.Item key="users" style={{ height: "64px" }}>
            <div style={{ marginTop: "8px" }}>
              <Icon type="user" />
              구성원
            </div>
          </Menu.Item>
        </Menu>
      ) : (
        <Menu
          onClick={param => {
            const key = param.key
            if (key === "home") {
              mainHandler(0)
            } else {
              mainHandler(1)
            }
          }}
          selectedKeys={[mainCurrent]}
          mode="horizontal"
          theme="light"
          style={{ marginTop: "auto" }}
        >
          <Menu.Item key="home" style={{ height: "64px" }}>
            <div style={{ marginTop: "8px" }}>
              <Icon type="home" />홈
            </div>
          </Menu.Item>
          <Menu.Item key="features" style={{ height: "64px" }}>
            <div style={{ marginTop: "8px" }}>
              <Icon type="info-circle" />
              구성
            </div>
          </Menu.Item>
        </Menu>
      )}
      <Toolbar>
        {!isMain ? (
          <Profile onClick={isProfile ? undefined : goToProfile}>
            <b>
              {loading ? (
                <Loading />
              ) : (
                <>
                  <Avatar
                    name={
                      profile === undefined
                        ? ""
                        : profile.GetOrganizationProfile.organization!.name
                    }
                    round={true}
                    size={"30px"}
                    style={{ marginRight: "10px" }}
                  />
                  {profile === undefined
                    ? "서버 연결 오류"
                    : profile.GetOrganizationProfile.organization!.name}
                </>
              )}
            </b>
          </Profile>
        ) : null}
        {!isMain ? (
          <Button type="link" onClick={doLogout}>
            <Icon type="logout" />
            로그아웃
          </Button>
        ) : (
          <Button type="link" onClick={goToLogin}>
            <Icon type="login" />
            시작하기
          </Button>
        )}
      </Toolbar>
    </NavContainer>
  )
}

const NavContainer = styled.div`
  height: 64px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2%;
  padding-right: 2%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1030;
  background-color: white;
`

const ImageContainer = styled.div`
  height: 100%;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  cursor: pointer;
  margin-right: 10px;
`

const Image = styled.img`
  width: 100%;
  min-width: 100px;
`

const Profile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 100%;
  width: fit-content;
  padding: 20px;
`

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: auto;
  height: 100%;
  width: fit-content;
`

export default NavPresenter
