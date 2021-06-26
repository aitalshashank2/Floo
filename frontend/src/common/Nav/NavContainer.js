import { useState } from 'react'
import { Redirect } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'

import NavComponent from "./components/NavComponent"

import { dispatchChangeTheme } from './state/dispatchers'


const Nav = () => {

    const theme = useSelector(state => state.user.theme)
    const dispatch = useDispatch()

    const [pressedLogout, changePressedLogout] = useState(false)

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

    if(pressedLogout){
        return <Redirect to="logout" />
    }else{
        return (
            <NavComponent changeTheme={changeTheme} logout={logout} />
        )
    }


}

export default Nav
