import { Typography } from "antd"
import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { theme } from "../../theme"

interface IProps {
  userCode: string
  isFullTime: boolean
  storeStartTime: number
  storeEndTime: number
  startTime: number
  endTime: number
}

interface ITimeProps {
  startTime: number
  endTime: number
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
  startTime,
  endTime
}) => {
  const totalHour = storeEndTime - storeStartTime
  const firstIndex = startTime - storeStartTime || 0
  const endIndex = endTime - storeStartTime - 1 || totalHour
  const boxResult = colorBar(userCode, totalHour, firstIndex, endIndex)
  return <View>{boxResult}</View>
}

// class StatusBar extends Component {
//   constructor(props) {
//     super(props)
//   }

//   render() {
//     return <div>hi</div>
//   }
// }

const selectUserAtTime = (event: any) => {
  let info = JSON.parse(event.target.id)
  const boxId: any = String(`${info.code}-${info.index}`)
  const prevLength: number = selectedResult.length
  selectedResult = selectedResult.filter(box => box !== boxId)
  const currLength: number = selectedResult.length
  if (prevLength === currLength) {
    selectedResult.push(boxId)
  }
  if (selectedResult.includes(boxId)) {
    event.target.style.backgroundColor = theme.colors.red
  } else {
    event.target.style.backgroundColor = theme.colors.pale_blue
  }
  console.log(selectedResult)
}

let selectedResult: string[] = []

const colorBar = (
  userCode: any,
  totalHour: any,
  firstIndex: any,
  endIndex: any
) => {
  const boxResult: JSX.Element[] = []
  for (let i = 0; i < totalHour; i++) {
    if (firstIndex <= i && i <= endIndex) {
      boxResult.push(
        <Item
          key={i}
          id={`{"code":"${userCode}","index":"${i}"}`}
          onClick={event => {
            selectUserAtTime(event)
          }}
        />
      )
    } else {
      boxResult.push(
        <TimeBox id={userCode} key={i} color={theme.colors.grey} />
      )
    }
  }
  return boxResult
}

const TimeView = styled.div`
  flex-direction: row;
  display: flex;
`

const View = styled.div`
  margin-left: 15px;
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
    background-color: ${theme.colors.dark_pale_blue};
    cursor: pointer;
  }
`

// export default StatusBar
