import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Icon,
  Select,
  Switch,
  TimePicker,
  Typography
} from "antd"
import moment from "moment"
import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"
import { TimeTableDay } from "../../types/api"
import KoreanDays from "../../utils/KoreanDays"

interface IProps {
  thisWeekTimeTableDays: TimeTableDay[]
  nextWeekTimeTableDays: TimeTableDay[]
  sameTableDay: TimeTableDay
  loading: boolean
  week: string
  checked: boolean
  thisWeekString: string
  nextWeekString: string
  onSubmit: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onChangeWeek: (value: string) => void
  onSwitch: () => void
  changeSameTableDayStartTime: (value: string) => void
  changeSameTableDayEndTime: (value: string) => void
  changeSameTableDayNextDay: (value: boolean) => void
  changeNextWeekTableDaysStartTime: (index: number, value: string) => void
  changeNextWeekTableDaysEndTime: (index: number, value: string) => void
  changeNextWeekTableDaysNextDay: (index: number, value: boolean) => void
  changeThisWeekTableDaysStartTime: (index: number, value: string) => void
  changeThisWeekTableDaysEndTime: (index: number, value: string) => void
  changeThisWeekTableDaysNextDay: (index: number, value: boolean) => void
}

const MakeTimeTablePresenter: React.SFC<IProps> = ({
  thisWeekTimeTableDays,
  nextWeekTimeTableDays,
  sameTableDay,
  loading,
  checked,
  week,
  thisWeekString,
  nextWeekString,
  onSubmit,
  onChangeWeek,
  onSwitch,
  changeSameTableDayStartTime,
  changeSameTableDayEndTime,
  changeSameTableDayNextDay,
  changeNextWeekTableDaysStartTime,
  changeNextWeekTableDaysEndTime,
  changeNextWeekTableDaysNextDay,
  changeThisWeekTableDaysStartTime,
  changeThisWeekTableDaysEndTime,
  changeThisWeekTableDaysNextDay
}) => (
  <Container>
    <Content>
      <InnerShadowedBox style={{ flexDirection: "column" }}>
        <Breadcrumb style={{ height: "5%" }}>
          <Breadcrumb.Item>
            <Link to="/timetable">
              <Icon type="table" /> 시간표
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>시간표 만들기</Breadcrumb.Item>
        </Breadcrumb>
        <Typography.Title level={1}>시간표 만들기</Typography.Title>
        <DateContainer>
          <Select defaultValue={week} onChange={onChangeWeek}>
            <Select.Option value="이번주">이번주</Select.Option>
            <Select.Option value="다음주">다음주</Select.Option>
          </Select>
          <Typography.Text strong={true} style={{ marginLeft: "20px" }}>
            {week === "다음주" ? nextWeekString : thisWeekString}
          </Typography.Text>
        </DateContainer>
        <SwitchContainer>
          <Switch checked={checked} onChange={onSwitch} />
          <Typography.Text strong={true} style={{ marginLeft: "5px" }}>
            시간대 통일
          </Typography.Text>
        </SwitchContainer>
        <CardContainer>
          {!checked ? (
            week === "다음주" ? (
              makeSeparateDay(
                nextWeekTimeTableDays,
                changeNextWeekTableDaysStartTime,
                changeNextWeekTableDaysEndTime,
                changeNextWeekTableDaysNextDay
              )
            ) : (
              makeSeparateDay(
                thisWeekTimeTableDays,
                changeThisWeekTableDaysStartTime,
                changeThisWeekTableDaysEndTime,
                changeThisWeekTableDaysNextDay
              )
            )
          ) : (
            <Card title="시간대 선택">
              <TimePickerContainer>
                <Typography.Text strong={true}>개점 시간</Typography.Text>
                <TimePicker
                  placeholder="시간 선택"
                  format="HH:mm"
                  style={{ marginTop: "5px" }}
                  minuteStep={15}
                  defaultOpenValue={moment("10:00", "HH:mm")}
                  onChange={time => {
                    changeSameTableDayStartTime(time.format("HHmm"))
                  }}
                />
              </TimePickerContainer>
              <TimePickerContainer>
                <TimePickerHeader>
                  <Typography.Text strong={true}>마감 시간</Typography.Text>
                  <Checkbox
                    checked={sameTableDay.isEndTimeNextDay}
                    onChange={e => {
                      changeSameTableDayNextDay(e.target.checked)
                    }}
                    style={{ marginLeft: "auto" }}
                  >
                    익일
                  </Checkbox>
                </TimePickerHeader>
                <TimePicker
                  placeholder="시간 선택"
                  format="HH:mm"
                  style={{ marginTop: "5px" }}
                  minuteStep={15}
                  onChange={time => {
                    changeSameTableDayEndTime(time.format("HHmm"))
                  }}
                  defaultOpenValue={moment("22:00", "HH:mm")}
                />
              </TimePickerContainer>
            </Card>
          )}
        </CardContainer>
        <ButtonContainer>
          <Button type="primary" onClick={onSubmit} loading={loading}>
            만들기
          </Button>
        </ButtonContainer>
      </InnerShadowedBox>
    </Content>
  </Container>
)

const makeSeparateDay = (
  weekTimeTableDays: TimeTableDay[],
  changeStartTime: (index: number, value: string) => void,
  changeEndTime: (index: number, value: string) => void,
  changeNextDay: (index: number, value: boolean) => void
) => {
  return weekTimeTableDays.map(day => {
    const count = weekTimeTableDays.indexOf(day)
    return (
      <Card key={count} title={KoreanDays[count]}>
        <TimePickerContainer>
          <Typography.Text strong={true}>개점 시간</Typography.Text>
          <TimePicker
            placeholder="시간 선택"
            format="HH:mm"
            style={{ marginTop: "5px" }}
            minuteStep={15}
            defaultOpenValue={moment("10:00", "HH:mm")}
            onChange={time => {
              changeStartTime(count, time.format("HHmm"))
            }}
          />
        </TimePickerContainer>
        <TimePickerContainer>
          <TimePickerHeader>
            <Typography.Text strong={true}>마감 시간</Typography.Text>
            <Checkbox
              checked={day.isEndTimeNextDay}
              onChange={e => {
                changeNextDay(count, e.target.checked)
              }}
              style={{ marginLeft: "auto" }}
            >
              익일
            </Checkbox>
          </TimePickerHeader>
          <TimePicker
            placeholder="시간 선택"
            format="HH:mm"
            style={{ marginTop: "5px" }}
            minuteStep={15}
            onChange={time => {
              changeEndTime(count, time.format("HHmm"))
            }}
            defaultOpenValue={moment("22:00", "HH:mm")}
          />
        </TimePickerContainer>
      </Card>
    )
  })
}

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  height: 10%;
`

const SwitchContainer = styled.div`
  width: fit-content;
  height: 5%;
  display: flex;
  align-items: center;
`

const CardContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  align-items: center;
`

const TimePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  width: 100%;
  height: 50%;
`

const TimePickerHeader = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 10%;
`

export default MakeTimeTablePresenter
