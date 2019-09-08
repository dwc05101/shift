import { Typography } from "antd"
import React from "react"
import styled from "styled-components"
import { theme } from "../../theme"

interface IProps {
  userCode: string
  isFullTime: boolean
  storeStartTime: number
  storeEndTime: number
  dayNumber: number
  applyTime: Array<{}>
  updateSelectedSlots: (result: string[], dayIndex: number) => void
  updateSelectedResult: (
    selectedResult: string[][],
    clearStatus: boolean[],
    dayIndex: number,
    boxId: string
  ) => Promise<string[]>
  selectedResult: string[][]
  selectedSlots: Array<{}>
  clearStatus: boolean[]
}

interface ITimeProps {
  startTime: number
  endTime: number
}

interface IUpdateProps {
  storeStartTime: number
  storeEndTime: number
  dayNumber: number
  selectedSlots: Array<{}>
}

export const StoreTime: React.SFC<ITimeProps> = ({ startTime, endTime }) => {
  const array: JSX.Element[] = []
  for (let i = startTime; i <= endTime; i++) {
    array.push(
      <TimeBox key={-i} color="white">
        <Typography.Text strong={true}>{i % 24}</Typography.Text>
      </TimeBox>
    )
  }
  return <TimeView>{array}</TimeView>
}

export const TimeBar: React.SFC<IProps> = ({
  userCode,
  isFullTime,
  storeStartTime,
  storeEndTime,
  dayNumber,
  applyTime,
  updateSelectedSlots,
  updateSelectedResult,
  selectedResult,
  selectedSlots,
  clearStatus
}) => {
  const totalHour = storeEndTime - storeStartTime
  let timeIndices
  if (typeof applyTime[dayNumber][userCode] !== "undefined") {
    timeIndices = applyTime[dayNumber][userCode].map(
      time => time - storeStartTime
    )
    let boxColor: string = ""
    if (clearStatus[dayNumber]) {
      boxColor = theme.colors.pale_blue
    }
    const boxResult = colorBar(
      userCode,
      totalHour,
      dayNumber,
      timeIndices,
      updateSelectedSlots,
      updateSelectedResult,
      selectedResult,
      selectedSlots,
      boxColor,
      clearStatus
    )
    return <View>{boxResult}</View>
  } else {
    return <>loading</>
  }
}

const colorBar = (
  userCode: any,
  totalHour: any,
  dayNumber: number,
  timeIndices: number[],
  updateSelectedSlots: (result: string[], dayIndex: number) => void,
  updateSelectedResult: (
    selectedResult: string[][],
    clearStatus: boolean[],
    dayIndex: number,
    boxId: string
  ) => Promise<string[]>,
  selectedResult: string[][],
  selectedSlots: Array<{}>,
  boxColor: string,
  clearStatus: boolean[]
) => {
  const boxResult: JSX.Element[] = []
  const defaultColoredBox: string[] = selectedSlots[dayNumber][userCode]
  for (let i = 0; i < totalHour; i++) {
    if (timeIndices.indexOf(i) !== -1) {
      if (defaultColoredBox && defaultColoredBox.indexOf(String(i)) !== -1) {
        boxColor = theme.colors.red
      } else {
        boxColor = theme.colors.pale_blue
      }
      boxResult.push(
        <Item
          key={i}
          id={`{"code":"${userCode}","index":"${i}"}`}
          onClick={event => {
            selectUserAtTime(
              event,
              dayNumber,
              updateSelectedSlots,
              updateSelectedResult,
              selectedResult,
              clearStatus,
              false
            )
          }}
          style={{ backgroundColor: `${boxColor}` }}
        />
      )
    } else {
      let nonSelectedBoxColor: string = ""
      if (defaultColoredBox && defaultColoredBox.indexOf(String(i)) !== -1) {
        nonSelectedBoxColor = theme.colors.red
      } else {
        nonSelectedBoxColor = theme.colors.grey
      }
      boxResult.push(
        <TimeBox
          id={`{"code":"${userCode}","index":"${i}"}`}
          onClick={event => {
            selectUserAtTime(
              event,
              dayNumber,
              updateSelectedSlots,
              updateSelectedResult,
              selectedResult,
              clearStatus,
              true
            )
          }}
          key={i}
          color={`${nonSelectedBoxColor}`}
        />
      )
    }
  }
  return boxResult
}

const selectUserAtTime = async (
  event: any,
  dayNumber: number,
  updateSelectedSlots: (result: string[], dayIndex: number) => void,
  updateSelectedResult: (
    selectedResult: string[][],
    clearStatus: boolean[],
    dayIndex: number,
    boxId: string
  ) => Promise<string[]>,
  selectedResult: string[][],
  clearStatus: boolean[],
  supervisorSelect: boolean
) => {
  event.persist()
  const info = JSON.parse(event.target.id)
  const boxId: string = String(`${info.code}-${info.index}`)
  const updatingResult: string[] = await updateSelectedResult(
    selectedResult,
    clearStatus,
    dayNumber,
    boxId
  )
  if (updatingResult.includes(boxId)) {
    event.target.style.backgroundColor = theme.colors.red
  } else if (supervisorSelect) {
    event.target.style.backgroundColor = theme.colors.grey
  } else {
    event.target.style.backgroundColor = theme.colors.pale_blue
  }

  await updateSelectedSlots(updatingResult, dayNumber)
}

export const StatusBar: React.SFC<IUpdateProps> = ({
  storeStartTime,
  storeEndTime,
  dayNumber,
  selectedSlots
}) => {
  const totalArray: JSX.Element[] = []
  const statusArray: JSX.Element[][] = []
  let finalStatusArray: any[] = []
  const userArray: string[] = Object.keys(selectedSlots[dayNumber])
  const timeArray: string[] = Object.values(selectedSlots[dayNumber])
  const timeCount: {} = {}
  for (let i = storeStartTime; i < storeEndTime; i++) {
    timeCount[i] = 0
  }
  if (timeArray) {
    timeArray.map(time => {
      const times: string[] = String(time).split(",")
      times.map(eachTime => {
        timeCount[parseInt(eachTime, 10) + storeStartTime] += 1
        return null
      })
      return null
    })
  }
  let bgColor: string = ""
  for (let i = storeStartTime; i < storeEndTime; i++) {
    if (timeCount[i] >= 3) {
      bgColor = theme.colors.white
    } else if (timeCount[i] === 2) {
      bgColor = theme.colors.bbbred
    } else if (timeCount[i] === 1) {
      bgColor = theme.colors.bbred
    } else {
      bgColor = theme.colors.bred
    }
    totalArray.push(
      <TimeBox
        key={-i}
        style={{
          backgroundColor: `${bgColor}`,
          border: "1px solid black",
          height: "10px",
          marginBottom: "5px"
        }}
      />
    )
    const subArray: JSX.Element[] = []
    const index: number = i
    for (let j = 0; j < userArray.length; j++) {
      let userTime: string[] = String(timeArray[j]).split(",")
      userTime = userTime.map(time =>
        String(parseInt(time, 10) + storeStartTime)
      )
      if (userTime.includes(String(index))) {
        subArray.push(
          <TimeBox
            key={`${j}-${index}`}
            style={{
              backgroundColor: `${theme.colors.white}`,
              border: "1px solid black",
              fontSize: "10px",
              height: "15px"
            }}
          >
            {userArray[j]}
          </TimeBox>
        )
      } else {
        subArray.push(
          <TimeBox
            key={`${j}-${index}`}
            style={{
              backgroundColor: `${theme.colors.white}`,
              fontSize: "10px",
              height: "15px"
            }}
          />
        )
      }
    }
    statusArray.push(subArray)
  }
  finalStatusArray = statusArray.map(status => (
    <StatusView key={`status-${statusArray.indexOf(status)}`}>
      {status}
    </StatusView>
  ))

  return (
    <StatusView>
      <TimeView>{totalArray}</TimeView>
      <TimeView>{finalStatusArray}</TimeView>
    </StatusView>
  )
}

const StatusView = styled.div`
  flex-direction: column;
  display: flex;
`

const TimeView = styled.div`
  margin-left: 20px;
  flex-direction: row;
  display: flex;
`

const View = styled.div`
  margin-left: 25px;
  flex-direction: row;
  display: flex;
`

const TimeBox = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 3px;
  background-color: ${props => props.color};
  margin-right: 1px;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 12px;
  color: grey;
`

const Item = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 3px;
  background-color: ${theme.colors.pale_blue};
  margin-right: 1px;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 12px;
  &:hover {
    background-color: ${theme.colors.dark_pale_blue} !important;
    cursor: pointer;
  }
`
