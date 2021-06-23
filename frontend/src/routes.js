import { Route, Switch, Redirect } from "react-router-dom"

import Dashboard from "./dashboard/DashboardContainer"
import Login from "./user/login/LoginContainer"
import Page404 from "./page404/Page404Container"

const BaseRouter = () => {
    return (
        <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/404" component={Page404} />

            <Route exact path="">
                <Redirect to='/404' />
            </Route>
        </Switch>
    )
}

export default BaseRouter
