import React from "react"
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom"

import EditTimeTable from "../../Routes/EditTimeTable"
import Forgot from "../../Routes/Forgot"
import Home from "../../Routes/Home"
import Login from "../../Routes/Login"
import MakeSlot from "../../Routes/MakeSlot"
import MakeTimeTable from "../../Routes/MakeTimeTable"
import Profile from "../../Routes/Profile"
import Settings from "../../Routes/Settings"
import SignUp from "../../Routes/SignUp"
import UserTable from "../../Routes/UserTable"
import ViewTimeTable from "../../Routes/ViewTimeTable"

interface IProps {
  isLoggedIn: boolean
}
const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
  <Router>{isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}</Router>
)

const LoggedOutRoutes: React.SFC = () => (
  <Switch>
    <Route path={"/"} exact={true} component={Login} />
    <Route path={"/sign-up"} component={SignUp} />
    <Route path={"/forgot"} component={Forgot} />
    <Route
      path={"/application/:organizationId/:timetableId"}
      component={MakeSlot}
    />
    <Redirect path={"*"} to={"/"} />
  </Switch>
)

const LoggedInRoutes: React.SFC = () => (
  <Switch>
    <Route path={"/dashboard"} component={Home} />
    <Route path={"/profile"} exact={true} component={Profile} />
    <Route path={"/users"} component={UserTable} />
    <Route path={"/settings"} component={Settings} />
    <Route path={"/timetable/make"} exact={true} component={MakeTimeTable} />
    <Route path={"/timetable/:timetableId"} component={EditTimeTable} />
    <Route path={"/timetable"} exact={true} component={ViewTimeTable} />
    <Redirect path={"*"} to={"/dashboard"} />
  </Switch>
)

export default AppPresenter
