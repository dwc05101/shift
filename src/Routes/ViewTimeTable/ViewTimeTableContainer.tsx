import React from "react"
import { Query } from "react-apollo"
import history from "../../history"
import { GetTimeTables } from "../../types/api"
import ViewTimeTablePresenter from "./ViewTimeTablePresenter"
import { GET_ALL_TIMETABLES } from "./ViewTimeTableQueries"

class GetAllTimeTableQuery extends Query<GetTimeTables> {}

class ViewTimeTableContainer extends React.Component {
  public state = {
    selectedRowKeys: []
  }
  public render() {
    return (
      <GetAllTimeTableQuery query={GET_ALL_TIMETABLES}>
        {({ data, loading }) => (
          <ViewTimeTablePresenter
            data={data}
            loading={loading}
            onChange={this.onChange}
            selectedRowKeys={this.state.selectedRowKeys}
            goToMakeTimetable={this.goToMakeTimetable}
          />
        )}
      </GetAllTimeTableQuery>
    )
  }

  public onChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys
    })
  }

  public goToMakeTimetable = () => {
    history.push("timetable/make")
  }
}

export default ViewTimeTableContainer
