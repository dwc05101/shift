import { Button, Typography } from "antd"
import React from "react"
import styled from "styled-components"
import { GetCurrentTimeTable_GetCurrentTimeTable_timetable_days } from "../../types/api"
import KoreanDays from "../../utils/KoreanDays"
import { StatusBar, StoreTime, TimeBar } from "./TimeBar"

interface IProps {
  day: GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null
  dayIndex: number
}

const parseTimeNextDay = (endTime: string) => {
  const end = time2Int(endTime)
  return 24 + end
}

const time2Int = (time: string) => {
  const t = time.substring(0, 2)
  return parseInt(t, 10)
}

const parseTime = (storeStartTime: number, time: string) => {
  let parsedTime = time2Int(time)
  if (storeStartTime > parsedTime) {
    parsedTime += 24
  }
  return parsedTime
}

const timeFormat = (time: string) => {
  const t = time.substring(0, 2)
  const m = time.substring(2)
  return t + ":" + m
}

class ApplyStatus extends React.Component<IProps> {
  public state = {
    day: this.props.day,
    dayIndex: this.props.dayIndex,
    endTime: this.props.day!.isEndTimeNextDay
      ? parseTimeNextDay(this.props.day!.endTime)
      : time2Int(this.props.day!.endTime),
    selectedSlots: {},
    startTime: time2Int(this.props.day!.startTime)
  }

  public updateSelectedSlots = (result: string[]) => {
    const selectedSlots: {} = {}

    result.map(res => {
      const user: string = res.split("-")[0]
      const timeIndex: string = res.split("-")[1]
      if (!selectedSlots[user]) {
        selectedSlots[user] = [timeIndex]
      } else {
        selectedSlots[user].push(timeIndex)
      }
      return null
    })
    this.setState({ selectedSlots })
  }

  public render() {
    const { startTime, endTime, day, dayIndex } = this.state
    return (
      <View>
        <InfoNButton>
          <Day>
            <Typography.Title level={4}>
              {day!.dayNumber}일 ({KoreanDays[dayIndex]})
            </Typography.Title>
            <Typography.Text>
              영업 시작 : {timeFormat(day!.startTime)}
            </Typography.Text>
            <Typography.Text>
              영업 종료 : {timeFormat(day!.endTime)}
            </Typography.Text>
          </Day>
          <ButtonGroup>
            <Button type="danger" style={{ marginRight: "5px" }}>
              Clear
            </Button>
            <Button type="primary">Save</Button>
          </ButtonGroup>
        </InfoNButton>
        <TimeBars>
          <TimeNotice>
            <Username />
            <StoreTime startTime={startTime} endTime={endTime} />
          </TimeNotice>
          {day!.slots!.map((slot, index) => {
            return (
              <Slot key={index}>
                <Username>
                  <Typography.Text strong={true}>
                    {slot!.user.name}
                  </Typography.Text>
                </Username>
                <TimeBar
                  userCode={slot!.user.personalCode}
                  isFullTime={slot!.isFulltime}
                  storeStartTime={startTime}
                  storeEndTime={endTime}
                  startTime={parseTime(startTime, slot!.startTime)}
                  endTime={parseTime(startTime, slot!.endTime)}
                  updateSelectedSlots={this.updateSelectedSlots}
                />
              </Slot>
            )
          })}
        </TimeBars>
        <Day>
          <TimeNotice style={{ margin: "0" }}>
            <Username />
            <StoreTime startTime={startTime} endTime={endTime} />
          </TimeNotice>
          <TimeNotice style={{ margin: "0" }}>
            <Username style={{ width: "calc(50px + 1em)" }} />
            <StatusBar
              storeStartTime={startTime}
              storeEndTime={endTime}
              selectedSlots={this.state.selectedSlots}
            />
          </TimeNotice>
        </Day>
      </View>
    )
  }
}

const View = styled.div`
  padding: 10px;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`

const TimeNotice = styled.div`
  flex-direction: row;
  align-items: center;
  display: flex;
  margin-bottom: 5px;
  margin-top: 10px;
`

const Slot = styled.div`
  flex-direction: row;
  align-items: center;
  display: flex;
  margin-bottom: 20px;
`

const Day = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoNButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TimeBars = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow: auto;
  border: 1px solid red;
`

const Username = styled.div`
  font-weight: 500;
  text-align: right;
  width: 50px;
`

export default ApplyStatus
