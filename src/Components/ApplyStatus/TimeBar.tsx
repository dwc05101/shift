import React from "react"
import styled from "styled-components"

interface IProps {
  userCode: string
  isFullTime: boolean
  storeStartTime: number
  storeEndTime: number
  startTime: number
  endTime: number
}

interface TProps {
  startTime: number
  endTime: number
}

export const StoreTime: React.SFC<TProps> = ({ startTime, endTime }) => {
  const array: JSX.Element[] = []
  for (var i = startTime; i <= endTime; i++) {
    array.push(
      <TimeBox key={-i} color="white">
        {i % 24}
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
  return <View>{colorBar(userCode, totalHour, firstIndex, endIndex)}</View>
}

const foo = event => {
  const info = JSON.parse(event.target.id)
  console.log("info", info)
  console.log("code", info.code)
  console.log("index", info.index)
}

const colorBar = (userCode, totalHour, firstIndex, endIndex) => {
  const result: JSX.Element[] = []
  for (var i = 0; i < totalHour; i++) {
    if (firstIndex <= i && i <= endIndex) {
      result.push(
        <Item
          key={i}
          id={`{"code":"${userCode}","index":"${i}"}`}
          onClick={event => foo(event)}
        />
      )
    } else {
      result.push(<TimeBox id={userCode} key={i} color="#F1F3F4" />)
    }
  }
  return result
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
  font-color: grey;
`
const Item = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 3px;
  background-color: #7986cb;
  margin-right: 1px;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 12px;
  &:hover {
    background-color: #5561a1;
    cursor: pointer;
  }
`
//lighter #96a4eb
//original #7986cb
//darker #5561a1
