import React from "react"
import { Query } from "react-apollo"
import {
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables
} from "../../types/api"
import TimeTablePresenter from "./TimeTablePresenter"
import { GET_TIMETABLE } from "./TimeTableQueries"

interface IProps {
  yearMonthWeek: string
  organizationId: number | null
}

class GetTimetableQuery extends Query<
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables
> {}

class TimeTableContainer extends React.Component<IProps> {
  public state = {
    organizationId: this.props.organizationId,
    yearMonthWeek: this.props.yearMonthWeek
  }

  public render() {
    const { organizationId, yearMonthWeek } = this.state
    return (
      <GetTimetableQuery
        query={GET_TIMETABLE}
        variables={{ organizationId, yearMonthWeek }}
      >
        {({ data, loading }) => {
          return <TimeTablePresenter data={data} loading={loading} />
        }}
      </GetTimetableQuery>
    )
  }
}

export default TimeTableContainer
