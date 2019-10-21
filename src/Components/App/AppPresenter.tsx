import React from "react"
import { Redirect, Route, Router, Switch } from "react-router-dom"
import history from "../../history"
import Application from "../../Routes/Application"
import EditTimeTable from "../../Routes/EditTimeTable"
import Forgot from "../../Routes/Forgot"
import Home from "../../Routes/Home"
import Login from "../../Routes/Login"
import Main from "../../Routes/Main"
import MakeTimeTable from "../../Routes/MakeTimeTable"
import Profile from "../../Routes/Profile"
import SignUp from "../../Routes/SignUp"
import UserTable from "../../Routes/UserTable"
import ViewTimeTable from "../../Routes/ViewTimeTable"
import Nav from "../Nav/NavContainer"

interface IProps {
  isLoggedIn: boolean
}

const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
  <Router history={history}>
    {isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}
  </Router>
)

const LoggedOutRoutes: React.SFC = () => {
  return (
    <Switch>
      <Route path={"/"} exact={true} component={Main} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signUp"} component={SignUp} />
      <Route path={"/forgot"} component={Forgot} />
      <Route
        path={"/application/:organizationId/:timetableId"}
        component={Application}
      />
      <Redirect path={"*"} to={"/"} />
    </Switch>
  )
}

class LoggedInRoutes extends React.Component {
  public render() {
    return (
      <>
        <Nav
          isMain={false}
          mainHandler={() => {
            return
          }}
          mainCurrent={""}
        />
        <Switch>
          <Route path={"/dashboard"} component={Home} />
          <Route path={"/profile"} exact={true} component={Profile} />
          <Route path={"/users"} component={UserTable} />
          <Route
            path={"/timetable/make"}
            exact={true}
            component={MakeTimeTable}
          />
          <Route path={"/timetable/:timetableId"} component={EditTimeTable} />
          <Route path={"/timetable"} exact={true} component={ViewTimeTable} />
          <Redirect path={"*"} to={"/dashboard"} />
        </Switch>
      </>
    )
  }

  public changeIsProfile = (value: boolean) => {
    this.setState({
      isProfile: value
    })
  }

  public changeIsSettings = (value: boolean) => {
    this.setState({
      isSettings: value
    })
  }

  public changeDefaultKey = (value: string) => {
    this.setState({
      defaultKey: value
    })
  }
}

function mapStyles(styles) {
  return {
    opacity: styles.opacity
  }
}

export default AppPresenter
