import moment from "moment"
import React from "react"
import { Query } from "react-apollo"
import { GET_TIMETABLE } from "../../Components/TimeTable/TimeTableQueries"
import {
  GetCurrentTimeTable,
  GetCurrentTimeTable_GetCurrentTimeTable_timetable_days,
  GetCurrentTimeTable_GetCurrentTimeTable_timetable_days_slots,
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
    addedSlots: [],
    data: null,
    defaultSlots: [],
    organizationId: -1,
    timetableId: parseInt(this.props.match.params.timetableId, 10),
    yearMonthWeek: isoLastWeek
  }

  public render() {
    const {
      addedSlots,
      defaultSlots,
      timetableId,
      yearMonthWeek,
      organizationId
    } = this.state
    return (
      <GetTimetableQuery
        query={GET_TIMETABLE}
        variables={{ timetableId, yearMonthWeek }}
        onCompleted={async response => {
          const newOrganizationId: number = response!.GetCurrentTimeTable!
            .timetable!.organizationId!
          const days: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days | null> = response!
            .GetCurrentTimeTable!.timetable!.days!
          const newAddedSlots: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days_slots | null> = []
          const newDefaultSlots: Array<GetCurrentTimeTable_GetCurrentTimeTable_timetable_days_slots | null> = []
          days.map(day => {
            day!.slots!.map(slot => {
              if (slot!.isSelected) {
                newAddedSlots.push(slot)
              } else {
                newDefaultSlots.push(slot)
              }
              return null
            })
            return null
          })

          await this.setState({
            addedSlots: newAddedSlots,
            defaultSlots: newDefaultSlots,
            organizationId: newOrganizationId
          })
        }}
      >
        {({ loading, data }) => {
          return (
            <EditTimeTablePresenter
              addedSlots={addedSlots}
              defaultSlots={defaultSlots}
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
