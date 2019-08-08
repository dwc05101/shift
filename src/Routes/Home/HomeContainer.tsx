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

class GetLastWeekQuery extends Query<
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables
> {}

const isoLastWeek = `${
  moment().isoWeek() - 1 === 0
    ? moment()
        .toDate()
        .getFullYear() - 1
    : moment()
        .toDate()
        .getFullYear()
}${moment().isoWeek() - 1 === 0 ? 52 : moment().isoWeek() - 1}`

class HomeContainer extends React.Component {
  public lastWeekTable

  public render() {
    return (
      <GetLastWeekQuery
        query={GET_TIMETABLE}
        variables={{ yearMonthWeek: isoLastWeek }}
        onCompleted={data => {
          this.lastWeekTable = data.GetCurrentTimeTable.timetable
        }}
      >
        {() => (
          <GetUsersQuery query={GET_USERS}>
            {({ data, loading }) => {
              return (
                <HomePresenter
                  data={data}
                  loading={loading}
                  lastWeekTable={this.lastWeekTable}
                />
              )
            }}
          </GetUsersQuery>
        )}
      </GetLastWeekQuery>
    )
  }
}

export default HomeContainer
