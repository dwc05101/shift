import { message } from "antd"
import moment from "moment"
import React, { ComponentProps } from "react"
import { Mutation } from "react-apollo"
import {
  CREATE_LINK,
  GET_TIMETABLE
} from "../../Components/TimeTable/TimeTableQueries"
import {
  CreateLink,
  CreateLinkVariables,
  CreateTimeTable,
  CreateTimeTableVariables,
  TimeTableDay
} from "../../types/api"
import MakeTimeTablePresenter from "./MakeTimeTablePresenter"
import { MAKE_TIMETABLE } from "./MakeTimeTableQueries"

interface IState {
  thisWeekTimeTableDays: TimeTableDay[]
  nextWeekTimeTableDays: TimeTableDay[]
  sameTableDay: TimeTableDay
  week: string
  checked: boolean
  timetableId: number
  loading: boolean
}

class CreateLinkMutation extends Mutation<CreateLink, CreateLinkVariables> {}

class MakeTimeTableMutation extends Mutation<
  CreateTimeTable,
  CreateTimeTableVariables
> {}

class MakeTimeTableContainer extends React.Component<
  ComponentProps<any>,
  IState
> {
  public mutationFn
  public linkMutationFn

  public constructor(props: ComponentProps<any>) {
    super(props)

    const thisWeekTimeTableDays: TimeTableDay[] = []
    const nextWeekTimeTableDays: TimeTableDay[] = []
    for (let i = 0; i < 7; i++) {
      const dayNumberThisWeek = moment()
        .startOf("isoWeek")
        .add(i, "days")
        .date()
      const dayNumberNextWeek = moment()
        .startOf("isoWeek")
        .add(1, "weeks")
        .add(i, "days")
        .date()
      thisWeekTimeTableDays.push({
        dayNumber: dayNumberThisWeek,
        endTime: "",
        isEndTimeNextDay: false,
        startTime: ""
      })
      nextWeekTimeTableDays.push({
        dayNumber: dayNumberNextWeek,
        endTime: "",
        isEndTimeNextDay: false,
        startTime: ""
      })
    }

    this.state = {
      checked: true,
      loading: false,
      nextWeekTimeTableDays,
      sameTableDay: {
        dayNumber: -1,
        endTime: "",
        isEndTimeNextDay: false,
        startTime: ""
      },
      thisWeekTimeTableDays,
      timetableId: -1,
      week: "다음주"
    }
  }

  public render() {
    const {
      thisWeekTimeTableDays,
      nextWeekTimeTableDays,
      sameTableDay,
      week,
      checked,
      loading
    } = this.state
    return (
      <MakeTimeTableMutation
        mutation={MAKE_TIMETABLE}
        variables={{
          days:
            week === "다음주" ? nextWeekTimeTableDays : thisWeekTimeTableDays,
          yearMonthWeek:
            week === "다음주" ? nextWeekyearMonthWeek : thisWeekyearMonthWeek
        }}
        onCompleted={data => {
          if (data.CreateTimeTable.ok) {
            this.setState({
              timetableId: data.CreateTimeTable.timetableId!
            })
          } else if (data.CreateTimeTable.error) {
            message.error("시간표가 이미 존재합니다.")
          } else {
            message.error("서버 내부 오류: 시간표 생성")
            return
          }
        }}
      >
        {mutation => {
          this.mutationFn = mutation
          return (
            <CreateLinkMutation
              mutation={CREATE_LINK}
              variables={{ timetableId: this.state.timetableId }}
              onCompleted={data => {
                if (data.CreateLink.ok) {
                  message.success(
                    "시간표가 생성되었습니다! 잠시후 대시보드로 이동합니다..."
                  )
                  // setTimeout(() => {
                  //   window.location.pathname = "/shift/dashboard"
                  // }, 2000)
                } else {
                  message.error("서버 내부 오류: 링크 발급 실패")
                }
              }}
              refetchQueries={[{ query: GET_TIMETABLE }]}
            >
              {linkMutation => {
                this.linkMutationFn = linkMutation
                return (
                  <MakeTimeTablePresenter
                    thisWeekTimeTableDays={thisWeekTimeTableDays}
                    nextWeekTimeTableDays={nextWeekTimeTableDays}
                    sameTableDay={sameTableDay}
                    onSubmit={this.onSubmit}
                    loading={loading}
                    week={week}
                    onChangeWeek={this.onChangeWeek}
                    checked={checked}
                    onSwitch={this.onSwitch}
                    thisWeekString={thisWeekString}
                    nextWeekString={nextWeekString}
                    changeSameTableDayStartTime={
                      this.changeSameTableDayStartTime
                    }
                    changeSameTableDayEndTime={this.changeSameTableDayEndTime}
                    changeSameTableDayNextDay={this.changeSameTableDayNextDay}
                    changeNextWeekTableDaysStartTime={
                      this.changeNextWeekTableDaysStartTime
                    }
                    changeNextWeekTableDaysEndTime={
                      this.changeNextWeekTableDaysEndTime
                    }
                    changeNextWeekTableDaysNextDay={
                      this.changeNextWeekTableDaysNextDay
                    }
                    changeThisWeekTableDaysStartTime={
                      this.changeThisWeekTableDaysStartTime
                    }
                    changeThisWeekTableDaysEndTime={
                      this.changeThisWeekTableDaysEndTime
                    }
                    changeThisWeekTableDaysNextDay={
                      this.changeThisWeekTableDaysNextDay
                    }
                  />
                )
              }}
            </CreateLinkMutation>
          )
        }}
      </MakeTimeTableMutation>
    )
  }

  public onChangeWeek = (value: string): void => {
    this.setState({
      week: value
    })
  }

  public onSwitch = (): void => {
    this.setState({
      checked: !this.state.checked
    })
  }

  public onSubmit = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): Promise<void> => {
    event.preventDefault()

    if (this.state.checked) {
      this.setTableFromSameTableDay()
    }
    if (!this.isTimeTableValid()) {
      message.error("시간대를 모두 입력해주세요.")
      return
    }
    console.log(this.state.nextWeekTimeTableDays)
    await this.setState({
      loading: true
    })
    await this.mutationFn()
    await this.linkMutationFn()
    this.setState({
      loading: false
    })
  }

  public setTableFromSameTableDay = (): void => {
    const {
      sameTableDay,
      nextWeekTimeTableDays,
      thisWeekTimeTableDays,
      week
    } = this.state

    if (week === "다음주") {
      nextWeekTimeTableDays.forEach(day => {
        day.startTime = sameTableDay.startTime
        day.endTime = sameTableDay.endTime
        day.isEndTimeNextDay = sameTableDay.isEndTimeNextDay
      })
      this.setState({ nextWeekTimeTableDays })
    } else {
      thisWeekTimeTableDays.forEach(day => {
        day.startTime = sameTableDay.startTime
        day.endTime = sameTableDay.endTime
        day.isEndTimeNextDay = sameTableDay.isEndTimeNextDay
      })
      this.setState({ thisWeekTimeTableDays })
    }
  }

  public isTimeTableValid = (): boolean => {
    const { nextWeekTimeTableDays, thisWeekTimeTableDays, week } = this.state
    let valid = true
    if (week === "다음주") {
      nextWeekTimeTableDays.forEach(day => {
        if (day.startTime === "" || day.endTime === "") {
          valid = false
        }
      })
      return valid
    } else {
      thisWeekTimeTableDays.forEach(day => {
        if (day.startTime === "" || day.endTime === "") {
          valid = false
        }
      })
      return valid
    }
  }

  public changeSameTableDayStartTime = (value: string) => {
    const sameTableDay = this.state.sameTableDay
    sameTableDay.startTime = value
    this.setState({
      sameTableDay
    })
  }

  public changeSameTableDayEndTime = (value: string) => {
    const sameTableDay = this.state.sameTableDay
    sameTableDay.endTime = value
    this.setState({
      sameTableDay
    })
  }

  public changeSameTableDayNextDay = (value: boolean) => {
    const sameTableDay = this.state.sameTableDay
    sameTableDay.isEndTimeNextDay = value
    this.setState({
      sameTableDay
    })
  }

  public changeNextWeekTableDaysStartTime = (index: number, value: string) => {
    const { nextWeekTimeTableDays } = this.state
    nextWeekTimeTableDays[index].startTime = value
    this.setState({
      nextWeekTimeTableDays
    })
  }

  public changeNextWeekTableDaysEndTime = (index: number, value: string) => {
    const { nextWeekTimeTableDays } = this.state
    nextWeekTimeTableDays[index].endTime = value
    this.setState({
      nextWeekTimeTableDays
    })
  }

  public changeNextWeekTableDaysNextDay = (index: number, value: boolean) => {
    const { nextWeekTimeTableDays } = this.state
    nextWeekTimeTableDays[index].isEndTimeNextDay = value
    this.setState({
      nextWeekTimeTableDays
    })
  }

  public changeThisWeekTableDaysStartTime = (index: number, value: string) => {
    const { thisWeekTimeTableDays } = this.state
    thisWeekTimeTableDays[index].startTime = value
    this.setState({
      thisWeekTimeTableDays
    })
  }

  public changeThisWeekTableDaysEndTime = (index: number, value: string) => {
    const { thisWeekTimeTableDays } = this.state
    thisWeekTimeTableDays[index].endTime = value
    this.setState({
      thisWeekTimeTableDays
    })
  }

  public changeThisWeekTableDaysNextDay = (index: number, value: boolean) => {
    const { thisWeekTimeTableDays } = this.state
    thisWeekTimeTableDays[index].isEndTimeNextDay = value
    this.setState({
      thisWeekTimeTableDays
    })
  }
}

const thisWeekString = `
${moment()
  .startOf("isoWeek")
  .year()}년 
${moment()
  .startOf("isoWeek")
  .month() + 1}월 
  ${moment()
    .startOf("isoWeek")
    .date()}일 - 
  ${moment()
    .endOf("isoWeek")
    .year()}년
  ${moment()
    .endOf("isoWeek")
    .month() + 1}월 
  ${moment()
    .endOf("isoWeek")
    .date()}일`

const nextWeekString = `${moment()
  .add(1, "weeks")
  .startOf("isoWeek")
  .year()}년
    ${moment()
      .add(1, "weeks")
      .startOf("isoWeek")
      .month() + 1}월
  ${moment()
    .add(1, "weeks")
    .startOf("isoWeek")
    .date()}일 - 
  ${moment()
    .add(1, "weeks")
    .endOf("isoWeek")
    .year()}년 
  ${moment()
    .add(1, "weeks")
    .endOf("isoWeek")
    .month() + 1}월 
  ${moment()
    .add(1, "weeks")
    .endOf("isoWeek")
    .date()}일`

const thisWeekyearMonthWeek = `${moment()
  .startOf("isoWeek")
  .year()}${moment()
  .startOf("isoWeek")
  .week()}`

const nextWeekyearMonthWeek = `${moment()
  .add(1, "weeks")
  .startOf("isoWeek")
  .year()}${moment()
  .add(1, "weeks")
  .startOf("isoWeek")
  .week()}`

export default MakeTimeTableContainer
