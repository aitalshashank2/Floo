import { Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { performVerify } from "../api/auth/auth"
import DashboardComponent from "./components/DashboardComponent"
import Nav from "../common/Nav/NavContainer"
import Notification from "../common/Notification/NotificationController"

/**
 * Container for the Dashboard Component
 * 
 * This component handles the logic for calling various components based on user login state
 * 
 * @returns {JSX.Element} Dashboard
 */
const Dashboard = () => {

    const apiState = useSelector(state => state.user.apiState)
    const userDetails = useSelector(state => state.user.userDetails)
    const dispatch = useDispatch()

    // Handle when the user clicks a meeting tile
    const handleTeamClick = (teamCode) => {
        window.location = `/teams/${teamCode}`
    }

    // Handle when the user clicks the `new meeting` option
    const handleCreateJoinTeam = () => {
        window.location = "/teams/new"
    }

    if (apiState === "norequest") {
        performVerify(dispatch)
        return <Redirect to="/loader" />
    } else {

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
