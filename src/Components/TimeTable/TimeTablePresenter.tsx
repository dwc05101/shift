import { Button, message, Result, Typography } from "antd"
import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import styled from "styled-components"
import history from "../../history"
import { FlexContainer } from "../../styledComponents"
import { theme } from "../../theme"
import { GetCurrentTimeTable } from "../../types/api"
import Loading from "../Loading"

interface IProps {
  data: GetCurrentTimeTable | undefined
  loading: boolean
}

const koreanDay = ["월", "화", "수", "목", "금", "토", "일"]

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
          minHeight: "500px",
          minWidth: "880px"
        }}
      >
        <TableHeader>
          <IndexBlock />
          {makeHeaderRow(data!)}
        </TableHeader>
        <TableBody>
          <TableRow>
            <IndexBlock>
              <Typography.Title level={4}>오전</Typography.Title>
            </IndexBlock>
            {makeTableCell(data!, "AM")}
          </TableRow>
          <TableRow>
            <IndexBlock>
              <Typography.Title level={4}>오후</Typography.Title>
            </IndexBlock>
            {makeTableCell(data!, "PM")}
          </TableRow>
          <TableRow>
            <IndexBlock>
              <Typography.Title level={4}>마감</Typography.Title>
            </IndexBlock>
            {makeTableCell(data!, "MD")}
          </TableRow>
        </TableBody>
      </FlexContainer>
    </>
  )

const makeHeaderRow = (data: GetCurrentTimeTable | null) => {
  if (data) {
    if (data.GetCurrentTimeTable.timetable) {
      const sortedTimeTable = data.GetCurrentTimeTable.timetable.days!.sort(
        (a, b) => {
          return a!.dayNumber - b!.dayNumber
        }
      )
      return sortedTimeTable.map(day => (
        <TableHeaderCell key={day!.dayNumber}>
          <Typography.Title level={4} style={{ margin: "auto" }}>
            {day!.dayNumber}
          </Typography.Title>
          <Typography.Text>
            {koreanDay[sortedTimeTable.indexOf(day)]}
          </Typography.Text>
        </TableHeaderCell>
      ))
    }
  }
}

const makeTableCell = (data: GetCurrentTimeTable | null, time: string) => {
  if (data) {
    if (data.GetCurrentTimeTable.timetable) {
      const sortedTimeTable = data.GetCurrentTimeTable.timetable.days!.sort(
        (a, b) => {
          return a!.dayNumber - b!.dayNumber
        }
      )

      switch (time) {
        case "AM":
          return sortedTimeTable.map(day => {
            if (day!.slots) {
              const amSlots = day!.slots.filter(
                slot => parseInt(slot!.startTime, 10) < 1200 || slot!.isFulltime
              )
              return (
                <TableCell key={day!.dayNumber}>
                  <Typography.Title level={4}>
                    {`${amSlots.length}명`}
                  </Typography.Title>
                </TableCell>
              )
            } else {
              return (
                <TableCell
                  style={{ background: theme.colors.red }}
                  key={day!.dayNumber}
                />
              )
            }
          })
        case "PM":
          return sortedTimeTable.map(day => {
            if (day!.slots) {
              const pmSlots = day!.slots.filter(
                slot =>
                  (parseInt(slot!.startTime, 10) >= 1200 &&
                    parseInt(slot!.startTime, 10) < 2200) ||
                  parseInt(slot!.endTime, 10) >= 1200 ||
                  slot!.isFulltime
              )
              return (
                <TableCell key={day!.dayNumber}>
                  <Typography.Title level={4}>
                    {`${pmSlots.length}명`}
                  </Typography.Title>
                </TableCell>
              )
            } else {
              return <TableCell key={day!.dayNumber} />
            }
          })
        case "MD":
          return sortedTimeTable.map(day => {
            if (day!.slots) {
              const mdSlots = day!.slots.filter(
                slot =>
                  parseInt(slot!.startTime, 10) >= 2200 ||
                  parseInt(slot!.endTime, 10) >= 2200 ||
                  slot!.isFulltime
              )
              return (
                <TableCell key={day!.dayNumber}>
                  <Typography.Title level={4}>
                    {`${mdSlots.length}명`}
                  </Typography.Title>
                </TableCell>
              )
            } else {
              return <TableCell key={day!.dayNumber} />
            }
          })
        default:
          return null
      }
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
  border: 1px solid black;
`

const TableBody = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
`

const TableRow = styled.div`
  display: flex;
  width: 100%;
  flex: 1 1 0;
  border: 1px solid black;
`

const IndexBlock = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`

const TableHeaderCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1 1 0;
  height: 100%;
  border: 1px solid black;
`

const TableCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  height: 100%;
  border: 1px solid black;
`

const Slot = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1px;
  height: 25%;
  width: 100%;
  border: 1px solid black;
`

const SlotHeader = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  border-bottom: 1px solid black;
`

const SlotUserInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
`

const SlotBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
`

export default TimeTablePresenter
