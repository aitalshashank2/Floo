import { useState } from 'react'
import { Redirect } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'

import LoaderComponent from '../Loader/components/LoaderComponent'
import NavComponent from "./components/NavComponent"

import { createMeeting } from '../../api/meeting/creation'
import { dispatchChangeTheme } from './state/dispatchers'


const Nav = (props) => {

    const theme = useSelector(state => state.user.theme)
    const apiState = useSelector(state => state.user.apiState)
    const newMeeting = useSelector(state => state.meeting.creation)
    const dispatch = useDispatch()

    const [pressedLogout, changePressedLogout] = useState(false)
    const [pressedHome, changePressedHome] = useState(false)

    const createInstantMeeting = () => {
        createMeeting(dispatch, props.teamCode)
    }

    const createTeam = () => {
        window.location = "/teams/new"
    }

    const manageTeam = () => {
        props.openSettingsDialogue()
    }

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

    const logout = () => {
        changePressedLogout(true)
    }

    const clickHome = () => {
        changePressedHome(true)
    }

    if(pressedLogout){
        return <Redirect to="/logout" />
    }else if(pressedHome){
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
    }else{

        if(newMeeting.creationState === "pending"){
            return (
                <LoaderComponent />
            )
        }else if(newMeeting.creationState === "success"){
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
