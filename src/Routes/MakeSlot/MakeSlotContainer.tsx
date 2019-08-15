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
  dayNumbers: number[]
  organizationId: number
  timetableId: number
  slots: SlotInfo[]
  slotTabArray: SlotInfo[][]
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
      dayNumbers: [],
      organizationId: parseInt(this.props.match.params.organizationId, 10),
      personalCode: "",
      slotTabArray: [[], [], [], [], [], [], []],
      slots: [],
      timetableId: parseInt(this.props.match.params.timetableId, 10)
    }
  }

  public render() {
    const {
      organizationId,
      timetableId,
      slotTabArray,
      personalCode,
      dayNumbers,
      slots
    } = this.state
    return (
      <GetTimeTableQuery
        query={GET_TIMETABLE}
        variables={{
          organizationId,
          timetableId
        }}
        onCompleted={data => {
          this.setDayNumbers(data)
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
                    loading={loading}
                    slotTabArray={slotTabArray}
                    onClickAddButton={this.onClickAddButton}
                    onClickDeleteButton={this.onClickDeleteButton}
                    dayNumbers={dayNumbers}
                    onSubmit={this.onSubmit}
                    handleSelect={this.handleSelect}
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
    console.log(dayNumbers)
    this.setState({ dayNumbers })
  }

  public handleSelect = value => {
    this.setState({
      personalCode: value
    })
  }

  public onClickAddButton = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.log(e.currentTarget.id)
    const index = parseInt(e.currentTarget.id, 10)
    const { slotTabArray, dayNumbers } = this.state
    const newSlot: SlotInfo = {
      dayNumber: dayNumbers[index],
      endTime: "",
      isFulltime: false,
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

  public onSubmit = async e => {
    e.preventDefault()
    const { personalCode, slotTabArray } = this.state

    if (personalCode === "") {
      message.error("개인번호를 선택해주세요.")
      return
    }

    const submitSlots: SlotInfo[] = []

    for (const slots of slotTabArray) {
      for (const slot of slots) {
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
