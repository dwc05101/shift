import { Button, Typography } from "antd"
import React from "react"
import styled from "styled-components"
import { theme } from "../../theme"
import { GetCurrentTimeTable_GetCurrentTimeTable_timetable_days } from "../../types/api"
import KoreanDays from "../../utils/KoreanDays"
import { StatusBar, StoreTime, TimeBar } from "./TimeBar"

interface IProps {
  day: GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null
  dayIndex: number
  selectedSlots: Array<{}>
  updateSelectedSlots: (result: string[], dayIndex: number) => void
  clearSelectedSlots: (selectedSlots: Array<{}>, dayIndex: number) => void
}

interface IState {
  boxColors: string[]
  clearStatus: boolean[]
  endTime: number
  startTime: number
  selectedResult: string[][]
}

const parseTimeNextDay = (endTime: string) => {
  const end = time2Int(endTime)
  return 24 + end
}

const time2Int = (time: string) => {
  const t = time.substring(0, 2)
  return parseInt(t, 10)
}

const parseTime = (storeStartTime: number, time: string) => {
  let parsedTime = time2Int(time)
  if (storeStartTime > parsedTime) {
    parsedTime += 24
  }
  return parsedTime
}

const timeFormat = (time: string) => {
  const t = time.substring(0, 2)
  const m = time.substring(2)
  return t + ":" + m
}

class ApplyStatus extends React.Component<IProps, IState> {
  public state = {
    boxColors: ["", "", "", "", "", "", ""],
    clearStatus: [false, false, false, false, false, false, false],
    endTime: this.props.day!.isEndTimeNextDay
      ? parseTimeNextDay(this.props.day!.endTime)
      : time2Int(this.props.day!.endTime),
    selectedResult: [[], [], [], [], [], [], []],
    startTime: time2Int(this.props.day!.startTime)
  }

  public updateSelectedResult = async (
    selectedResult: string[][],
    clearStatus: boolean[],
    dayIndex: number,
    boxId: string
  ) => {
    let subSelectedResult: string[] = selectedResult[dayIndex]
    const prevLength: number = subSelectedResult.length
    subSelectedResult = subSelectedResult.filter(box => box !== boxId)
    const currLength: number = subSelectedResult.length
    if (prevLength === currLength) {
      subSelectedResult.push(boxId)
    }
    selectedResult[dayIndex] = subSelectedResult
    clearStatus[dayIndex] = false
    await this.setState({ clearStatus, selectedResult })
    return subSelectedResult
  }

  public render() {
    const {
      day,
      dayIndex,
      selectedSlots,
      updateSelectedSlots,
      clearSelectedSlots
    } = this.props
    const { clearStatus, selectedResult, endTime, startTime } = this.state
    return (
      <View>
        <Top>
          <Day>
            <Typography.Title level={4} style={{ margin: "0" }}>
              {day!.dayNumber}일 ({KoreanDays[dayIndex]})
            </Typography.Title>
            <StartEndTime>
              <Typography.Text>
                영업 시작 : {timeFormat(day!.startTime)}
              </Typography.Text>
              <Typography.Text>
                영업 종료 : {timeFormat(day!.endTime)}
              </Typography.Text>
            </StartEndTime>
          </Day>
          <Day>
            <Button
              type="danger"
              style={{ marginRight: "5px" }}
              onClick={async e => {
                selectedResult[dayIndex] = []
                clearStatus[dayIndex] = true
                await this.setState({ clearStatus, selectedResult })
                await clearSelectedSlots(selectedSlots, dayIndex)
              }}
            >
              <Typography.Text style={{ fontWeight: "bolder", color: "white" }}>
                초기화
              </Typography.Text>
            </Button>
            <Button type="primary">
              <Typography.Text style={{ fontWeight: "bolder", color: "white" }}>
                임시저장
              </Typography.Text>
            </Button>
          </Day>
        </Top>
        <Middle>
          <Title>
            <Typography.Title
              level={4}
              style={{
                borderRight: `3px solid ${theme.colors.blue}`,
                paddingRight: "5px"
              }}
            >
              신청 현황
            </Typography.Title>
          </Title>
          <TimeBars>
            <TimeNotice style={{ margin: "0" }}>
              <Username />
              <StoreTime startTime={startTime} endTime={endTime} />
            </TimeNotice>
            {day!.slots!.map((slot, index) => {
              return (
                <Slot key={index}>
                  <Username>
                    <Typography.Text strong={true}>
                      {slot!.user.name}
                    </Typography.Text>
                  </Username>
                  <TimeBar
                    userCode={slot!.user.personalCode}
                    isFullTime={slot!.isFulltime}
                    storeStartTime={startTime}
                    storeEndTime={endTime}
                    dayNumber={dayIndex}
                    startTime={parseTime(startTime, slot!.startTime)}
                    endTime={parseTime(startTime, slot!.endTime)}
                    updateSelectedSlots={updateSelectedSlots}
                    updateSelectedResult={this.updateSelectedResult}
                    selectedResult={selectedResult}
                    clearStatus={clearStatus}
                  />
                </Slot>
              )
            })}
          </TimeBars>
        </Middle>
        <Bottom>
          <Title>
            <Typography.Title
              level={4}
              style={{
                borderRight: `3px solid ${theme.colors.blue}`,
                paddingRight: "8px"
              }}
            >
              배정 현황
            </Typography.Title>
          </Title>
          <UserTime>
            <TimeNotice style={{ margin: "0" }}>
              <Username />
              <StoreTime startTime={startTime} endTime={endTime} />
            </TimeNotice>
            <TimeNotice style={{ margin: "0" }}>
              <Username style={{ marginLeft: "1em" }} />
              <StatusBar
                storeStartTime={startTime}
                storeEndTime={endTime}
                dayNumber={dayIndex}
                selectedSlots={selectedSlots}
              />
            </TimeNotice>
          </UserTime>
        </Bottom>
      </View>
    )
  }
}

const View = styled.div`
  height: 100%;
  padding: 0 1%;
`

const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 10%;
`

const Day = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const StartEndTime = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`

const Middle = styled.div`
  display: flex;
  flex-direction: row;
  height: 60%;
  max-height: 60%;
  overflow: auto;
`

const Title = styled.div`
  border: 0;
`

const TimeBars = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow: auto;
  height: 100%;
  margin-left: 5px;
`

const TimeNotice = styled.div`
  flex-direction: row;
  align-items: center;
  display: flex;
  margin-bottom: 5px;
  margin-top: 10px;
`

const Username = styled.div`
  font-weight: 500;
  font-size: 1em;
  text-align: right;
`

const Slot = styled.div`
  flex-direction: row;
  align-items: center;
  display: flex;
  margin-bottom: 20px;
`

const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  height: 30%;
  max-height: 30%;
  overflow: auto;
`

const UserTime = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 5px;
`

export default ApplyStatus
