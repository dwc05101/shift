import {
  Button,
  Card,
  Checkbox,
  Result,
  Select,
  Tabs,
  TimePicker,
  Typography
} from "antd"
import moment from "moment"
import React from "react"
import styled from "styled-components"
import Loading from "../../Components/Loading"
import logo from "../../images/logo_colored.png"
import { Container, InnerShadowedBox } from "../../styledComponents"
import { theme } from "../../theme"
import { GetCurrentTimeTable, SlotInfo } from "../../types/api"
import isoToRelative from "../../utils/isoToRelative"
import KoreanDays from "../../utils/KoreanDays"

interface IProps {
  data: GetCurrentTimeTable | undefined
  loading: boolean
  slotTabArray: SlotInfo[][]
  dayNumbers: number[]
  onSubmit: (e: any) => void
  handleSelect: (value: any) => void
  handleFulltime: (e: any) => void
  setSlotStartTime: (
    endTime: string,
    dayIndex: number,
    slotIndex: number
  ) => void
  setSlotEndTime: (endTime: string, dayIndex: number, slotIndex: number) => void
  onClickAddButton: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onClickDeleteButton: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const MakeSlotPresenter: React.SFC<IProps> = ({
  data,
  dayNumbers,
  loading,
  onSubmit,
  slotTabArray,
  handleSelect,
  handleFulltime,
  setSlotStartTime,
  setSlotEndTime,
  onClickAddButton,
  onClickDeleteButton
}) => {
  if (loading) {
    return <Loading />
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
              <SelectContainer>
                <Select
                  placeholder="선택해주세요."
                  onChange={handleSelect}
                  style={{ width: "50%" }}
                >
                  {makeSelectOptions(data!)}
                </Select>
              </SelectContainer>
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

const makeSelectOptions = (data: GetCurrentTimeTable) => {
  const users = data.GetCurrentTimeTable.timetable!.organization!.users!
  return users.map(user => (
    <Select.Option key={user!.personalCode} value={user!.personalCode}>
      {`${user!.name} - ${user!.personalCode}`}
    </Select.Option>
  ))
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
  onClickAddButton: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  onClickDeleteButton: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
) => {
  const sortedDays = data.GetCurrentTimeTable.timetable!.days!.sort(
    (a, b) => a!.dayNumber - b!.dayNumber
  )
  return dayNumbers.map((dayNumber, index) => (
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
        <Typography.Title level={4}>
          {`${dayNumber}일 ${KoreanDays[index]}요일`}
        </Typography.Title>
        <Button
          id={`${index}`}
          type="primary"
          onClick={onClickAddButton}
          style={{ marginLeft: "auto", marginBottom: "auto" }}
        >
          추가
        </Button>
      </TabPaneHeader>
      <TabPaneBody>
        {slotTabArray[index].map((slot, idx) => {
          return (
            <Card
              key={`${slot.dayNumber}/${idx}`}
              title={`${slot.dayNumber}일 ${KoreanDays[index]}요일`}
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
                <Typography.Text strong={true}>시간대 선택</Typography.Text>
                <Checkbox
                  id={`${index}/${idx}`}
                  checked={slot.isFulltime}
                  onChange={handleFulltime}
                >
                  풀타임
                </Checkbox>
                <TimePickerCell>
                  <TimePicker
                    disabled={slot.isFulltime}
                    placeholder={"선택해주세요."}
                    minuteStep={15}
                    defaultOpenValue={moment(
                      sortedDays[index]!.startTime,
                      "HHmm"
                    )}
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
                <TimePickerCell>
                  <TimePicker
                    disabled={slot.isFulltime}
                    placeholder={"선택해주세요."}
                    minuteStep={15}
                    defaultOpenValue={moment(
                      sortedDays[index]!.endTime,
                      "HHmm"
                    )}
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
  ))
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
const SelectContainer = styled.div`
  width: 100%;
  height: 5%;
  display: flex;
  align-items: center;
`
const TabsContainer = styled.div`
  width: 100%;
  height: 68%;
  padding-bottom: 2%;
`

const TabPaneHeader = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
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
