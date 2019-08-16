import { message } from "antd"
import React from "react"
import { Mutation, Query } from "react-apollo"
import {
  CreateSlot,
  CreateSlotVariables,
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables,
  SlotInfo
} from "../../types/api"
import { GET_TIMETABLE } from "../TimeTable/TimeTableQueries"
import MakeSlotPresenter from "./MakeSlotPresenter"
import { CREATE_SLOT } from "./MakeSlotQueries"

interface IProps {
  organizationId: number
  personalCode: string
  slots: any[]
  timetableId: number
}

interface IState {
  dayNumbers: number[]
  organizationId: number
  timetableId: number
  slots: SlotInfo[]
  slotTabArray: SlotInfo[][]
  personalCode: string
  data: GetCurrentTimeTable | undefined
  done: boolean
}

class GetTimeTableQuery extends Query<
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables
> {}

class CreateSlotMutation extends Mutation<CreateSlot, CreateSlotVariables> {}

class MakeSlotContainer extends React.Component<IProps, IState> {
  public mutationFn

  public constructor(props) {
    super(props)

    this.state = {
      data: undefined,
      dayNumbers: [],
      done: false,
      organizationId: this.props.organizationId,
      personalCode: this.props.personalCode,
      slotTabArray: [[], [], [], [], [], [], []],
      slots: [],
      timetableId: this.props.timetableId
    }
  }

  public render() {
    const {
      organizationId,
      timetableId,
      slotTabArray,
      personalCode,
      dayNumbers,
      slots,
      done
    } = this.state
    return (
      <GetTimeTableQuery
        query={GET_TIMETABLE}
        variables={{
          organizationId,
          timetableId
        }}
        onCompleted={data => {
          this.setState({
            data
          })
          this.setDayNumbers(data)
          this.parseSlotProps()
        }}
      >
        {({ data, loading }) => {
          return (
            <CreateSlotMutation
              mutation={CREATE_SLOT}
              variables={{ organizationId, timetableId, slots, personalCode }}
              onCompleted={response => {
                if (response.CreateSlot.ok) {
                  this.setState({
                    done: true
                  })
                } else if (response.CreateSlot.error) {
                  message.error(
                    "에러가 발생했습니다 : " + response.CreateSlot.error
                  )
                } else {
                  message.error("서버 내부 에러")
                }
              }}
            >
              {mutation => {
                this.mutationFn = mutation
                return (
                  <MakeSlotPresenter
                    data={data}
                    loading={loading}
                    slotTabArray={slotTabArray}
                    onClickAddButton={this.onClickAddButton}
                    onClickDeleteButton={this.onClickDeleteButton}
                    dayNumbers={dayNumbers}
                    onSubmit={this.onSubmit}
                    done={done}
                    personalCode={personalCode}
                    handleFulltime={this.handleFulltime}
                    setSlotStartTime={this.setSlotStartTime}
                    setSlotEndTime={this.setSlotEndTime}
                    setSlotIsEndTimeNextDay={this.setSlotIsEndTimeNextDay}
                    setSlotIsStartTimeNextDay={this.setSlotIsStartTimeNextDay}
                  />
                )
              }}
            </CreateSlotMutation>
          )
        }}
      </GetTimeTableQuery>
    )
  }

  public parseSlotProps = () => {
    const { slotTabArray, dayNumbers } = this.state
    const propSlots = this.props.slots
    for (const slot of propSlots) {
      const index = dayNumbers.findIndex(
        dayNumber => slot.day.dayNumber === dayNumber
      )
      if (index > -1) {
        const newSlot: SlotInfo = {
          dayNumber: dayNumbers[index],
          endTime: slot.endTime,
          isEndTimeNextDay: slot.isEndTimeNextDay,
          isFulltime: slot.isFulltime,
          isStartTimeNextDay: slot.isStartTimeNextDay,
          startTime: slot.startTime
        }
        slotTabArray[index].push(newSlot)
      }
    }

    this.setState({ slotTabArray })
  }

  public setDayNumbers = (data: GetCurrentTimeTable) => {
    const { dayNumbers } = this.state
    if (data.GetCurrentTimeTable.ok) {
      data.GetCurrentTimeTable.timetable!.days!.map(day => {
        dayNumbers.push(day!.dayNumber)
        return null
      })
    } else {
      message.error("시간표가 존재하지 않습니다.")
    }
    dayNumbers.sort((a, b) => a - b)
    this.setState({ dayNumbers })
  }

  public onClickAddButton = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const index = parseInt(e.currentTarget.id, 10)
    const { slotTabArray, dayNumbers } = this.state
    const newSlot: SlotInfo = {
      dayNumber: dayNumbers[index],
      endTime: "",
      isEndTimeNextDay: false,
      isFulltime: false,
      isStartTimeNextDay: false,
      startTime: ""
    }

    slotTabArray[index].push(newSlot)

    this.setState({
      slotTabArray
    })
  }

  public onClickDeleteButton = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    const { slotTabArray } = this.state
    const indexArray = e.currentTarget.id.split("/")

    slotTabArray[indexArray[0]].splice(indexArray[1], 1)

    this.setState({
      slotTabArray
    })
  }

  public handleFulltime = e => {
    const { slotTabArray } = this.state
    const indexArray = e.target.id.split("/")

    slotTabArray[indexArray[0]][indexArray[1]].isFulltime = e.target.checked

    this.setState({ slotTabArray })
  }

  public setSlotStartTime = (
    startTime: string,
    dayIndex: number,
    slotIndex: number
  ) => {
    const { slotTabArray } = this.state
    slotTabArray[dayIndex][slotIndex].startTime = startTime

    this.setState({ slotTabArray })
  }

  public setSlotEndTime = (
    endTime: string,
    dayIndex: number,
    slotIndex: number
  ) => {
    const { slotTabArray } = this.state
    slotTabArray[dayIndex][slotIndex].endTime = endTime

    this.setState({ slotTabArray })
  }

  public setSlotIsEndTimeNextDay = e => {
    const { slotTabArray } = this.state
    const indexArray = e.target.id.split("/")

    slotTabArray[indexArray[0]][indexArray[1]].isEndTimeNextDay =
      e.target.checked

    slotTabArray[indexArray[0]][indexArray[1]].endTime = ""

    this.setState({ slotTabArray })
  }

  public setSlotIsStartTimeNextDay = e => {
    const { slotTabArray } = this.state
    const indexArray = e.target.id.split("/")

    slotTabArray[indexArray[0]][indexArray[1]].isStartTimeNextDay =
      e.target.checked
    slotTabArray[indexArray[0]][indexArray[1]].startTime = ""

    this.setState({ slotTabArray })
  }

  public onSubmit = async e => {
    e.preventDefault()
    const { personalCode } = this.state

    if (personalCode === "") {
      message.error("개인번호를 선택해주세요.")
      return
    }

    const done = await this.parseSlotsIfValid()

    if (!done) {
      return
    }

    this.mutationFn()
  }

  public parseSlotsIfValid = async () => {
    const { slotTabArray } = this.state
    const submitSlots: SlotInfo[] = []

    let success = true

    for (const slots of slotTabArray) {
      for (const slot of slots) {
        if (this.isSlotValid(slot)) {
          submitSlots.push(slot)
        } else {
          success = false
        }
      }
    }

    if (success) {
      await this.setState({
        slots: submitSlots
      })
      return true
    } else {
      return false
    }
  }

  public isSlotValid = (slot: SlotInfo) => {
    const { data } = this.state
    const dayOfSlot = data!.GetCurrentTimeTable.timetable!.days!.find(
      day => day!.dayNumber === slot.dayNumber
    )

    if (dayOfSlot) {
      if (slot.isFulltime) {
        return true
      }

      if (slot.startTime === "" || slot.endTime === "") {
        message.error(`${slot.dayNumber}일의 모든 시간대를 입력해 주세요.`)
        return false
      }

      if (!slot.isStartTimeNextDay) {
        if (parseInt(dayOfSlot.startTime, 10) > parseInt(slot.startTime, 10)) {
          message.error(
            `${slot.dayNumber}일 근무 시작시간은 개점시간보다 늦어야 합니다.`
          )
          return false
        }
      }

      if (dayOfSlot.isEndTimeNextDay === slot.isEndTimeNextDay) {
        if (parseInt(dayOfSlot.endTime, 10) < parseInt(slot.endTime, 10)) {
          message.error(
            `${slot.dayNumber}일 근무 종료시간은 폐점시간보다 일러야 합니다.`
          )
          return false
        }
      }

      if (slot.isEndTimeNextDay === slot.isStartTimeNextDay) {
        if (parseInt(slot.startTime, 10) >= parseInt(slot.endTime, 10)) {
          message.error(
            `${
              slot.dayNumber
            }일 근무 종료시간은 근무 시작시간보다 늦어야 합니다.`
          )
          return false
        }
      }

      if (slot.isStartTimeNextDay && !slot.isEndTimeNextDay) {
        message.error(
          `${slot.dayNumber}일 근무 종료시간은 근무 시작시간보다 늦어야 합니다.`
        )
        return false
      }

      return true
    } else {
      message.error(`입력정보가 잘못되었습니다.`)
      return false
    }
  }
}

export default MakeSlotContainer
