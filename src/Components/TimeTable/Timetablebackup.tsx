import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { Button, Result } from "antd"
import React from "react"
import history from "../../history"
import { FlexContainer } from "../../styledComponents"
import { GetCurrentTimeTable } from "../../types/api"
import Loading from "../Loading"

import "@fullcalendar/core/main.css"
import "@fullcalendar/daygrid/main.css"
import "@fullcalendar/timegrid/main.css"

import moment from "moment"
import "./TimeTablePresenter.css"

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
    <FlexContainer>
      <FullCalendar
        defaultView="timeGridWeek"
        plugins={[timeGridPlugin]}
        height="parent"
        locale="ko"
        slotEventOverlap={false}
        allDayText="풀타임"
        firstDay={1}
        defaultDate={getFirstDay(data!)}
        events={makeData(data!)}
        minTime={getMinTime(data!)}
        maxTime={getMaxTime(data!)}
      />
    </FlexContainer>
  )

const getFirstDay = (data: GetCurrentTimeTable) => {
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

const makeData = (data: GetCurrentTimeTable) => {
  const events: any[] = []
  const assigned: any[] = []
  const sortedDay = sortDay(data)
  const yearMonthWeek = data.GetCurrentTimeTable.timetable!.yearMonthWeek
  const year = yearMonthWeek.substring(0, 4)
  const ISOWeek = yearMonthWeek.substring(4, yearMonthWeek.length)
  const month =
    moment()
      .isoWeek(parseInt(ISOWeek, 10))
      .month() + 1

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

      if (startTime === day.startTime && endTime === day.endTime) {
        events.push({
          allDay: true,
          color,
          start: ISOStartString,
          title: `${slot.user.name}`
        })
      } else {
        events.push({
          color,
          end: ISOEndString,
          start: ISOStartString,
          title: `${slot.user.name}`
        })
      }
    }
  }

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

export default TimeTablePresenter
