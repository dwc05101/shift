import moment from "moment"
import React from "react"
import { Query } from "react-apollo"
// import { ComponentProps } from "react"
import { RouteComponentProps } from "react-router-dom"
import { GET_TIMETABLE } from "../../Components/TimeTable/TimeTableQueries"
import {
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables
} from "../../types/api"
import EditTimeTablePresenter from "./EditTimeTablePresenter"

interface IMatchParams {
  timetableId: string
}

interface IState {
  data: GetCurrentTimeTable | null
  organizationId: string
  yearMonthWeek: string | null | undefined
}

interface IProps {
  yearMonthWeek: string
  organizationId: number | null
}

class GetTimetableQuery extends Query<
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

class MakeTimeTableContainer extends React.Component<
  RouteComponentProps<IMatchParams>,
  IState,
  IProps
> {
  public state = {
    data: null,
    organizationId: this.props.match.params.timetableId,
    yearMonthWeek: isoLastWeek
  }

  public render() {
    const { organizationId, yearMonthWeek } = this.state
    const tableId: number = parseInt(organizationId, 10)
    return (
      <GetTimetableQuery
        query={GET_TIMETABLE}
        variables={{ timetableId: tableId, yearMonthWeek }}
      >
        {({ loading, data }) => {
          return <EditTimeTablePresenter data={data} loading={loading} />
        }}
      </GetTimetableQuery>
    )
  }
}

export default MakeTimeTableContainer
