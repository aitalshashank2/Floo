import randomstring from 'randomstring'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { useEffect, useState } from 'react'

import LoginComponent from "./components/LoginComponent"
import Nav from '../../common/Nav/NavContainer'
import Notification from '../../common/Notification/NotificationController'
import { apiUserVerify, googleRedirect } from "../../endpoints"
import LoaderComponent from '../../common/Loader/components/LoaderComponent'

/**
 * Container for Login Component
 * 
 * This component handles the logic for creating a random state and rendering the `Login Compomnent` 
 * based on the login state of the user
 * This state is stored in local storage for future validations
 * 
 * @returns {JSX.Element} Login
 */
const Login = () => {

    const state = randomstring.generate()
    localStorage.setItem("state", state)

    const redirect = googleRedirect(state)

    const [alreadyLoggedIn, changeAlreadyLoggedIn] = useState("norequest")

    useEffect(() => {
        changeAlreadyLoggedIn("pending")
        axios.get(apiUserVerify).then(res => {
            changeAlreadyLoggedIn("success")
        }).catch(err => {
            changeAlreadyLoggedIn("error")
        })
    }, [])

    if (alreadyLoggedIn === "norequest" || alreadyLoggedIn === "pending") {
        return <LoaderComponent />
    } else if (alreadyLoggedIn === "success") {
        return <Redirect to="/" />
    } else {
        return (
            <>
                <Notification />
                <Nav />
                <LoginComponent googleRedirect={redirect} />
            </>
        )
    }

}

export default Login
