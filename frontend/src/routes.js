import { Route, Switch, Redirect } from "react-router-dom"

import Broker from "./user/broker/BrokerContainer"
import Dashboard from "./dashboard/DashboardContainer"
import Loader from "./common/Loader/LoaderContainer"
import Login from "./user/login/LoginContainer"
import Logout from "./user/logout/logoutContainer"
import Meeting from "./meeting/MeetingContainer"
import Page404 from "./page404/Page404Container"

const BaseRouter = () => {
    return (
        <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route exact path="/broker" component={Broker} />
            <Route exact path='/loader/?redirect=:redirect' component={Loader} />
            <Route exact path="/loader" component={Loader} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/meeting/:code" component={Meeting} />
            <Route exact path="/404" component={Page404} />

            <Route exact path="">
                <Redirect to='/404' />
            </Route>
        </Switch>
    )
}

export default BaseRouter
