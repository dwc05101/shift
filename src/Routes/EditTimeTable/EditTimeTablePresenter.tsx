import React from "react"
import { GetDays } from "../../types/api"
import { Container, InnerShadowedBox, Content } from "../../styledComponents"
import Loading from "../../Components/Loading"
import ApplyStatus from "../../Components/ApplyStatus"
import Statistics from "../../Components/Statistics"
import styled from "styled-components"

interface IProps {
  data: GetDays | undefined
  loading: boolean
}

const EditTimeTablePresenter: React.SFC<IProps> = ({ data, loading }) => {
  const sortedDays = sortDays(data)
  return (
    <Container>
      <Content>
        <InnerShadowedBox>
          {loading ? (
            <Loading />
          ) : (
            <>
              <DayView>
                <ApplyStatus day={sortedDays[0]} />
              </DayView>

              <StatisticsView>
                <Statistics />
              </StatisticsView>
            </>
          )}
        </InnerShadowedBox>
      </Content>
    </Container>
  )
}
const sortDays = data => {
  if (data.GetDays) {
    const days = data.GetDays.days || []
    const sortedDays = days.sort((a, b) => a.dayNumber - b.dayNumber)
    console.log("sortedDays", sortedDays)
    return sortedDays
  } else return []
}

const DayView = styled.div`
  flex: 3;
`
const StatisticsView = styled.div`
  flex: 1;
  background-color: #f1f3f4;
  padding: 2%;
`

export default EditTimeTablePresenter
