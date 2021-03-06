import React from "react"
import { Query } from "react-apollo"
import { GetTimeTables } from "../../types/api"
import ViewTimeTablePresenter from "./ViewTimeTablePresenter"
import { GET_ALL_TIMETABLES } from "./ViewTimeTableQueries"

class GetAllTimeTableQuery extends Query<GetTimeTables> {}

class ViewTimeTableContainer extends React.Component {
  public render() {
    return (
      <GetAllTimeTableQuery query={GET_ALL_TIMETABLES}>
        {({ data, loading }) => (
          <ViewTimeTablePresenter data={data} loading={loading} />
        )}
      </GetAllTimeTableQuery>
    )
  }
}

export default ViewTimeTableContainer
