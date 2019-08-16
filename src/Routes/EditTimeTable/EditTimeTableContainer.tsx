import React from "react"
import EditTimeTablePresenter from "./EditTimeTablePresenter"
import { Query } from "react-apollo"
import { GetDays, GetDaysVariables } from "../../types/api"
import { GET_DAYS } from "./EditTimeTableQueries"

interface IProps {
  match: { params: { timetableId } }
}

class GetDaysQuery extends Query<GetDays, GetDaysVariables> {}

class EditTimeTableContainer extends React.Component<IProps> {
  public state = {
    timetableId: parseInt(this.props.match.params.timetableId, 10)
  }
  public render() {
    const { timetableId } = this.state
    return (
      <GetDaysQuery
        query={GET_DAYS}
        variables={{ timetableId: timetableId }}
        onCompleted={data => console.log(data)}
      >
        {({ data, loading }) => (
          <EditTimeTablePresenter data={data} loading={loading} />
        )}
      </GetDaysQuery>
    )
  }
}

export default EditTimeTableContainer
