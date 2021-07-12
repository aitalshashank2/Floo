import { useState } from 'react'
import { Redirect } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'

import LoaderComponent from '../Loader/components/LoaderComponent'
import NavComponent from "./components/NavComponent"

import { createMeeting } from '../../api/meeting/creation'
import { dispatchChangeTheme } from './state/dispatchers'

/**
 * Container for Nav Component
 * 
 * This component houses the logic for all the Navigation Buttons
 * 
 * @param {Object} props
 * 
 * @param {string} props.teamCode Team Code if team view is open
 * 
 * @callback props.openSettingsDialog Open the modal housing settings of team (if team view is open)
 * 
 * @returns {JSX.Element} Nav
 */
const Nav = (props) => {

    const theme = useSelector(state => state.user.theme)
    const apiState = useSelector(state => state.user.apiState)
    const newMeeting = useSelector(state => state.meeting.creation)
    const dispatch = useDispatch()

    const [pressedLogout, changePressedLogout] = useState(false)
    const [pressedHome, changePressedHome] = useState(false)

    // Handle creation of a new meeting
    const createInstantMeeting = () => {
        createMeeting(dispatch, props.teamCode)
    }

    // Handle creation of a new team
    const createTeam = () => {
        window.location = "/teams/new"
    }

    // Handle toggling manage team view
    const manageTeam = () => {
        props.openSettingsDialog()
    }

    // Handle toggle theme
    const changeTheme = () => {

        let newTheme
        switch (theme) {
            case "default":
                newTheme = "dark"
                break
            case "dark":
                newTheme = "default"
                break
            default:
                newTheme = "dark"
        }

        localStorage.setItem("theme", newTheme)
        dispatchChangeTheme(dispatch, newTheme)

    }

    // Handle user logout
    const logout = () => {
        changePressedLogout(true)
    }

    // Handle home icon click
    const clickHome = () => {
        changePressedHome(true)
    }

    if (pressedLogout) {
        return <Redirect to="/logout" />
    } else if (pressedHome) {
        window.location = "/"
        return (
            <NavComponent
                createInstantMeeting={createInstantMeeting}
                changeTheme={changeTheme}
                logout={logout}
                apiState={apiState}
                clickHome={clickHome}
            />
        )
    } else {

        if (newMeeting.creationState === "pending") {
            return (
                <LoaderComponent />
            )
        } else if (newMeeting.creationState === "success") {
            window.location = `/meeting/${newMeeting.code}`
        }

        return (
            <NavComponent
                createInstantMeeting={createInstantMeeting}
                createTeam={createTeam}
                changeTheme={changeTheme}
                logout={logout}
                apiState={apiState}
                clickHome={clickHome}
                teamCode={props.teamCode}
                manageTeam={manageTeam}
            />
        )
    }


}

export default Nav
