import { Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { createMeeting } from "../api/meeting/creation"
import { performVerify } from "../api/auth/auth"
import DashboardComponent from "./components/DashboardComponent"
import LoaderComponent from "../common/Loader/components/LoaderComponent"
import Notification from "../common/Notification/NotificationController"

const Dashboard = () => {

    const apiState = useSelector(state => state.user.apiState)
    const newMeeting = useSelector(state => state.meeting.creation)
    const dispatch = useDispatch()

    const handleCreate = () => {
        createMeeting(dispatch)
    }

    if(apiState === "norequest"){
        performVerify(dispatch)
        return <Redirect to="/loader" />
    }else{

        if(newMeeting.creationState === "pending"){
            return (
                <LoaderComponent />
            )
        }else if(newMeeting.creationState === "success"){
            return (
                <Redirect to={`/meeting/${newMeeting.code}`} />
            )
        }

        return (
            <>
                <Notification />
                <DashboardComponent handleCreate={handleCreate} />
            </>
        )

    }

}

export default Dashboard
