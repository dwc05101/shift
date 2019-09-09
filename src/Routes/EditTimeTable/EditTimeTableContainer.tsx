import moment from "moment"
import React from "react"
import { Query } from "react-apollo"
import { GET_TIMETABLE } from "../../Components/TimeTable/TimeTableQueries"
import {
  GetCurrentTimeTable,
  GetCurrentTimeTableVariables
} from "../../types/api"
import EditTimeTablePresenter from "./EditTimeTablePresenter"

interface IProps {
  match: { params: { timetableId: string } }
  yearMonthWeek: string
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
    organizationId: -1,
    timetableId: parseInt(this.props.match.params.timetableId, 10),
    yearMonthWeek: isoLastWeek
  }

  public render() {
    const { timetableId, yearMonthWeek, organizationId } = this.state
    return (
      <GetTimetableQuery
        query={GET_TIMETABLE}
        variables={{ timetableId, yearMonthWeek }}
        onCompleted={async response => {
          const newOrganizationId: number = response!.GetCurrentTimeTable!
            .timetable!.organizationId!
          this.setState({
            organizationId: newOrganizationId
          })
        }}
      >
        {({ loading, data }) => {
          return (
            <EditTimeTablePresenter
              data={data}
              loading={loading}
              timetableId={timetableId}
              organizationId={organizationId}
            />
          )
        }}
      </GetTimetableQuery>
    )
  }
}

export default EditTimeTableContainer
