import React from "react"
import styled from "styled-components"
import { TimeBar, StoreTime } from "./TimeBar"

interface IProps {
  day: {
    dayNumber: number
    startTime: string
    endTime: string
    isEndTimeNextDay: boolean
    slots: {
      isFullTime: boolean
      startTime: string
      endTime: string
      user: {
        name: string
        personalCode: string
      }
    }[]
    timeTableId: number
  }
}

const ApplyStatusPresenter: React.SFC<IProps> = ({ day }) => {
  const startTime = time2Int(day.startTime)
  let endTime = day.isEndTimeNextDay
    ? parseTimeNextDay(day.endTime)
    : time2Int(day.endTime)
  return (
    <View>
      <Day>{day.dayNumber}일 (월)</Day>
      <Time>영업 시작 : {timeFormat(day.startTime)}</Time>
      <Time>영업 종료 : {timeFormat(day.endTime)}</Time>
      <TimeNotice>
        <Username />
        <StoreTime startTime={startTime} endTime={endTime} />
      </TimeNotice>
      {day.slots.map((slot, index) => (
        <Slot key={index}>
          <Username>{slot.user.name}</Username>
          <TimeBar
            userCode={slot.user.personalCode}
            isFullTime={slot.isFullTime}
            storeStartTime={startTime}
            storeEndTime={endTime}
            startTime={parseTime(startTime, slot.startTime)}
            endTime={parseTime(startTime, slot.endTime)}
          />
        </Slot>
      ))}
    </View>
  )
}

const parseTimeNextDay = endTime => {
  const end = time2Int(endTime)
  return 24 + end
}

const time2Int = time => {
  const t = time.substring(0, 2)
  return parseInt(t)
}

const parseTime = (storeStartTime, time) => {
  let parsedTime = time2Int(time)
  if (storeStartTime > parsedTime) {
    parsedTime += 24
  }
  return parsedTime
}

const timeFormat = time => {
  const t = time.substring(0, 2)
  const m = time.substring(2)
  return t + ":" + m
}

const View = styled.div`
  flex-direction: column;
`
const TimeNotice = styled.div`
  flex-direction: row;
  align-items: center;
  display: flex;
  margin-bottom: 5px;
  margin-top: 20px;
`
const Slot = styled.div`
  flex-direction: row;
  align-items: center;
  display: flex;
  margin-bottom: 20px;
`
const Day = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: #3f51b5;
`
const Username = styled.div`
  font-weight: 500;
  text-align: right;
  width: 50px;
`
const Time = styled.div``

export default ApplyStatusPresenter
