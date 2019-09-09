import { message, Tabs, Typography } from "antd"
import React from "react"
import { Mutation } from "react-apollo"
import styled from "styled-components"
import ApplyStatus from "../../Components/ApplyStatus"
import { REMOVE_SLOT } from "../../Components/ApplyStatus/ApplyStatusQueries"
import Loading from "../../Components/Loading"
import { CREATE_SLOT } from "../../Components/MakeSlot/MakeSlotQueries"
import Statistics from "../../Components/Statistics"
import history from "../../history"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"
import {
  ConfirmTimeTableVariables,
  CreateSlot,
  CreateSlotVariables,
  GetCurrentTimeTable,
  GetCurrentTimeTable_GetCurrentTimeTable_timetable_days,
  RemoveSlot,
  RemoveSlotVariables,
  SlotInfo
} from "../../types/api"
import KoreanDays from "../../utils/KoreanDays"
import { GET_ALL_TIMETABLES } from "../ViewTimeTable/ViewTimeTableQueries"
import { CONFIRM_TIMETABLE } from "./EditTimeTableQueries"

interface IProps {
  // addedSlots: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days_slots | null>
  data: GetCurrentTimeTable | undefined
  // defaultSlots: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days_slots | null>
  loading: boolean
  timetableId: number
  organizationId: number
}

interface IState {
  clearIndex: number
  clearStatistics: boolean[]
  dayIndex: number
  height: number
  loadingConfirm: boolean
  selectedSlots: Array<{}>
  slotIds: number[]
  slots: SlotInfo[]
}

class CreateSlotMutation extends Mutation<CreateSlot, CreateSlotVariables> {}
class RemoveSlotMutation extends Mutation<RemoveSlot, RemoveSlotVariables> {}
class ConfirmTimeTable extends Mutation<
  ConfirmTimeTable,
  ConfirmTimeTableVariables
> {}

const { TabPane } = Tabs

class EditTimeTablePresenter extends React.Component<IProps, IState> {
  public state = {
    clearIndex: -1,
    clearStatistics: [false, false, false, false, false, false, false],
    dayIndex: -1,
    height: 0,
    loadingConfirm: false,
    selectedSlots: [{}, {}, {}, {}, {}, {}, {}],
    slotIds: [] as number[],
    slots: []
  }

  public createSlotMutationFn
  public removeSlotMutationFn
  public confirmTimeTableMutationFn
  private height = React.createRef<HTMLDivElement>()

  public clearSelectedSlots = (selectedSlots: Array<{}>, dayIndex: number) => {
    const { clearStatistics } = this.state
    selectedSlots[dayIndex] = {}
    const clearIndex: number = dayIndex
    clearStatistics[clearIndex] = true
    this.setState({ clearIndex, clearStatistics, selectedSlots })
  }

  public updateSelectedSlots = (result: string[], dayIndex: number) => {
    const { clearStatistics } = this.state
    const selectedSlots: Array<{}> = this.state.selectedSlots
    const newSelectedSlot = {}
    result.map(res => {
      const user: string = res.split("-")[0]
      const timeIndex: string = res.split("-")[1]
      if (!newSelectedSlot[user]) {
        newSelectedSlot[user] = [timeIndex]
      } else if (newSelectedSlot[user].indexOf(timeIndex) === -1) {
        newSelectedSlot[user].push(timeIndex)
      }
      newSelectedSlot[user].sort((a: any, b: any) => {
        return parseInt(a, 10) - parseInt(b, 10)
      })
      return null
    })
    selectedSlots[dayIndex] = newSelectedSlot
    clearStatistics[dayIndex] = false
    this.setState({ clearStatistics, dayIndex, selectedSlots })
  }

  public componentDidUpdate() {
    if (this.height.current!.clientHeight * 0.9 !== this.state.height) {
      this.setState({ height: this.height.current!.clientHeight * 0.9 })
    }
  }

  public handleTempSave = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    dayIndex: number
  ) => {
    e.preventDefault()
    await this.slotGeneration()
    const { clearIndex, selectedSlots, slotIds, slots } = this.state
    const { data } = this.props

    if (slots.length > 0) {
      await this.createSlotMutationFn()
      if (data!.GetCurrentTimeTable.timetable!.days) {
        const defaultSlotArray = data!.GetCurrentTimeTable.timetable!.days.map(
          day => day!.slots!.filter(slot => slot!.isSelected)
        )
        const defaultCodeArray: string[] = []
        defaultSlotArray[dayIndex].map(slot => {
          if (defaultCodeArray.indexOf(slot!.user.personalCode) === -1) {
            defaultCodeArray.push(slot!.user.personalCode)
          }
          return null
        })
        const slotCodeArray: string[] = []
        slots.map((slot: any) => {
          if (slotCodeArray.indexOf(slot!.personalCode) === -1) {
            slotCodeArray.push(slot!.personalCode)
          }
          return null
        })
        const removeCodeArray: string[] = defaultCodeArray.filter(
          code => slotCodeArray.indexOf(code) === -1
        )
        removeCodeArray.map(code => {
          defaultSlotArray[dayIndex].map(slot => {
            if (slot!.user.personalCode === code) {
              slotIds.push(slot!.id)
            }
            return null
          })
          return null
        })
        this.setState({ slotIds })
        await this.removeSlotMutationFn()
      }
    } else {
      if (data) {
        if (data!.GetCurrentTimeTable) {
          if (typeof selectedSlots[dayIndex] !== "undefined") {
            if (
              clearIndex !== -1 ||
              Object.keys(selectedSlots[dayIndex]).length === 0
            ) {
              let index: number
              if (Object.keys(selectedSlots[dayIndex]).length === 0) {
                index = dayIndex
              } else {
                index = clearIndex
              }
              data!.GetCurrentTimeTable.timetable!.days![index]!.slots!.filter(
                slot => slot!.isSelected
              ).map(slot => slotIds.push(slot!.id))
            }
          }
        }
      }
      this.setState({ slotIds })
      await this.removeSlotMutationFn()
    }
  }

  public confirmTimeTable = async (
    data: GetCurrentTimeTable | null,
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.persist()
    this.setState({ loadingConfirm: true })
    if (!data!.GetCurrentTimeTable.timetable!.isConfirmed) {
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        await this.handleTempSave(e, dayIndex)
      }
    }
    await this.confirmTimeTableMutationFn()
    history.push("/timetable")
  }

  public slotGeneration = async () => {
    const slots: SlotInfo[] = []
    const { data, loading } = this.props
    const { selectedSlots } = this.state
    if (!loading) {
      const InfoArray = getInfo(data!, selectedSlots)
      InfoArray!.map(day =>
        day.map(user => user.map(slot => slots!.push(slot)))
      )
    }
    this.setState({
      slots
    })
  }

  public render() {
    const { data, loading, timetableId, organizationId } = this.props
    const {
      clearStatistics,
      height,
      loadingConfirm,
      selectedSlots,
      slotIds,
      slots
    } = this.state

    return (
      <CreateSlotMutation
        mutation={CREATE_SLOT}
        variables={{ slots, timetableId, organizationId }}
        onCompleted={response => {
          if (response.CreateSlot.ok) {
            message.success("임시 저장 완료")
          } else if (response.CreateSlot.error) {
            message.error(response.CreateSlot.error)
          } else {
            message.error("서버 내부 에러")
          }
        }}
      >
        {createSlotMutation => {
          this.createSlotMutationFn = createSlotMutation

          return (
            <RemoveSlotMutation
              mutation={REMOVE_SLOT}
              variables={{ slotIds, timetableId }}
              onCompleted={response => {
                if (response.RemoveSlot.ok) {
                  message.success("초기화 완료")
                } else if (response.RemoveSlot.error) {
                  message.error(response.RemoveSlot.error)
                } else {
                  message.error("서버 내부 에러")
                }
              }}
            >
              {removeSlotMutation => {
                this.removeSlotMutationFn = removeSlotMutation
                return (
                  <ConfirmTimeTable
                    mutation={CONFIRM_TIMETABLE}
                    variables={{ timetableId }}
                    onCompleted={resonse => true}
                    refetchQueries={[{ query: GET_ALL_TIMETABLES }]}
                  >
                    {confirmTimeTableMutation => {
                      this.confirmTimeTableMutationFn = confirmTimeTableMutation
                      return loading ? (
                        <Loading />
                      ) : (
                        <Container>
                          <Content>
                            <InnerShadowedBox>
                              <RightWrapper>
                                <Tabs
                                  onChange={e => true}
                                  type="line"
                                  tabBarStyle={{
                                    border: "0",
                                    height: "10%",
                                    margin: "0"
                                  }}
                                >
                                  {makeTabPanes(
                                    data!,
                                    selectedSlots,
                                    this.updateSelectedSlots,
                                    this.clearSelectedSlots,
                                    height,
                                    this.handleTempSave
                                  )}
                                </Tabs>
                              </RightWrapper>
                              <LeftWrapper ref={this.height}>
                                <StatisticsView>
                                  <Statistics
                                    days={
                                      data!.GetCurrentTimeTable.timetable!.days
                                    }
                                    data={data!}
                                    selectedSlots={selectedSlots}
                                    clearStatistics={clearStatistics}
                                    getInfo={getInfo}
                                    height={height}
                                    loadingConfirm={loadingConfirm}
                                    confirmTimeTable={this.confirmTimeTable}
                                  />
                                </StatisticsView>
                              </LeftWrapper>
                            </InnerShadowedBox>
                          </Content>
                        </Container>
                      )
                    }}
                  </ConfirmTimeTable>
                )
              }}
            </RemoveSlotMutation>
          )
        }}
      </CreateSlotMutation>
    )
  }
}

const sortDays = (dayNumbers: number[]) => {
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
  return dayNumbers
}

const sortSlotsByRank = (
  day: GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null
) => {
  const isEndTimeNextDay = day!.isEndTimeNextDay
  const storeStartTime = parseInt(day!.startTime.slice(-4, -2), 10)
  const storeEndTime = isEndTimeNextDay
    ? parseInt(day!.endTime.slice(-4, -2), 10) + 24
    : parseInt(day!.endTime.slice(-4, -2), 10)
  const rankSlots = {}
  day!.slots!.map(slot => {
    let UserRank: number = 0
    switch (slot!.user.userRank) {
      case "ONE":
        UserRank = 1
        break
      case "TWO":
        UserRank = 2
        break
      case "THREE":
        UserRank = 3
        break
    }
    if (!rankSlots[UserRank]) {
      rankSlots[UserRank] = [slot]
    } else {
      rankSlots[UserRank].push(slot)
    }
    return null
  })
  const rankSortedArray = Object.values(rankSlots).reverse()
  const timeSlots = {}
  day!.slots!.map(slot => {
    if (!slot!.isSelected) {
      let time: number = 0
      if (slot!.isFulltime) {
        time = storeEndTime - storeStartTime
      } else {
        const userStartTimeNextDay = slot!.isStartTimeNextDay
        const userEndTimeNextDay = slot!.isEndTimeNextDay
        const userStartTime = userStartTimeNextDay
          ? parseInt(slot!.startTime, 10) / 100 + 24
          : parseInt(slot!.startTime, 10) / 100
        const userEndTime = userEndTimeNextDay
          ? parseInt(slot!.endTime, 10) / 100 + 24
          : parseInt(slot!.endTime, 10) / 100
        time = userEndTime - userStartTime
      }
      if (!timeSlots[slot!.user.personalCode]) {
        timeSlots[slot!.user.personalCode] = time
      } else {
        timeSlots[slot!.user.personalCode] += time
      }
    }
    return null
  })
  const sortedTimeSlots = Object.keys(timeSlots).map(key => [
    key,
    timeSlots[key]
  ])
  sortedTimeSlots.sort((first, second) => second[1] - first[1])
  const sortedTime = {}
  sortedTimeSlots.map(timeSlot => (sortedTime[timeSlot[0]] = timeSlot[1]))
  const sortedTimeArray = Object.keys(sortedTime)
  let subSlot
  for (subSlot of rankSortedArray) {
    subSlot.sort(
      (first, second) =>
        sortedTimeArray.indexOf(first.user.personalCode) -
        sortedTimeArray.indexOf(second.user.personalCode)
    )
  }
  const rankSortedSlots: any[] = []
  let slots
  for (slots of rankSortedArray) {
    slots.map(slot => rankSortedSlots.push(slot))
  }
  return rankSortedSlots
}

const makeTabPanes = (
  data: GetCurrentTimeTable | null,
  selectedSlots: Array<{}>,
  updateSelectedSlots: (result: string[], dayIndex: number) => void,
  clearSelectedSlots: (selectedSlots: Array<{}>, dayIndex: number) => void,
  height: number,
  handleTempSave: (e: any, dayIndex: number) => void
) => {
  if (data) {
    if (data.GetCurrentTimeTable.timetable) {
      let dayNumbers: number[] = []
      data!.GetCurrentTimeTable.timetable!.days!.map(day => {
        dayNumbers.push(day!.dayNumber)
        return null
      })
      dayNumbers = sortDays(dayNumbers)
      const sortedDays: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null> = []
      dayNumbers.forEach(dayNumber => {
        const index = data.GetCurrentTimeTable.timetable!.days!.findIndex(
          day => day!.dayNumber === dayNumber
        )
        if (index > -1) {
          sortedDays.push(data.GetCurrentTimeTable.timetable!.days![index])
        }
      })

      if (height !== 0) {
        return sortedDays.map(day => {
          day!.slots = sortSlotsByRank(day)
          return (
            <TabPane
              tab={
                <Tab>
                  <Typography.Text strong={true}>
                    {day!.dayNumber} ({KoreanDays[sortedDays.indexOf(day)]})
                  </Typography.Text>
                </Tab>
              }
              style={{
                height: `${height}px`,
                width: "100%"
              }}
              key={String(day!.dayNumber)}
            >
              <DayView>
                <ApplyStatus
                  day={day!}
                  dayIndex={sortedDays.indexOf(day)}
                  selectedSlots={selectedSlots}
                  updateSelectedSlots={updateSelectedSlots}
                  clearSelectedSlots={clearSelectedSlots}
                  handleTempSave={handleTempSave}
                />
              </DayView>
            </TabPane>
          )
        })
      }
    }
  }
}

const checkContinue = (arr: number[], startTime: number) => {
  const minNumber: number = Math.min.apply(null, arr)
  const subDict: {} = {}
  let index: number = 0
  let gap: number = 0
  subDict[index] = []
  for (let i = 0; i < arr.length; i++) {
    const currTime: number = parseInt(String(arr[i]), 10)
    if (minNumber + gap + i !== currTime) {
      index += 1
      gap = arr[i] - (minNumber + i)
      subDict[index] = []
      subDict[index].push(String(currTime + startTime))
    } else {
      subDict[index].push(String(currTime + startTime))
    }
  }
  const subArr: Array<[]> = Object.values(subDict)
  return subArr
}

// const removeInfo = (
//   slots: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days_slots | null>,
//   dayIndex: number
// ) => {
//   const removeSelectedSlots: Array<{}> = [{}, {}, {}, {}, {}, {}, {}]
//   slots.map(slot => {
//     const startTime: number = parseInt(slot!.startTime.split(":")[0], 10)
//     const endTime: number = parseInt(slot!.endTime.split(":")[0], 10)
//     const realStartTime: number = slot!.isStartTimeNextDay
//       ? startTime + 24
//       : startTime
//     const realEndTime: number = slot!.isEndTimeNextDay
//       ? endTime + 23
//       : endTime - 1
//     if (!removeSelectedSlots[dayIndex][slot!.user.personalCode]) {
//       const timeArray: string[] = []
//       for (let i = realStartTime; i <= realEndTime; i++) {
//         timeArray.push(String(i))
//       }
//       removeSelectedSlots[dayIndex][slot!.user.personalCode] = timeArray
//     } else {
//       for (let i = realStartTime; i <= realEndTime; i++) {
//         removeSelectedSlots[dayIndex][slot!.user.personalCode].push(String(i))
//       }
//     }
//     removeSelectedSlots[dayIndex][slot!.user.personalCode].sort(
//       (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10)
//     )
//     return null
//   })
//   return removeSelectedSlots
// }

const getInfo = (
  data: GetCurrentTimeTable | null,
  selectedSlots: Array<{}>
) => {
  if (data) {
    if (data.GetCurrentTimeTable!.timetable) {
      let dayNumbers: number[] = []
      data!.GetCurrentTimeTable.timetable!.days!.map(day => {
        dayNumbers.push(day!.dayNumber)
        return null
      })

      dayNumbers = sortDays(dayNumbers)
      const sortedDays: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null> = []
      dayNumbers.forEach(dayNumber => {
        const index = data.GetCurrentTimeTable.timetable!.days!.findIndex(
          day => day!.dayNumber === dayNumber
        )
        if (index > -1) {
          sortedDays.push(data.GetCurrentTimeTable.timetable!.days![index])
        }
      })
      const dayNumberArray = sortedDays.map(day => day!.dayNumber)
      const startTimeArray = sortedDays.map(
        day => parseInt(day!.startTime, 10) / 100
      )
      const slotsArray = sortedDays.map(day => day!.slots)
      const elseInfo = slotsArray.map(daySlot => {
        return daySlot!.map(slot => [
          false,
          slot!.isEndTimeNextDay,
          slot!.isStartTimeNextDay
        ])
      })
      const userInfo = slotsArray.map(daySlot => {
        return daySlot!.map(slot => slot!.user.personalCode)
      })
      // elseInfo: 지원한 날들에 id, iFT, iETND 가 담긴 길이 3의 array들의 array들의 array
      // userInfo: 지원한 날들에 usercode가 담김 array의 array
      const selectedUser = selectedSlots.map(day => Object.keys(day))
      const selectedTime: number[][][] = selectedSlots.map(day =>
        Object.values(day)
      )
      const newSelectedTime: number[][][][] = []
      selectedTime.map(day => {
        let dividedTime: number[][][] = []
        const startTime: number = startTimeArray[selectedTime.indexOf(day)]
        day.map(
          (_, __, user) =>
            (dividedTime = user.map(time => {
              const newTime = checkContinue(time, startTime)
              return newTime
            }))
        )
        newSelectedTime.push(dividedTime)
        return null
      })
      // selectedUser: slot에채워진 순서대로의 유저들(not sorted) [][]
      // selectedTime: 유저들이 선택된 시간들(not sorted) [][][][]
      const returnArray = selectedUser.map(day => {
        const dayNumber = dayNumberArray[selectedUser.indexOf(day)]
        const timeArray = newSelectedTime[selectedUser.indexOf(day)]
        const dayUserInfo = userInfo[selectedUser.indexOf(day)]
        const dayElseInfo = elseInfo[selectedUser.indexOf(day)]
        return day.map(user => {
          const [isFullTime] = dayElseInfo[dayUserInfo.indexOf(user)]
          const isStartTimeNextDayArray: boolean[] = []
          const isEndTimeNextDayArray: boolean[] = []

          const StartEndTime: string[][] = timeArray[day.indexOf(user)].map(
            subTime => {
              subTime = subTime.map(stringTime =>
                parseInt(String(stringTime), 10)
              )
              let startTime: number = Math.min.apply(null, subTime)
              let endTime: number = Math.max.apply(null, subTime) + 1
              const isStartTimeNextDay: boolean = startTime >= 24 ? true : false
              isStartTimeNextDayArray.push(isStartTimeNextDay)
              startTime = startTime >= 24 ? startTime - 24 : startTime
              const isEndTimeNextDay: boolean = endTime >= 24 ? true : false
              isEndTimeNextDayArray.push(isEndTimeNextDay)
              endTime = endTime >= 24 ? endTime - 24 : endTime
              return [String(startTime) + "00", String(endTime) + "00"]
            }
          )

          const final = StartEndTime.map(subTime => {
            const isStartTimeNextDay: boolean =
              isStartTimeNextDayArray[StartEndTime.indexOf(subTime)]
            const isEndTimeNextDay: boolean =
              isEndTimeNextDayArray[StartEndTime.indexOf(subTime)]
            return {
              dayNumber,
              endTime: subTime[1],
              isEndTimeNextDay,
              isFulltime: isFullTime,
              isSelected: true,
              isStartTimeNextDay,
              personalCode: user,
              startTime: subTime[0]
            }
          })
          return final
        })
      })
      return returnArray
    }
  }
}

const RightWrapper = styled.div`
  width: 70%;
  min-width: 740px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const LeftWrapper = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
`

const Tab = styled.div`
  height: 100%;
`

const DayView = styled.div`
  height: 100%;
`

const StatisticsView = styled.div`
  flex: 1;
  background-color: #f1f3f4;
  padding: 2%;
`

export default EditTimeTablePresenter
