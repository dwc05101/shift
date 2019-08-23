import { Tabs, Typography } from "antd"
import React from "react"
import styled from "styled-components"
import ApplyStatus from "../../Components/ApplyStatus"
import Loading from "../../Components/Loading"
import Statistics from "../../Components/Statistics"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"
import { GetCurrentTimeTable } from "../../types/api"
import KoreanDays from "../../utils/KoreanDays"

interface IProps {
  data: GetCurrentTimeTable | undefined
  loading: boolean
}

const { TabPane } = Tabs

const EditTimeTablePresenter: React.SFC<IProps> = ({ data, loading }) => {
  if (!loading) console.log(data!.GetCurrentTimeTable.timetable!.yearMonthWeek)
  return loading ? (
    <Loading />
  ) : (
    <Container>
      <Content>
        <InnerShadowedBox>
          <RightWrapper>
            <Tabs
              onChange={e => console.log(e)}
              size="small"
              type="line"
              tabBarStyle={{
                margin: "0",
                height: "10%",
                border: "0"
              }}
              style={{ height: "100%" }}
            >
              {makeTabs(data!)}
            </Tabs>
          </RightWrapper>
          <LeftWrapper>
            <StatisticsView>
              <Statistics days={data!.GetCurrentTimeTable.timetable!.days} />
            </StatisticsView>
          </LeftWrapper>
        </InnerShadowedBox>
      </Content>
    </Container>
  )
}

const makeTabs = (data: GetCurrentTimeTable | null) => {
  if (data) {
    if (data.GetCurrentTimeTable.timetable) {
      const sortedTimeTable = data.GetCurrentTimeTable.timetable.days!.sort(
        (a, b) => {
          return a!.id - b!.id
        }
      )
      return sortedTimeTable.map(day => {
        return (
          <TabPane
            tab={
              <Tab>
                <Text>
                  {day!.dayNumber} ({KoreanDays[sortedTimeTable.indexOf(day)]})
                </Text>
              </Tab>
            }
            style={{
              width: "100%",
              height: "calc(90%)"
            }}
            key={String(day!.dayNumber)}
          >
            <DayView>
              <ApplyStatus day={day!} dayIndex={sortedTimeTable.indexOf(day)} />
            </DayView>
          </TabPane>
        )
      })
    }
  }
}

const RightWrapper = styled.div`
  width: 60%;
  min-width: 740px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const LeftWrapper = styled.div`
  width: 40%;
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
  flex: 3;
`

const StatisticsView = styled.div`
  flex: 1;
  background-color: #f1f3f4;
  padding: 2%;
`
const Text = styled.div``

export default EditTimeTablePresenter
