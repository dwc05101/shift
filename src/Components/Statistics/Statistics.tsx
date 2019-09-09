import { Button, Typography } from "antd"
import React from "react"
import styled from "styled-components"
import { theme } from "../../theme"
import {
  GetCurrentTimeTable,
  GetCurrentTimeTable_GetCurrentTimeTable_timetable_days,
  SlotInfo
} from "../../types/api"

interface IDayProps {
  days: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null> | null
  data: GetCurrentTimeTable | undefined
  selectedSlots: Array<{}>
  clearStatistics: boolean[]
  getInfo: (
    data: GetCurrentTimeTable | null,
    selectedSlots: Array<{}>
  ) =>
    | Array<
        Array<
          Array<{
            dayNumber: number
            endTime: string
            isEndTimeNextDay: boolean
            isFulltime: boolean
            isSelected: boolean
            isStartTimeNextDay: boolean
            personalCode: string
            startTime: string
          }>
        >
      >
    | undefined
  height: number
  loadingConfirm: boolean
  confirmTimeTable: (
    data: GetCurrentTimeTable | null,
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => Promise<void>
}

interface IProps {
  rank: number
  name: string
  time: number
}

const makeStatistic = (
  days: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null> | null,
  data: GetCurrentTimeTable | undefined,
  selectedSlots: Array<{}>,
  clearStatistics: boolean[],
  getInfo: (
    data: GetCurrentTimeTable | null,
    selectedSlots: Array<{}>
  ) =>
    | Array<
        Array<
          Array<{
            dayNumber: number
            endTime: string
            isEndTimeNextDay: boolean
            isFulltime: boolean
            isSelected: boolean
            isStartTimeNextDay: boolean
            personalCode: string
            startTime: string
          }>
        >
      >
    | undefined
) => {
  const result: {} = {}
  const defaultSelectedSlots: {} = {}
  let defaultSlots: any[] = []
  for (const day of days!) {
    defaultSelectedSlots[day!.dayNumber] = extractSelectedSlots(day)
    defaultSlots = defaultSlots.concat(extractDefaultSlots(day))
  }
  const loadedSelectedSlots: Array<{}> = [{}, {}, {}, {}, {}, {}, {}]
  Object.values(defaultSelectedSlots).map((daySlots: any) => {
    const dayIndex = Object.values(defaultSelectedSlots).indexOf(daySlots)
    daySlots.map(slot => {
      const personalCode: string = slot.user.personalCode
      const userStartTimeNextDay: boolean = slot!.isStartTimeNextDay
      const userEndTimeNextDay: boolean = slot!.isEndTimeNextDay
      const userStartTime: number = userStartTimeNextDay
        ? parseInt(slot!.startTime.slice(-4, -2), 10) + 24
        : parseInt(slot!.startTime.slice(-4, -2), 10)
      const userEndTime: number = userEndTimeNextDay
        ? parseInt(slot!.endTime.slice(-4, -2), 10) + 24
        : parseInt(slot!.endTime.slice(-4, -2), 10)
      const times: string[] = []
      for (let i = userStartTime; i < userEndTime; i++) {
        times.push(String(i))
      }
      if (!loadedSelectedSlots[dayIndex][personalCode]) {
        loadedSelectedSlots[dayIndex][personalCode] = times
      } else {
        loadedSelectedSlots[dayIndex][personalCode] = loadedSelectedSlots[
          dayIndex
        ][personalCode].concat(times)
      }
      return null
    })
    return null
  })
  const newSelectedSlots: Array<{}> = [{}, {}, {}, {}, {}, {}, {}]
  for (const subSlots of selectedSlots) {
    const subIndex: number = selectedSlots.indexOf(subSlots)
    if (clearStatistics[subIndex]) {
      newSelectedSlots[subIndex] = {}
    } else if (Object.values(selectedSlots[subIndex]).length === 0) {
      newSelectedSlots[subIndex] = loadedSelectedSlots[subIndex]
    } else {
      newSelectedSlots[subIndex] = selectedSlots[subIndex]
    }
  }
  const slots: SlotInfo[] = []
  const InfoArray = getInfo(data!, newSelectedSlots)
  InfoArray!.map(singleDay =>
    singleDay.map(user => user.map(slot => slots!.push(slot)))
  )
  for (const slot of slots) {
    const personalCode: string = slot.personalCode
    const time: number = countTime(
      slot.startTime,
      slot.endTime,
      slot.isStartTimeNextDay,
      slot.isEndTimeNextDay
    )
    if (result.hasOwnProperty(personalCode)) {
      result[personalCode].time += time
    } else {
      result[personalCode] = {
        time
      }
    }
  }
  for (const slot of defaultSlots) {
    const userId: string = slot.user.personalCode
    if (result.hasOwnProperty(userId)) {
      result[userId].user = slot.user
      result[userId].userId = userId
    }
  }
  return Object.values(result)
}

const StatisticsPresenter: React.SFC<IDayProps> = ({
  days,
  data,
  selectedSlots,
  clearStatistics,
  getInfo,
  height,
  loadingConfirm,
  confirmTimeTable
}) => {
  const statistics = makeStatistic(
    days,
    data,
    selectedSlots,
    clearStatistics,
    getInfo
  )
  const sortedStatistic = sortedTime(statistics)
  return (
    <View>
      <Title>통계</Title>
      <Table style={{ maxHeight: height * 0.8, overflow: "auto" }}>
        <InfoRow>
          <Rank>순위</Rank>
          <Name>이름</Name>
          <Time>배정시간</Time>
        </InfoRow>
        {renderRanking(sortedStatistic)}
      </Table>
      <Button
        size={"large"}
        style={{
          alignItems: "center",
          alignSelf: "flex-end",
          background: "#f4511f",
          color: theme.colors.white,
          display: "flex",
          justifyContent: "center",
          marginTop: "20px"
        }}
        loading={loadingConfirm}
        onClick={e => confirmTimeTable(data!, e)}
      >
        <Typography.Title
          level={4}
          style={{ color: theme.colors.white, marginBottom: "0" }}
        >
          시간표 확정
        </Typography.Title>
      </Button>
    </View>
  )
}

const renderRanking = sortedTimes => {
  const acc: JSX.Element[] = []
  for (let i = 0; i < sortedTimes.length; i++) {
    const item = sortedTimes[i]
    const time = (
      <AssignInfo key={i} rank={i + 1} name={item.user.name} time={item.time} />
    )
    acc.push(time)
  }
  return acc
}

const AssignInfo: React.SFC<IProps> = ({ rank, name, time }) => {
  let color = "#616161"
  if (time >= 15) {
    color = "#D50000"
  }
  return (
    <Row key={rank} color={color}>
      <Rank>{rank}</Rank>
      <Name>{name}</Name>
      <Time>{time}시간</Time>
    </Row>
  )
}

const countTime = (
  startTime: string,
  endTime: string,
  isStartTimeNextDay: boolean,
  isEndTimeNextDay: boolean
) => {
  const start = time2Int(startTime)
  const end = time2Int(endTime)
  if (isStartTimeNextDay) {
    if (isEndTimeNextDay) {
      return end - start
    } else {
      return 0
    }
  } else {
    if (isEndTimeNextDay) {
      return 24 + end - start
    } else {
      return end - start
    }
  }
}

const extractSelectedSlots = day => day.slots.filter(slot => slot.isSelected)

const extractDefaultSlots = day => day.slots.filter(slot => !slot.isSelected)

const time2Int = (time: string) => {
  const t = time.slice(-4, -2)
  return parseInt(t, 10)
}

const sortedTime = times => {
  const sortedTimes = times.sort((a, b) => {
    return b.time - a.time
  })
  return sortedTimes
}

const View = styled.div`
  flex: 1;
  padding: 2%;
`
const Title = styled.div`
  font-weight: 600;
  font-size: 23px;
`
const Table = styled.div`
  margin-top: 20px;
  flex-direction: column;
  display: flex;
  align-self: center;
  background-color: white;
  padding: 4%;
  border-radius: 2px;
`
const InfoRow = styled.div`
  flex-direction: row;
  display: flex;
`
const Row = styled.div`
  flex-direction: row;
  display: flex;
  margin-top: 5px;
  color: ${props => props.color};
`

const Rank = styled.div`
  width: 60px;
  text-align: center;
`
const Name = styled.div`
  width: 60px;
  text-align: center;
`
const Time = styled.div`
  width: 100px;
  text-align: center;
`

// const Confirm = styled.div`
//   width: 120px;
//   height: 50px;
//   border-radius: 5px;
//   color: white;
//   font-size: 20px;
//   margin-top: 20px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: #f4511f;
//   align-self: flex-end;
//   font-weight: 320;
//   &:hover {
//     background-color: #e33e0b;
//     cursor: pointer;
//   }
// `
export default StatisticsPresenter
