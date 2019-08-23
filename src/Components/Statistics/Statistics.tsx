import React from "react"
import styled from "styled-components"
import { GetCurrentTimeTable_GetCurrentTimeTable_timetable_days } from "../../types/api"

interface Props {
  days: (GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null)[] | null
}
interface IProps {
  rank: number
  name: string
  time: number
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
const StatisticsPresenter: React.SFC<Props> = ({ days }) => {
  const statistics = makeStatistic(days)
  const sortedStatistic = sortedTime(statistics)
  return (
    <View>
      <Title>8월 n주차 통계</Title>
      <Table>
        <InfoRow>
          <Rank>순위</Rank>
          <Name>이름</Name>
          <Time>배정시간</Time>
        </InfoRow>
        {renderRanking(sortedStatistic)}
      </Table>
      <Confirm>시간표 확정</Confirm>
    </View>
  )
}

const renderRanking = sortedTime => {
  const acc: JSX.Element[] = []
  for (var i = 0; i < sortedTime.length; i++) {
    const item = sortedTime[i]
    const time = (
      <AssignInfo key={i} rank={i + 1} name={item.user.name} time={item.time} />
    )
    acc.push(time)
  }
  return acc
}

const makeStatistic = days => {
  let result = {}
  for (var i = 0; i < days.length; i++) {
    const day = days[i]
    const fulltime = countFullTime(day)
    console.log("fulltime", fulltime)
    const selected = extractSelectedSlots(day)
    for (var j = 0; j < selected.length; j++) {
      const slot = selected[j]
      const userId = slot.userId
      let time
      if (slot.isFulltime) time = fulltime
      else
        time = countTime(
          slot.startTime,
          slot.endTime,
          slot.isStartTimeNextDay,
          slot.isEndTimeNextDay
        )
      if (result.hasOwnProperty(userId)) {
        result[userId].time += time
      } else {
        result[userId] = {
          userId: slot.userId,
          user: slot.user,
          time: time
        }
      }
    }
  }
  return Object.values(result)
}

const countFullTime = day => {
  const start = time2Int(day.startTime)
  let end = time2Int(day.endTime)
  if (day.isEndTimeNextDay) end += 24
  return end - start
}

const countTime = (
  startTime,
  endTime,
  isStartTimeNextDay,
  isEndTimeNextDay
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

const extractSelectedSlots = day => {
  const slots = day.slots
  const selectedSlots = slots.filter(slot => slot.isSelected)
  return slots //
}
const time2Int = (time: string) => {
  const t = time.substring(0, 2)
  return parseInt(t, 10)
}
const sortedTime = times => {
  const sortedTimes = times.sort((a, b) => {
    return b.time - a.time
  })
  console.log("sortedTimes", sortedTimes)
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

const Confirm = styled.div`
  width: 120px;
  height: 50px;
  border-radius: 5px;
  color: white;
  font-size: 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4511f;
  align-self: flex-end;
  font-weight: 320;
  &:hover {
    background-color: #e33e0b;
    cursor: pointer;
  }
`
export default StatisticsPresenter
