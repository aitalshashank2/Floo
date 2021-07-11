import { Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { performVerify } from "../api/auth/auth"
import DashboardComponent from "./components/DashboardComponent"
import Nav from "../common/Nav/NavContainer"
import Notification from "../common/Notification/NotificationController"

const Dashboard = () => {

    const apiState = useSelector(state => state.user.apiState)
    const userDetails = useSelector(state => state.user.userDetails)
    const dispatch = useDispatch()

    const handleTeamClick = (teamCode) => {
        window.location = `/teams/${teamCode}`
    }

    const handleCreateJoinTeam = () => {
        window.location = "/teams/new"
    }

    if(apiState === "norequest"){
        performVerify(dispatch)
        return <Redirect to="/loader" />
    }else{

        return (
            <>
                <Notification />
                <Nav />
                <DashboardComponent
                    userDetails={userDetails}
                    handleTeamClick={handleTeamClick}
                    handleCreateJoinTeam={handleCreateJoinTeam}
                />
            </>
        )

    }

}

export default Dashboard
