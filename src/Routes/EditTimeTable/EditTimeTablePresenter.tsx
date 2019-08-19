import { Tabs, Typography } from "antd"
import React, { ComponentProps } from "react"
import { Mutation } from "react-apollo"
import styled from "styled-components"
import ApplyStatus from "../../Components/ApplyStatus"
import { CREATE_SLOT } from "../../Components/ApplyStatus/ApplyStatusQueries"
import Loading from "../../Components/Loading"
import Statistics from "../../Components/Statistics"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"
import {
  CreateSlot,
  CreateSlotVariables,
  GetCurrentTimeTable
} from "../../types/api"
import KoreanDays from "../../utils/KoreanDays"

interface IProps {
  data: GetCurrentTimeTable | undefined
  loading: boolean
  timetableId: number
}

interface IState {
  height: number
  selectedSlots: Array<{}>
}

class CreateSlotMutation extends Mutation<CreateSlot, CreateSlotVariables> {}

const { TabPane } = Tabs

class EditTimeTablePresenter extends React.Component<IProps, IState> {
  public state = {
    height: 0,
    selectedSlots: [{}, {}, {}, {}, {}, {}, {}]
  }

  private height = React.createRef<HTMLDivElement>()

  public clearSelectedSlots = (selectedSlots: Array<{}>, dayIndex: number) => {
    selectedSlots[dayIndex] = {}
    this.setState({ selectedSlots })
  }

  public updateSelectedSlots = (result: string[], dayIndex: number) => {
    const selectedSlots: Array<{}> = this.state.selectedSlots
    const newSelectedSlot = {}

    result.map(res => {
      const user: string = res.split("-")[0]
      const timeIndex: string = res.split("-")[1]
      if (!newSelectedSlot[user]) {
        newSelectedSlot[user] = [timeIndex]
      } else {
        newSelectedSlot[user].push(timeIndex)
      }
      newSelectedSlot[user].sort((a: any, b: any) => {
        return parseInt(a, 10) - parseInt(b, 10)
      })
    })
    selectedSlots[dayIndex] = newSelectedSlot

    this.setState({ selectedSlots })
  }

  public componentDidUpdate() {
    if (this.height.current!.clientHeight * 0.9 !== this.state.height) {
      this.setState({ height: this.height.current!.clientHeight * 0.9 })
    }
  }

  public render() {
    const { data, loading, timetableId } = this.props
    const { height, selectedSlots } = this.state
    return (
      // <CreateSlotMutation
      //   mutation={CREATE_SLOT}
      //   varialbes={{ slots, psersonalCode, timetableId }}
      //   refetchQueries={[{ query: GET_SLOTS }]}
      // >
      //   {mutation => {
      loading ? (
        <Loading />
      ) : (
        <Container>
          <Content>
            <InnerShadowedBox>
              <RightWrapper>
                <Tabs
                  onChange={e => console.log(e)}
                  type="line"
                  tabBarStyle={{
                    border: "0",
                    height: "10%",
                    margin: "0"
                  }}
                >
                  {makeTabs(
                    data!,
                    selectedSlots,
                    this.updateSelectedSlots,
                    this.clearSelectedSlots,
                    height
                  )}
                  {getInfo(data!, selectedSlots)}
                </Tabs>
              </RightWrapper>
              <LeftWrapper ref={this.height}>
                <StatisticsView>
                  <Statistics />
                </StatisticsView>
              </LeftWrapper>
            </InnerShadowedBox>
          </Content>
        </Container>
      )
      // }}
      // </CreateSlotMutation>
    )
  }
}

const makeTabs = (
  data: GetCurrentTimeTable | null,
  selectedSlots: Array<{}>,
  updateSelectedSlots: (result: string[], dayIndex: number) => void,
  clearSelectedSlots: (selectedSlots: Array<{}>, dayIndex: number) => void,
  height: number
) => {
  if (data) {
    if (data.GetCurrentTimeTable.timetable) {
      const sortedTimeTable = data.GetCurrentTimeTable.timetable.days!.sort(
        (a, b) => {
          return a!.dayNumber - b!.dayNumber
        }
      )
      if (height !== 0) {
        return sortedTimeTable.map(day => {
          return (
            <TabPane
              tab={
                <Tab>
                  <Typography.Text strong={true}>
                    {day!.dayNumber} ({KoreanDays[sortedTimeTable.indexOf(day)]}
                    )
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
                  dayIndex={sortedTimeTable.indexOf(day)}
                  selectedSlots={selectedSlots}
                  updateSelectedSlots={updateSelectedSlots}
                  clearSelectedSlots={clearSelectedSlots}
                />
              </DayView>
            </TabPane>
          )
        })
      }
    }
  }
}

const getInfo = (
  data: GetCurrentTimeTable | null,
  selectedSlots: Array<{}>
) => {
  if (data) {
    if (data.GetCurrentTimeTable.timetable) {
      const sortedTimeTable = data.GetCurrentTimeTable.timetable.days!.sort(
        (a, b) => {
          return a!.dayNumber - b!.dayNumber
        }
      )
      const dayNumberArray = sortedTimeTable.map(day => day!.dayNumber)
      const slotsArray = sortedTimeTable.map(day => day!.slots)
      const elseUserArray = slotsArray.map(daySlot => {
        return daySlot!.map(slot => [
          slot!.id,
          slot!.isFulltime,
          slot!.isEndTimeNextDay,
          slot!.isStartTimeNextDay
        ])
      })
      const UserArray = slotsArray.map(daySlot => {
        return daySlot!.map(slot => slot!.user.personalCode)
      })
      const selectedUserArray = selectedSlots.map(day => Object.keys(day))
      const selectedTimeArray = selectedSlots.map(day => {
        const unSorted = Object.values(day)
        return unSorted.sort((a: any, b: any) => {
          return a - b
        })
      })
      const returnArray = selectedUserArray.map(dayArray => {
        const timeArray = selectedTimeArray[selectedUserArray.indexOf(dayArray)]
        const dayUserArray = UserArray[selectedUserArray.indexOf(dayArray)]
        const dayElseUserArray =
          elseUserArray[selectedUserArray.indexOf(dayArray)]

        return dayArray.map(user => {
          const [
            id,
            isFulltime,
            isEndTimeNextDay,
            isStartTimeNextDay
          ] = dayElseUserArray[dayUserArray.indexOf(user)]
          return [
            user,
            timeArray[dayArray.indexOf(user)],
            id,
            isFulltime,
            isEndTimeNextDay,
            isStartTimeNextDay
          ]
        })
      })
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
