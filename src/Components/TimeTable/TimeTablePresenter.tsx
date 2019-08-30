import { Button, message, Result, Typography } from "antd"
import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import styled from "styled-components"
import history from "../../history"
import { FlexContainer } from "../../styledComponents"
import { theme } from "../../theme"
import {
  GetCurrentTimeTable,
  GetCurrentTimeTable_GetCurrentTimeTable_timetable_days
} from "../../types/api"
import KoreanDays from "../../utils/KoreanDays"
import Loading from "../Loading"
// import { array } from "prop-types"
// import { theme } from "../../theme"

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
    <>
      <LinkContainer>
        <Typography.Text strong={true} style={{ marginRight: "10px" }}>
          링크를 복사해서 공지하세요
        </Typography.Text>
        <CopyToClipboard
          text={data!.GetCurrentTimeTable.timetable!.links![0]!.url}
          onCopy={() => {
            message.success("클립보드에 복사되었습니다!")
          }}
        >
          <Button type="primary">링크 복사</Button>
        </CopyToClipboard>
      </LinkContainer>
      <FlexContainer
        style={{
          flexDirection: "column",
          minWidth: "880px",
          overflow: "auto"
        }}
      >
        <TableHeader>
          <IndexBlock />
          {makeHeaderRow(data!)}
        </TableHeader>
        <TableBody>{makeTableColumn(data!)}</TableBody>
      </FlexContainer>
    </>
  )

const makeTableColumn = (data: GetCurrentTimeTable | null) => {
  if (data) {
    if (data.GetCurrentTimeTable.timetable) {
      let dayNumbers: number[] = []
      data!.GetCurrentTimeTable.timetable!.days!.map(day => {
        dayNumbers.push(day!.dayNumber)
        return null
      })

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
        nextMonthDayNumbers.forEach(dayNumber =>
          sortedDayNumbers.push(dayNumber)
        )
        dayNumbers = sortedDayNumbers
      } else {
        dayNumbers.sort((a, b) => a - b)
      }

      const sortedDays: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null> = []
      dayNumbers.forEach(dayNumber => {
        const index = data.GetCurrentTimeTable.timetable!.days!.findIndex(
          day => day!.dayNumber === dayNumber
        )
        if (index > -1) {
          sortedDays.push(data.GetCurrentTimeTable.timetable!.days![index])
        }
      })

      return sortedDays.map(day => (
        <TableRow key={day!.dayNumber}>
          <IndexBlock>
            <Typography.Title level={4} style={{ marginBottom: "0" }}>
              {day!.dayNumber} ({KoreanDays[sortedDays.indexOf(day)]})
            </Typography.Title>
          </IndexBlock>
          {makeTableCell(data!, day!.dayNumber)}
        </TableRow>
      ))
    }
  }
}

const getTime = (data: GetCurrentTimeTable | null) => {
  const timeTable = data!.GetCurrentTimeTable.timetable
  const startTime =
    Math.min.apply(
      null,
      timeTable!.days!.map(day => parseInt(day!.startTime, 10))
    ) / 100
  const endTime =
    Math.max.apply(
      null,
      timeTable!.days!.map(day =>
        day!.isEndTimeNextDay
          ? parseInt(day!.endTime, 10) + 2400
          : parseInt(day!.endTime, 10)
      )
    ) / 100
  return [startTime, endTime]
}

const makeTableCell = (data: GetCurrentTimeTable | null, dayNumber: number) => {
  if (data) {
    if (data.GetCurrentTimeTable.timetable) {
      const sortedTimeTable = data.GetCurrentTimeTable.timetable.days!.sort(
        (a, b) => {
          return a!.dayNumber - b!.dayNumber
        }
      )
      const [startTime, endTime] = getTime(data)

      const indexArray = Array.from(Array(endTime - startTime + 1).keys())
      const possibleTime = indexArray.map(index => startTime + index)
      const dayElement = sortedTimeTable.filter(
        day => day!.dayNumber === dayNumber
      )
      if (dayElement[0]!.slots) {
        const rowElement = possibleTime.map(hourTime => {
          return dayElement[0]!.slots!.filter(
            slot =>
              (parseInt(slot!.startTime, 10) / 100 <= hourTime &&
                hourTime <= parseInt(slot!.endTime, 10) / 100) ||
              slot!.isFulltime
          )
        })
        let cellColor: string = ""
        return rowElement.map(element => {
          if (element.length >= 3) {
            cellColor = theme.colors.white
          } else if (element.length === 2) {
            cellColor = theme.colors.bbbred
          } else if (element.length === 1) {
            cellColor = theme.colors.bbred
          } else {
            cellColor = theme.colors.bred
          }
          return (
            <TableCell
              key={`${dayNumber}-${possibleTime[rowElement.indexOf(element)]}`}
              style={{ backgroundColor: cellColor }}
            >
              <Typography.Title level={4}>{element.length}</Typography.Title>
            </TableCell>
          )
        })
      }
    }
  }
}

const makeHeaderRow = (data: GetCurrentTimeTable | null) => {
  if (data) {
    if (data.GetCurrentTimeTable.timetable) {
      // console.log(data.GetCurrentTimeTable)
      const [startTime, endTime] = getTime(data)
      const indexArray = Array.from(Array(endTime - startTime + 1).keys())
      const possibleTime = indexArray.map(index =>
        startTime + index > 24
          ? String(startTime + index - 24) + ":00"
          : String(startTime + index) + ":00"
      )

      return possibleTime.map(time => (
        <TableHeaderCell key={time}>
          <Typography.Title level={4}>{time}</Typography.Title>
        </TableHeaderCell>
      ))
    }
  }
}

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 110px;
  margin-top: -110px;
`

const TableHeader = styled.div`
  display: flex;
  width: 100%;
  height: 10%;
`

const TableBody = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
`

const TableRow = styled.div`
  display: flex;
  width: 100%;
  flex: 1 1 0;
`

const IndexBlock = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid lightgray;
`

const TableHeaderCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60px;
  flex: 1 1 0;
  height: 100%;
  border: 1px solid lightgray;
`

const TableCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  flex: 1 1 0;
  height: 100%;
  border: 1px solid lightgray;
`

export default TimeTablePresenter
