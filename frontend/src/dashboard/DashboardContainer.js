import { Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { performVerify } from "../api/auth/auth"
import Notification from "../common/Notification/NotificationController"
import DashboardComponent from "./components/DashboardComponent"

const Dashboard = () => {

    const apiState = useSelector(state => state.user.apiState)
    const dispatch = useDispatch()

    
    if(apiState === "norequest"){
        performVerify(dispatch)
        return <Redirect to="/loader" />
    }else{
        return (
            <>
                <Notification />
                <DashboardComponent />
            </>
        )
    }

}

export default Dashboard
