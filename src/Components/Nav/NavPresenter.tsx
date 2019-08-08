import { Button, Icon, Menu } from "antd"
import React from "react"
import Avatar from "react-avatar"
import styled from "styled-components"
import logo from "../../images/logo_horizontal_color.png"
import { GetOrganizationProfile } from "../../types/api"
import Loading from "../Loading"

interface IProps {
  loading: boolean
  profile: GetOrganizationProfile | undefined
  current: string
  handleClick: (e: any) => any
  goToProfile: (e: any) => any
  doLogout: (e: any) => any
  goToHome: (e: any) => any
  isSettings: boolean
  isProfile: boolean
}

const NavPresenter: React.SFC<IProps> = ({
  loading,
  profile,
  current,
  handleClick,
  goToProfile,
  doLogout,
  goToHome,
  isSettings,
  isProfile
}) => {
  return (
    <NavContainer>
      <ImageContainer onClick={goToHome}>
        <Image alt="logo" src={logo} />
      </ImageContainer>
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        theme="light"
        style={{ marginTop: "auto" }}
      >
        <Menu.Item key="dashboard">
          <Icon type="dashboard" />
          대시보드
        </Menu.Item>
        <Menu.Item key="timetable">
          <Icon type="table" />
          시간표
        </Menu.Item>
        <Menu.Item key="users">
          <Icon type="user" />
          구성원
        </Menu.Item>
      </Menu>
      {isSettings ? null : (
        <Toolbar>
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
          <Button type="link" onClick={doLogout}>
            <Icon type="logout" />
            로그아웃
          </Button>
        </Toolbar>
      )}
    </NavContainer>
  )
}

const NavContainer = styled.div`
  height: 6vh;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2%;
  padding-right: 2%;
  min-height: 50px;
`

const ImageContainer = styled.div`
  height: 100%;
  width: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  cursor: pointer;
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
