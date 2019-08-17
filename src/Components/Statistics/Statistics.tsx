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
  makeStatistic(days)
  return (
    <View>
      <Title>8월 3주차 통계</Title>
      <Table>
        <InfoRow>
          <Rank>순위</Rank>
          <Name>이름</Name>
          <Time>배정시간</Time>
        </InfoRow>
        <AssignInfo rank={1} name={"허구슬"} time={15} />
        <AssignInfo rank={2} name={"김보성"} time={10} />
        <AssignInfo rank={3} name={"문석현"} time={9} />
      </Table>
      <Confirm>시간표 확정</Confirm>
    </View>
  )
}

const makeStatistic = days => {
  const daysSlots = days.map(day => extractSelectedSlots(day))
  const selectedSlots = daysSlots.reduce((acc, curr) => acc.concat(curr))
  let result = {}
  for (var i = 0; i < selectedSlots.length; i++) {
    const slot = selectedSlots[i]
    const userId = slot.userId
    const time = countTime(
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
  console.log("makeStatistic", result)
  return result
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
  const selectedSlots = day.slots
  selectedSlots.filter(slot => slot.isSelected)
  return selectedSlots
}
const time2Int = (time: string) => {
  const t = time.substring(0, 2)
  return parseInt(t, 10)
}

const View = styled.div`
  flex: 1;
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
