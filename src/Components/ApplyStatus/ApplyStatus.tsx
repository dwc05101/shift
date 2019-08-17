import { Typography } from "antd"
import React from "react"
import styled from "styled-components"
import { GetCurrentTimeTable_GetCurrentTimeTable_timetable_days } from "../../types/api"
import KoreanDays from "../../utils/KoreanDays"
import { StoreTime, TimeBar } from "./TimeBar"

interface IProps {
  day: GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null
  dayIndex: number
}

const ApplyStatus: React.SFC<IProps> = ({ day, dayIndex }) => {
  const startTime = time2Int(day!.startTime)
  const endTime = day!.isEndTimeNextDay
    ? parseTimeNextDay(day!.endTime)
    : time2Int(day!.endTime)
  return (
    <View>
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
              />
            </Slot>
          )
        })}
      </TimeBars>
      <Day>
        <TimeNotice style={{ margin: "0" }}>
          <StoreTime startTime={startTime} endTime={endTime} />
        </TimeNotice>
        <TimeNotice style={{ margin: "0" }}>
          <Username style={{ width: "calc(50px + 1em)" }} />
          {/* <StatusBar /> */}
        </TimeNotice>
      </Day>
    </View>
  )
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

const View = styled.div`
  padding: 10px;
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

const Bars = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const TimeBars = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid red;
`

const Stack = styled.div`
  height: 100px;
  border: 1px solid blue;
  display: flex;
`

const Username = styled.div`
  font-weight: 500;
  text-align: right;
  width: 50px;
`

export default ApplyStatus
