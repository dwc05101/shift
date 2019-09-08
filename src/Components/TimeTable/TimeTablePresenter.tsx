import { Button, message, Result, Typography } from "antd"
import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Chart from "react-google-charts"
import styled from "styled-components"
import history from "../../history"
import { FlexContainer } from "../../styledComponents"
import { GetCurrentTimeTable } from "../../types/api"
import KoreanDays from "../../utils/KoreanDays"
// import KoreanDays from "../../utils/KoreanDays"
import Loading from "../Loading"

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
          border: "none",
          flexDirection: "column",
          minWidth: "880px"
        }}
      >
        <Chart
          width={"100%"}
          height={"100%"}
          chartType="Bar"
          loader={<Loading />}
          data={makeData(data!)}
        />
      </FlexContainer>
    </>
  )

const makeData = (data: GetCurrentTimeTable) => {
  const baseData: any[][] = [
    ["날짜", "점심 (10시 ~ 14시)", "저녁 (17시 ~ 21시)", "마감 (22시 ~)"]
  ]
  const sortedDay = sortDay(data)
  sortedDay!.forEach((day, index) => {
    const lunchSlots = day!.slots!.filter(slot => {
      if (slot!.isSelected) {
        return false
      }
      if (slot!.isFulltime) {
        return true
      }

      let included = true
      if (parseInt(slot!.startTime, 10) >= 1400) {
        included = false
      }
      if (parseInt(slot!.endtime, 10) < 1000) {
        included = false
      }

      return included
    })
    const dinnerSlots = day!.slots!.filter(slot => {
      if (slot!.isSelected) {
        return false
      }
      if (slot!.isFulltime) {
        return true
      }

      let included = true
      if (parseInt(slot!.startTime, 10) >= 2100) {
        included = false
      }
      if (parseInt(slot!.endtime, 10) < 1700) {
        included = false
      }

      return included
    })
    const mdSlots = day!.slots!.filter(slot => {
      if (slot!.isSelected) {
        return false
      }
      if (slot!.isFulltime) {
        return true
      }
      return parseInt(slot!.endTime, 10) > 2200
    })

    baseData.push([
      `${day!.dayNumber}일 (${KoreanDays[index]})`,
      lunchSlots.length,
      dinnerSlots.length,
      mdSlots.length
    ])
  })

  return baseData
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
const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 110px;
  margin-top: -110px;
`

export default TimeTablePresenter
