import { message } from "antd"
import React from "react"
import { Mutation, Query } from "react-apollo"
import { RouteComponentProps } from "react-router-dom"
import { GET_TIMETABLE } from "../../Components/TimeTable/TimeTableQueries"
import {
  CreateSlot,
  CreateSlotVariables,
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables,
  SlotInfo
} from "../../types/api"
import MakeSlotPresenter from "./MakeSlotPresenter"
import { CREATE_SLOT } from "./MakeSlotQueries"

interface IMatchParams {
  organizationId: string
  timetableId: string
}

interface IState {
  organizationId: number
  timetableId: number
  slots: SlotInfo[]
  selectedDays: boolean[]
  fullTimeDays: boolean[]
  personalCode: string
}

class GetTimeTableQuery extends Query<
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables
> {}

class CreateSlotMutation extends Mutation<CreateSlot, CreateSlotVariables> {}

class MakeSlotContainer extends React.Component<
  RouteComponentProps<IMatchParams>,
  IState
> {
  public mutationFn

  public constructor(props) {
    super(props)

    this.state = {
      fullTimeDays: [false, false, false, false, false, false, false],
      organizationId: parseInt(this.props.match.params.organizationId, 10),
      personalCode: "",
      selectedDays: [false, false, false, false, false, false, false],
      slots: [],
      timetableId: parseInt(this.props.match.params.timetableId, 10)
    }
  }

  public render() {
    const {
      organizationId,
      timetableId,
      slots,
      personalCode,
      selectedDays,
      fullTimeDays
    } = this.state
    return (
      <GetTimeTableQuery
        query={GET_TIMETABLE}
        variables={{
          organizationId,
          timetableId
        }}
        onCompleted={data => {
          this.setSlots(data)
        }}
      >
        {({ data, loading }) => {
          return (
            <CreateSlotMutation
              mutation={CREATE_SLOT}
              variables={{ organizationId, timetableId, slots, personalCode }}
              onCompleted={response => {
                if (response.CreateSlot.ok) {
                  message.success("제출되었습니다!")
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
                    selectedDays={selectedDays}
                    fullTimeDays={fullTimeDays}
                    loading={loading}
                    onSubmit={this.onSubmit}
                    handleSelect={this.handleSelect}
                    handleCheckboxChange={this.handleCheckboxChange}
                    handleFulltime={this.handleFulltime}
                    setSlotStartTime={this.setSlotStartTime}
                    setSlotEndTime={this.setSlotEndTime}
                  />
                )
              }}
            </CreateSlotMutation>
          )
        }}
      </GetTimeTableQuery>
    )
  }

  public setSlots = (data: GetCurrentTimeTable) => {
    const slots: SlotInfo[] = []
    if (data.GetCurrentTimeTable.ok) {
      data.GetCurrentTimeTable.timetable!.days!.map(day => {
        const newSlot: SlotInfo = {
          dayNumber: day!.dayNumber,
          endTime: "",
          isFulltime: false,
          startTime: ""
        }
        slots.push(newSlot)
        return null
      })
    } else {
      message.error("시간표가 존재하지 않습니다.")
    }
    slots.sort((a, b) => a.dayNumber - b.dayNumber)
    this.setState({ slots })
  }

  public handleSelect = value => {
    this.setState({
      personalCode: value
    })
    console.log(this.state.personalCode)
  }

  public handleCheckboxChange = e => {
    const { selectedDays } = this.state
    const index = parseInt(e.target.id, 10)

    selectedDays[index] = e.target.checked

    this.setState({ selectedDays })
  }

  public handleFulltime = e => {
    const { fullTimeDays } = this.state
    const index = parseInt(e.target.id, 10)
    fullTimeDays[index] = e.target.checked
    this.setState({ fullTimeDays })
  }

  public setSlotStartTime = (startTime: string, index: number) => {
    const slots: SlotInfo[] = this.state.slots
    slots[index].startTime = startTime

    console.log(slots)
    this.setState({ slots })
  }

  public setSlotEndTime = (endTime: string, index: number) => {
    const slots: SlotInfo[] = this.state.slots
    slots[index].endTime = endTime

    this.setState({ slots })
  }

  public onSubmit = async e => {
    e.preventDefault()
    const { slots, fullTimeDays, personalCode } = this.state

    if (personalCode === "") {
      message.error("개인번호를 선택해주세요.")
      return
    }

    const submitSlots: SlotInfo[] = []

    for (const checked of fullTimeDays) {
      if (checked) {
        slots[fullTimeDays.indexOf(checked)].isFulltime = true
      }
    }

    for (const slot of slots) {
      if (slot.startTime !== "" || slot.isFulltime) {
        submitSlots.push(slot)
      }
    }

    await this.setState({
      slots: submitSlots
    })
    this.mutationFn()
  }
}

export default MakeSlotContainer
