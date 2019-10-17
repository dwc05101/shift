import moment from "moment"
import React from "react"
import { Query } from "react-apollo"
import { GET_TIMETABLE } from "../../Components/TimeTable/TimeTableQueries"
import { GET_USERS } from "../../GlobalQuries"
import {
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables,
  GetUsers
} from "../../types/api"
import HomePresenter from "./HomePresenter"

class GetUsersQuery extends Query<GetUsers> {}

class GetCurrentTimeTableQuery extends Query<
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables
> {}

const isoYearMonthWeek = `${moment()
  .add(1, "weeks")
  .startOf("isoWeek")
  .year()}${moment()
  .add(1, "weeks")
  .startOf("isoWeek")
  .week()}`

class HomeContainer extends React.Component {
  public timetable

  public render() {
    return (
      <GetCurrentTimeTableQuery
        query={GET_TIMETABLE}
        variables={{ yearMonthWeek: isoYearMonthWeek }}
        onCompleted={data => {
          this.timetable = data.GetCurrentTimeTable.timetable
        }}
      >
        {() => (
          <GetUsersQuery query={GET_USERS}>
            {({ data, loading }) => {
              return (
                <HomePresenter
                  data={data}
                  loading={loading}
                  yearMonthWeek={isoYearMonthWeek}
                  timetable={this.timetable}
                />
              )
            }}
          </GetUsersQuery>
        )}
      </GetCurrentTimeTableQuery>
    )
  }
}

export default HomeContainer
