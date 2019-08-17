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

interface IProps {
  match: { params: { timetableId } }
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

class EditTimeTableContainer extends React.Component<IProps> {
  public state = {
    data: null,
    timetableId: parseInt(this.props.match.params.timetableId, 10),
    yearMonthWeek: isoLastWeek
  }

  public render() {
    const { timetableId, yearMonthWeek } = this.state
    return (
      <GetTimetableQuery
        query={GET_TIMETABLE}
        variables={{ timetableId, yearMonthWeek }}
      >
        {({ loading, data }) => {
          return <EditTimeTablePresenter data={data} loading={loading} />
        }}
      </GetTimetableQuery>
    )
  }
}

export default EditTimeTableContainer
