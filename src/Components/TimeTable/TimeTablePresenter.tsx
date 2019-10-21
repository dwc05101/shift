import { Button, Col, Result, Row } from "antd"
import moment from "moment"
import React from "react"
import history from "../../history"
import { FlexContainer } from "../../styledComponents"
import { GetCurrentTimeTable } from "../../types/api"
import Loading from "../Loading"
import "./TimeTablePresenter.css"

import styled from "styled-components"
import { theme } from "../../theme"
import colors from "../../utils/colors.json"

interface IProps {
  data: GetCurrentTimeTable | undefined
  loading: boolean
}

const TimeTablePresenter: React.SFC<IProps> = ({ data, loading }) =>
  loading ? (
    <Loading />
  ) : !data!.GetCurrentTimeTable.ok ? (
    <Result
      status="404"
      title="금주 시간표가 없습니다."
      extra={
        <Button
          type="primary"
          onClick={() => {
            history.push("/timetable/make")
          }}
        >
          시간표 만들기
        </Button>
      }
    />
  ) : (
    <FlexContainer className="column-flex">
      <Row className="flex-header-row">
        <Col className="flex-col" span={3}>
          <TableCell />
        </Col>
        {makeHeader(data!)}
      </Row>
      <Row className="flex-row">
        <Col className="flex-col" span={3}>
          <TableCell>오전</TableCell>
        </Col>
        {makeTable(data!)}
      </Row>
      <Row className="flex-row">
        <Col className="flex-col" span={3}>
          <TableCell>오후</TableCell>
        </Col>
        {makeTable(data!)}
      </Row>
      <Row className="flex-row">
        <Col className="flex-col" span={3}>
          <TableCell>마감</TableCell>
        </Col>
        {makeTable(data!)}
      </Row>
    </FlexContainer>
  )

const makeHeader = (data: GetCurrentTimeTable) => {
  const days = sortDay(data)

  return days.map(day => {
    return (
      <Col className="flex-col" span={3} key={day!.id}>
        <TableCell>{`${day.dayNumber}일`}</TableCell>
      </Col>
    )
  })
}

const makeTable = (data: GetCurrentTimeTable) => {
  const days = sortDay(data)

  return days.map(day => {
    const count = Math.floor(Math.random() * 5)

    if (count <= 1) {
      return (
        <Col
          className="flex-col"
          span={3}
          key={day!.id}
          style={{ padding: "2px" }}
        >
          <RedCard>{count}</RedCard>
        </Col>
      )
    } else if (count <= 3) {
      return (
        <Col
          className="flex-col"
          span={3}
          key={day!.id}
          style={{ padding: "2px" }}
        >
          <YellowCard>{count}</YellowCard>
        </Col>
      )
    } else {
      return (
        <Col
          className="flex-col"
          span={3}
          key={day!.id}
          style={{ padding: "2px" }}
        >
          <BlueCard>{count}</BlueCard>
        </Col>
      )
    }
  })
}

const getFirstDay = () => {
  const nextWeekStart = moment()
    .add(1, "week")
    .startOf("isoWeek")

  const defaultDate = makeDateString(
    nextWeekStart.year(),
    nextWeekStart.month() + 1,
    nextWeekStart.date()
  )

  return defaultDate
}

const makeDateString = (year: number, month: number, day: number) => {
  return `${year}-${month}-${day}`
}

const makeResources = (data: GetCurrentTimeTable) => {
  const resource: any[] = []
  const sortedDay = sortDay(data)
  const yearMonthWeek = data.GetCurrentTimeTable.timetable!.yearMonthWeek
  const year = yearMonthWeek.substring(0, 4)
  const ISOWeek = yearMonthWeek.substring(4, yearMonthWeek.length)
  const month =
    moment()
      .isoWeek(parseInt(ISOWeek, 10))
      .month() + 1

  console.log(sortedDay)

  for (const day of sortedDay) {
    for (const slot of day.slots) {
      if (slot.isSelected) {
        continue
      }
      const dateString = makeDateString(
        parseInt(year, 10),
        month,
        day.dayNumber
      )
      resource.push({
        date: dateString,
        id: slot.id,
        slot: `${slot.user.name}(${slot.user.personalCode})`
      })
    }
  }

  return resource
}

const makeData = (data: GetCurrentTimeTable) => {
  const events: any[] = []
  const assigned: any[] = []
  const sortedDay = sortDay(data)
  const yearMonthWeek = data.GetCurrentTimeTable.timetable!.yearMonthWeek

  for (const day of sortedDay) {
    for (const slot of day.slots) {
      if (slot.isSelected) {
        continue
      }
      const dateString = getFirstDay()
      const startTime = slot.isFulltime ? day.startTime : slot.startTime
      const formattedStartTime =
        startTime.substring(0, 2) +
        ":" +
        startTime.substring(2, startTime.length)
      const endTime = slot.isFulltime ? day.endTime : slot.endTime
      const formattedEndTime =
        endTime.substring(0, 2) + ":" + endTime.substring(2, endTime.length)

      const ISOStartString = dateString + "T" + formattedStartTime + ":00"
      const ISOEndString = dateString + "T" + formattedEndTime + ":00"

      let color

      const colorIndex = assigned.findIndex(
        assign => assign.personalCode === slot.user.personalCode
      )

      if (colorIndex > -1) {
        color = assigned[colorIndex].color
      } else {
        color = colors.values[Math.floor(Math.random() * colors.values.length)]
        assigned.push({
          color,
          personalCode: slot.user.personalCode
        })
      }

      events.push({
        color,
        end: ISOEndString,
        resourceId: slot.id,
        start: ISOStartString
      })
    }
  }

  console.log(events)

  return events
}

const getMinTime = (data: GetCurrentTimeTable): string => {
  const days = data.GetCurrentTimeTable.timetable!.days!

  let minTime = days[0]!.startTime

  for (const day of days) {
    if (parseInt(day!.startTime, 10) < parseInt(minTime, 10)) {
      minTime = day!.startTime
    }
  }

  const formattedMinTime =
    minTime.substring(0, 2) + ":" + minTime.substring(2, minTime.length) + ":00"

  return formattedMinTime
}

const getMaxTime = (data: GetCurrentTimeTable): string => {
  const days = data.GetCurrentTimeTable.timetable!.days!

  let maxTime = days[0]!.isEndTimeNextDay
    ? addOneDay(days[0]!.endTime)
    : days[0]!.endTime

  for (const day of days) {
    const endTime = day!.isEndTimeNextDay
      ? addOneDay(day!.endTime)
      : day!.endTime
    if (parseInt(endTime, 10) > parseInt(maxTime, 10)) {
      maxTime = endTime
    }
  }

  const formattedMaxTime =
    maxTime.substring(0, 2) + ":" + maxTime.substring(2, maxTime.length) + ":00"

  return formattedMaxTime
}

const addOneDay = (time: string): string => {
  const addedTime = parseInt(time, 10) + 2400
  return addedTime.toString()
}

const sortDay = (data: GetCurrentTimeTable) => {
  const days = data.GetCurrentTimeTable.timetable!.days!
  const sortedDays: any[] = []
  let dayNumbers: number[] = []

  days.forEach(day => dayNumbers.push(day!.dayNumber))

  const maxDayNumber = Math.max.apply(null, dayNumbers)
  const minDayNumber = Math.min.apply(null, dayNumbers)
  const isContainNextMonth: boolean = maxDayNumber - minDayNumber >= 7
  if (isContainNextMonth) {
    const sortedDayNumbers: number[] = []
    const previousMonthDayNumbers = dayNumbers
      .filter(dayNumber => Math.abs(maxDayNumber - dayNumber) <= 6)
      .sort((a, b) => a - b)
    const nextMonthDayNumbers = dayNumbers
      .filter(dayNumber => Math.abs(dayNumber - minDayNumber) <= 6)
      .sort((a, b) => a - b)
    previousMonthDayNumbers.forEach(dayNumber =>
      sortedDayNumbers.push(dayNumber)
    )
    nextMonthDayNumbers.forEach(dayNumber => sortedDayNumbers.push(dayNumber))
    dayNumbers = sortedDayNumbers
  } else {
    dayNumbers.sort((a, b) => a - b)
  }

  dayNumbers.forEach(dayNumber => {
    const targetDay = days.find(day => day!.dayNumber === dayNumber)
    sortedDays.push(targetDay)
  })

  return sortedDays
}

const TableCell = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  border: 2px solid ${theme.colors.grey};
  border-collapse: collapse;
`

const BlueCard = styled.div`
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: ${theme.colors.blue};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  :hover {
    background-color: white;
    color: black;
    transition: 0.2s ease-in;
  }
`

const YellowCard = styled.div`
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffb347;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  :hover {
    background-color: white;
    color: black;
    transition: 0.2s ease-in;
  }
`

const RedCard = styled.div`
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: ${theme.colors.red};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  :hover {
    background-color: white;
    color: black;
    transition: 0.2s ease-in;
  }
`

export default TimeTablePresenter
