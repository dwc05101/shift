import { Tabs } from "antd"
import React from "react"
import styled from "styled-components"
import Loading from "../../Components/Loading"
import { Container, Content, InnerShadowedBox } from "../../styledComponents"
import { GetCurrentTimeTable } from "../../types/api"
import KoreanDays from "../../utils/KoreanDays"

interface IProps {
  data: GetCurrentTimeTable | undefined
  loading: boolean
}

const { TabPane } = Tabs

const MakeTimeTablePresenter: React.SFC<IProps> = ({ data, loading }) =>
  loading ? (
    <Loading />
  ) : (
    <Container>
      <Content>
        <InnerShadowedBox>
          <Wrapper>
            <Header>
              <Tabs
                onChange={e => console.log(e)}
                type="line"
                tabBarStyle={{
                  display: "flex",
                  margin: "0"
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%"
                }}
              >
                {makeTabs(data!)}
              </Tabs>
            </Header>
          </Wrapper>
        </InnerShadowedBox>
      </Content>
    </Container>
  )

const makeTabs = (data: GetCurrentTimeTable | null) => {
  if (data) {
    if (data.GetCurrentTimeTable.timetable) {
      const sortedTimeTable = data.GetCurrentTimeTable.timetable.days!.sort(
        (a, b) => {
          return a!.dayNumber - b!.dayNumber
        }
      )
      return sortedTimeTable.map(day => {
        return (
          <TabPane
            tab={
              <Tab>
                {day!.dayNumber} ({KoreanDays[sortedTimeTable.indexOf(day)]})
              </Tab>
            }
            style={{ backgroundColor: "red" }}
            key={String(day!.dayNumber)}
          />
        )
      })
    }
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 10%;
`

// const Body = styled.div`
//   width: 100%;
//   height: 90%;
// `

const Tab = styled.div`
  flex: 1 1 0;
`

export default MakeTimeTablePresenter
