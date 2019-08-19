import {
  Button,
  Card,
  Checkbox,
  Result,
  Tabs,
  TimePicker,
  Typography
} from "antd"
import moment from "moment"
import React from "react"
import styled from "styled-components"
import logo from "../../images/logo_colored.png"
import { Container, InnerShadowedBox } from "../../styledComponents"
import { theme } from "../../theme"
import {
  GetCurrentTimeTable,
  GetCurrentTimeTable_GetCurrentTimeTable_timetable_days,
  SlotInfo
} from "../../types/api"
import isoToRelative from "../../utils/isoToRelative"
import KoreanDays from "../../utils/KoreanDays"
import Loading from "../Loading"

interface IProps {
  data: GetCurrentTimeTable | undefined
  loading: boolean
  slotTabArray: SlotInfo[][]
  dayNumbers: number[]
  personalCode: string
  done: boolean
  onSubmit: (e: any) => void
  handleFulltime: (e: any) => void
  setSlotStartTime: (
    endTime: string,
    dayIndex: number,
    slotIndex: number
  ) => void
  setSlotEndTime: (endTime: string, dayIndex: number, slotIndex: number) => void
  setSlotIsEndTimeNextDay: (e: any) => void
  setSlotIsStartTimeNextDay: (e: any) => void
  onClickAddButton: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onClickDeleteButton: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const MakeSlotPresenter: React.SFC<IProps> = ({
  data,
  dayNumbers,
  loading,
  onSubmit,
  personalCode,
  done,
  slotTabArray,
  handleFulltime,
  setSlotStartTime,
  setSlotEndTime,
  setSlotIsEndTimeNextDay,
  setSlotIsStartTimeNextDay,
  onClickAddButton,
  onClickDeleteButton
}) => {
  if (loading) {
    return <Loading />
  } else if (done) {
    return (
      <Container style={{ height: "100vh" }}>
        <Content>
          <InnerShadowedBox style={{ flexDirection: "column" }}>
            <LogoContainer>
              <Logo alt="logo" src={logo} />
            </LogoContainer>
            <Result status="success" title="성공적으로 제출했습니다." />
          </InnerShadowedBox>
        </Content>
      </Container>
    )
  } else {
    try {
      return (
        <Container style={{ height: "100vh" }}>
          <Content>
            <InnerShadowedBox style={{ flexDirection: "column" }}>
              <LogoContainer>
                <Logo alt="logo" src={logo} />
              </LogoContainer>
              <TitleContainer>
                <Typography.Title level={4}>
                  {data!.GetCurrentTimeTable.timetable!.organization.name}
                </Typography.Title>
                <Typography.Text strong={true}>
                  {isoToRelative(
                    data!.GetCurrentTimeTable.timetable!.yearMonthWeek
                  )}
                </Typography.Text>
              </TitleContainer>
              <UserContainer>
                <Typography.Text strong={true}>
                  {makeUserString(personalCode, data!)}
                </Typography.Text>
              </UserContainer>
              <TabsContainer>
                <Tabs
                  defaultActiveKey={`${dayNumbers[0]}`}
                  style={{
                    height: "100%",
                    overflow: "auto"
                  }}
                >
                  {makeTabPanes(
                    data!,
                    dayNumbers,
                    slotTabArray,
                    handleFulltime,
                    setSlotStartTime,
                    setSlotEndTime,
                    setSlotIsEndTimeNextDay,
                    setSlotIsStartTimeNextDay,
                    onClickAddButton,
                    onClickDeleteButton
                  )}
                </Tabs>
              </TabsContainer>
              <SubmitButtonContainer>
                <Button type="primary" onClick={onSubmit} loading={loading}>
                  제출
                </Button>
              </SubmitButtonContainer>
            </InnerShadowedBox>
          </Content>
        </Container>
      )
    } catch (err) {
      return (
        <Container>
          <LogoContainer>
            <Logo alt="logo" src={logo} />
          </LogoContainer>
          <Result
            status="404"
            title="404"
            subTitle="유효하지 않은 링크입니다."
          />
        </Container>
      )
    }
  }
}

const makeUserString = (personalCode: string, data: GetCurrentTimeTable) => {
  const targetUser = data.GetCurrentTimeTable.timetable!.organization.users!.find(
    user => user!.personalCode === personalCode
  )
  if (targetUser) {
    return `${targetUser.name} - ${targetUser.personalCode}`
  } else {
    return ``
  }
}

const makeTabPanes = (
  data: GetCurrentTimeTable,
  dayNumbers: number[],
  slotTabArray: SlotInfo[][],
  handleFulltime: (e: any) => void,
  setSlotStartTime: (
    endTime: string,
    dayIndex: number,
    slotIndex: number
  ) => void,
  setSlotEndTime: (
    endTime: string,
    dayIndex: number,
    slotIndex: number
  ) => void,
  setSlotIsEndTimeNextDay: (e: any) => void,
  setSlotIsStartTimeNextDay: (e: any) => void,
  onClickAddButton: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onClickDeleteButton: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
) => {
  const sortedDays: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null> = []
  dayNumbers.forEach(dayNumber => {
    const index = data.GetCurrentTimeTable.timetable!.days!.findIndex(
      day => day!.dayNumber === dayNumber
    )
    if (index > -1) {
      sortedDays.push(data.GetCurrentTimeTable.timetable!.days![index])
    }
  })

  return dayNumbers.map((dayNumber, index) => {
    const dayStartTimeString = data!.GetCurrentTimeTable.timetable!.days!.find(
      day => day!.dayNumber === dayNumber
    )!.startTime

    const dayEndTimeString = data!.GetCurrentTimeTable.timetable!.days!.find(
      day => day!.dayNumber === dayNumber
    )!.endTime

    const dayStartTime = parseInt(dayStartTimeString, 10)
    const dayEndTime = parseInt(dayEndTimeString, 10)

    const isEndTimeNextDay: boolean = data!.GetCurrentTimeTable.timetable!.days!.find(
      day => day!.dayNumber === dayNumber
    )!.isEndTimeNextDay

    const disabledHours = () => {
      const hours: number[] = []
      for (let i = 0; i < Math.floor(dayStartTime / 100); i++) {
        hours.push(i)
      }
      if (!isEndTimeNextDay) {
        for (let j = Math.floor(dayEndTime / 100) + 1; j < 24; j++) {
          hours.push(j)
        }
      }

      return hours
    }

    const nextDayDisabledHours = () => {
      const hours: number[] = []
      for (let j = Math.floor(dayEndTime / 100) + 1; j < 24; j++) {
        hours.push(j)
      }
      return hours
    }

    const disabledMinutes = hour => {
      const minutes: number[] = []
      if (hour === Math.floor(dayStartTime / 100)) {
        if (dayStartTime % 100 !== 0) {
          for (let i = 0; i < dayStartTime % 100; i += 15) {
            minutes.push(i)
          }
        }
      }
      if (!isEndTimeNextDay) {
        if (hour === Math.floor(dayEndTime / 100)) {
          if (dayEndTime % 100 === 0) {
            for (let i = 15; i < 60; i += 15) {
              minutes.push(i)
            }
          } else {
            for (let i = 60; i > dayEndTime % 100; i -= 15) {
              minutes.push(i)
            }
          }
        }
      }
      return minutes
    }

    const nextDayDisabledMinutes = hour => {
      const minutes: number[] = []
      if (hour === Math.ceil(dayEndTime / 100)) {
        if (dayEndTime % 100 === 0) {
          for (let i = 15; i < 60; i += 15) {
            minutes.push(i)
          }
        } else {
          for (let i = 0; i <= dayEndTime % 100; i += 15) {
            minutes.push(i)
          }
        }
      }
      return minutes
    }

    return (
      <Tabs.TabPane
        tab={KoreanDays[index]}
        key={`${dayNumber}`}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "auto",
          padding: "0 10px"
        }}
      >
        <TabPaneHeader>
          <TabPaneTitle>
            <Typography.Title level={4} style={{ alignSelf: "center" }}>
              {`${dayNumber}일 (${KoreanDays[index]})`}
            </Typography.Title>
            <Typography.Text style={{ alignSelf: "center" }}>
              {`운영시간: ${moment(dayStartTimeString, "HHmm").format(
                "HH:mm"
              )} ~ ${isEndTimeNextDay ? "익일" : ""} ${moment(
                dayEndTimeString,
                "HHmm"
              ).format("HH:mm")}`}
            </Typography.Text>
          </TabPaneTitle>
          <TabPaneButton>
            <Button id={`${index}`} type="primary" onClick={onClickAddButton}>
              추가
            </Button>
          </TabPaneButton>
        </TabPaneHeader>
        <TabPaneBody>
          {slotTabArray[index].map((slot, idx) => {
            return (
              <Card
                key={`${slot.dayNumber}/${idx}`}
                title={
                  <Checkbox
                    id={`${index}/${idx}`}
                    checked={slot.isFulltime}
                    onChange={handleFulltime}
                  >
                    풀타임
                  </Checkbox>
                }
                style={{ width: "100%" }}
                extra={
                  <Button
                    id={`${index}/${idx}`}
                    type="danger"
                    onClick={onClickDeleteButton}
                  >
                    삭제
                  </Button>
                }
              >
                <Wrapper>
                  <Checkbox
                    id={`${index}/${idx}`}
                    checked={slot.isStartTimeNextDay}
                    disabled={!isEndTimeNextDay}
                    onChange={setSlotIsStartTimeNextDay}
                  >
                    익일
                  </Checkbox>
                  <TimePickerCell>
                    <TimePicker
                      disabled={slot.isFulltime}
                      placeholder={"선택해주세요."}
                      minuteStep={15}
                      disabledHours={
                        slot.isStartTimeNextDay
                          ? nextDayDisabledHours
                          : disabledHours
                      }
                      disabledMinutes={
                        slot.isStartTimeNextDay
                          ? nextDayDisabledMinutes
                          : disabledMinutes
                      }
                      hideDisabledOptions={true}
                      value={
                        slot.startTime === ""
                          ? undefined
                          : moment(slot.startTime, "HHmm")
                      }
                      defaultOpenValue={
                        slot.isStartTimeNextDay
                          ? moment("0000", "HHmm")
                          : moment(sortedDays[index]!.startTime, "HHmm")
                      }
                      onChange={(time, timestring) => {
                        const startTime = time.format("HHmm")
                        setSlotStartTime(startTime, index, idx)
                      }}
                      format="HH:mm"
                    />
                    <Typography.Text
                      disabled={slot.isFulltime}
                      style={{ marginLeft: "10px" }}
                    >
                      부터
                    </Typography.Text>
                  </TimePickerCell>
                  <Checkbox
                    id={`${index}/${idx}`}
                    checked={slot.isEndTimeNextDay}
                    disabled={!isEndTimeNextDay}
                    onChange={setSlotIsEndTimeNextDay}
                    style={{ marginTop: "10px" }}
                  >
                    익일
                  </Checkbox>
                  <TimePickerCell>
                    <TimePicker
                      disabled={slot.isFulltime}
                      disabledHours={
                        slot.isEndTimeNextDay
                          ? nextDayDisabledHours
                          : disabledHours
                      }
                      disabledMinutes={
                        slot.isEndTimeNextDay
                          ? nextDayDisabledMinutes
                          : disabledMinutes
                      }
                      hideDisabledOptions={true}
                      placeholder={"선택해주세요."}
                      value={
                        slot.endTime === ""
                          ? undefined
                          : moment(slot.endTime, "HHmm")
                      }
                      minuteStep={15}
                      defaultOpenValue={
                        slot.isEndTimeNextDay
                          ? moment(sortedDays[index]!.endTime, "HHmm")
                          : isEndTimeNextDay
                          ? moment("2345", "HHmm")
                          : moment(sortedDays[index]!.endTime, "HHmm")
                      }
                      onChange={(time, timestring) => {
                        const endTime = time.format("HHmm")
                        setSlotEndTime(endTime, index, idx)
                      }}
                      format="HH:mm"
                    />
                    <Typography.Text
                      disabled={slot.isFulltime}
                      style={{ marginLeft: "10px" }}
                    >
                      까지
                    </Typography.Text>
                  </TimePickerCell>
                </Wrapper>
              </Card>
            )
          })}
        </TabPaneBody>
      </Tabs.TabPane>
    )
  })
}

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 2%;
  background: ${theme.colors.grey};
`

const LogoContainer = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  height: 100%;
`

const TitleContainer = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const UserContainer = styled.div`
  width: 100%;
  height: 3%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const TabsContainer = styled.div`
  width: 100%;
  height: 70%;
  padding-bottom: 2%;
`

const TabPaneHeader = styled.div`
  width: 100%;
  height: 8%;
  margin-bottom: 2%;
  display: flex;
`

const TabPaneTitle = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const TabPaneButton = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
`

const TabPaneBody = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
`

const Wrapper = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
`

const TimePickerCell = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  align-items: center;
  margin-top: 10px;
`

const SubmitButtonContainer = styled.div`
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default MakeSlotPresenter
