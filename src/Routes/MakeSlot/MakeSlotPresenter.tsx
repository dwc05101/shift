import {
  Button,
  Card,
  Checkbox,
  Result,
  Select,
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
import { GetCurrentTimeTable } from "../../types/api"
import isoToRelative from "../../utils/isoToRelative"
import KoreanDays from "../../utils/KoreanDays"

interface IProps {
  data: GetCurrentTimeTable | undefined
  selectedDays: boolean[]
  fullTimeDays: boolean[]
  loading: boolean
  onSubmit: (e: any) => void
  handleSelect: (value: any) => void
  handleCheckboxChange: (e: any) => void
  handleFulltime: (e: any) => void
  setSlotStartTime: (endTime: string, index: number) => void
  setSlotEndTime: (endTime: string, index: number) => void
}

const MakeSlotPresenter: React.SFC<IProps> = ({
  data,
  selectedDays,
  fullTimeDays,
  loading,
  onSubmit,
  handleSelect,
  handleCheckboxChange,
  handleFulltime,
  setSlotStartTime,
  setSlotEndTime
}) => {
  if (loading) {
    return <Loading />
  } else {
    try {
      return (
        <Container>
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
              <CheckboxContainer>
                {makeCheckbox(data!, selectedDays, handleCheckboxChange)}
              </CheckboxContainer>
              <TimePickerContainer>
                {makeTimePicker(
                  data!,
                  selectedDays,
                  fullTimeDays,
                  handleFulltime,
                  setSlotStartTime,
                  setSlotEndTime
                )}
              </TimePickerContainer>
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

const makeCheckbox = (
  data: GetCurrentTimeTable,
  selectedDays: boolean[],
  handleCheckboxChange: (e: any) => void
) => {
  const sortedDays = data.GetCurrentTimeTable.timetable!.days!.sort(
    (a, b) => a!.dayNumber - b!.dayNumber
  )
  return sortedDays.map(day => {
    const index = data!.GetCurrentTimeTable.timetable!.days!.indexOf(day)
    return (
      <Checkbox
        id={`${index}`}
        key={day!.dayNumber}
        checked={selectedDays[index]}
        onChange={handleCheckboxChange}
        style={{
          alignItems: "center",
          display: "flex",
          flex: "1 1 0",
          flexDirection: "column"
        }}
      >{`${KoreanDays[index]}`}</Checkbox>
    )
  })
}

const makeSelectOptions = (data: GetCurrentTimeTable) => {
  const users = data.GetCurrentTimeTable.timetable!.organization!.users!
  return users.map(user => (
    <Select.Option key={user!.personalCode} value={user!.personalCode}>
      {`${user!.name} - ${user!.personalCode}`}
    </Select.Option>
  ))
}

const makeTimePicker = (
  data: GetCurrentTimeTable,
  selectedDays: boolean[],
  fullTimeDays: boolean[],
  handleFulltime: (e: any) => void,
  setSlotStartTime: (endTime: string, index: number) => void,
  setSlotEndTime: (endTime: string, index: number) => void
) => {
  const sortedDays = data.GetCurrentTimeTable.timetable!.days!.sort(
    (a, b) => a!.dayNumber - b!.dayNumber
  )
  return selectedDays.map((isChecked, index) => {
    if (isChecked) {
      return (
        <Card
          key={sortedDays[index]!.dayNumber}
          title={`${sortedDays[index]!.dayNumber}일 ${KoreanDays[index]}요일`}
          style={{ width: "100%" }}
        >
          <Wrapper>
            <Typography.Text strong={true}>시간대 선택</Typography.Text>
            <Checkbox
              id={`${index}`}
              checked={fullTimeDays[index]}
              onChange={handleFulltime}
            >
              풀타임
            </Checkbox>
            <TimePickerCell>
              <TimePicker
                disabled={fullTimeDays[index]}
                placeholder={"선택해주세요."}
                minuteStep={15}
                defaultOpenValue={moment(sortedDays[index]!.startTime, "HHmm")}
                onChange={(time, timestring) => {
                  const startTime = time.format("HHmm")
                  setSlotStartTime(startTime, index)
                }}
                format="HH:mm"
              />
              <Typography.Text
                disabled={fullTimeDays[index]}
                style={{ marginLeft: "10px" }}
              >
                부터
              </Typography.Text>
            </TimePickerCell>
            <TimePickerCell>
              <TimePicker
                disabled={fullTimeDays[index]}
                placeholder={"선택해주세요."}
                minuteStep={15}
                defaultOpenValue={moment(sortedDays[index]!.endTime, "HHmm")}
                onChange={(time, timestring) => {
                  const endTime = time.format("HHmm")
                  setSlotEndTime(endTime, index)
                }}
                format="HH:mm"
              />
              <Typography.Text
                disabled={fullTimeDays[index]}
                style={{ marginLeft: "10px" }}
              >
                까지
              </Typography.Text>
            </TimePickerCell>
          </Wrapper>
        </Card>
      )
    } else {
      return null
    }
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
const SelectContainer = styled.div`
  width: 100%;
  height: 5%;
  display: flex;
  align-items: center;
`

const CheckboxContainer = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
`

const TimePickerContainer = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding-top: 5%;
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
