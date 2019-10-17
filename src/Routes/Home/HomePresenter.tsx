import { Button, List, message, Typography } from "antd"
import moment from "moment"
import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import styled from "styled-components"
import Loading from "../../Components/Loading"
import TimeTable from "../../Components/TimeTable"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"
import { theme } from "../../theme"
import {
  GetCurrentTimeTable_GetCurrentTimeTable_timetable,
  GetUsers,
  GetUsers_GetUsers_users,
  GetUsers_GetUsers_users_slots
} from "../../types/api"

interface IProps {
  data: GetUsers | undefined
  loading: boolean
  yearMonthWeek: string
  timetable: GetCurrentTimeTable_GetCurrentTimeTable_timetable | null
}

const HomePresenter: React.SFC<IProps> = ({
  data,
  loading,
  timetable,
  yearMonthWeek
}) => (
  <Container>
    <Content>
      <InnerShadowedBox>
        <InfoContainer>
          <MomentContainer>
            <Typography.Title level={1}>{relativeWeekString}</Typography.Title>
            <SubTitleContainer>
              <DarkGreyBold>{isoWeekString}</DarkGreyBold>
              <LinkContainer>
                <Typography.Text strong={true} style={{ marginRight: "10px" }}>
                  링크를 복사해서 공지하세요
                </Typography.Text>
                <CopyToClipboard
                  text={timetable ? timetable.links![0]!.url : ""}
                  onCopy={() => {
                    message.success("클립보드에 복사되었습니다!")
                  }}
                >
                  <Button type="primary">링크 복사</Button>
                </CopyToClipboard>
              </LinkContainer>
            </SubTitleContainer>
          </MomentContainer>
          <TableContainer>
            <TimeTable yearMonthWeek={yearMonthWeek} organizationId={null} />
          </TableContainer>
        </InfoContainer>
        <UserContainer>
          <UserContainerHeader>
            <Wrapper>
              <TitleContainer>
                <Typography.Title level={1}>지원현황</Typography.Title>
              </TitleContainer>
            </Wrapper>
            <DarkGreyBold>
              {userStatus(loading ? undefined : data)}
            </DarkGreyBold>
          </UserContainerHeader>
          {loading ? (
            <Loading />
          ) : (
            <ListContainer>
              <List
                header={
                  <UserBlock>
                    <Name>
                      <b>이름</b>
                    </Name>
                    <PersonalCode>
                      <b>개인번호</b>
                    </PersonalCode>
                    <Count>
                      <b>지원횟수</b>
                    </Count>
                  </UserBlock>
                }
                itemLayout="horizontal"
                dataSource={data === undefined ? [] : data.GetUsers.users!}
                renderItem={user => (
                  <List.Item>{User(user!, yearMonthWeek)}</List.Item>
                )}
              />
            </ListContainer>
          )}
        </UserContainer>
      </InnerShadowedBox>
    </Content>
  </Container>
)

const dayCurrent = moment()
  .toDate()
  .getDate()

const weekOfMonth =
  moment().isoWeek() -
  moment()
    .subtract(dayCurrent - 1, "day")
    .isoWeek() +
  1

const relativeWeekString = `${moment()
  .toDate()
  .getMonth() + 1}월 ${weekOfMonth + 1}주차`

const isoWeekString = `${moment()
  .toDate()
  .getFullYear()}년 ${moment().isoWeek() + 1}주차`

const userStatus = (data: GetUsers | undefined): string => {
  if (data === undefined) {
    return ""
  }
  const totalNumber = data.GetUsers.users!.length
  return `총 구성원: ${totalNumber}명`
}

const User = (user: GetUsers_GetUsers_users, yearMonthWeek: string) => {
  const count = getCount(user.slots, yearMonthWeek)
  const targetColor = count <= 1 ? "red" : "black"
  return (
    <UserBlock style={{ color: targetColor }}>
      <Name>{user.name}</Name>
      <PersonalCode>{user.personalCode}</PersonalCode>
      <Count>{count}</Count>
    </UserBlock>
  )
}

const getCount = (
  slots: Array<GetUsers_GetUsers_users_slots | null> | null,
  yearMonthWeek: string
): number => {
  let count = 0
  if (slots) {
    slots.forEach(slot => {
      if (
        slot!.day.timetable.yearMonthWeek === yearMonthWeek &&
        !slot!.isSelected
      ) {
        count++
      }
    })
  }
  return count
}

const UserBlock = styled.div`
  display: flex;
  width: 100%;
`

const Name = styled.div`
  height: 100%;
  width: 30%;
`

const PersonalCode = styled.div`
  height: 100%;
  width: 30%;
`

const Count = styled.div`
  height: 100%;
  width: 40%;
`

const InfoContainer = styled.div`
  width: 70%;
  min-width: 880px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MomentContainer = styled.div`
  width: 100%;
  height: 15%;
  min-height: 120px;
  display: flex;
  flex-direction: column;
`

const SubTitleContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: center;
  padding-right: 5%;
`

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: fit-content;
  height: fit-content;
  margin-left: auto;
`

const DarkGreyBold = styled.b`
  color: ${theme.colors.dark_grey};
`

const TableContainer = styled.div`
  width: 100%;
  height: 85%;
  padding-right: 5%;
`

const UserContainer = styled.div`
  width: 30%;
  min-width: 400px;
  height: 100%;
`

const UserContainerHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 20%;
  min-height: 120px;
`

const Wrapper = styled.div`
  display: flex;
  width: 100%;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 50%;
`

const ListContainer = styled.div`
  width: 100%;
  height: 80%;
  border: 1px solid ${theme.colors.grey};
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
`

export default HomePresenter
