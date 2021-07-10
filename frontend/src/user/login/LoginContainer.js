import randomstring from 'randomstring'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { useEffect, useState } from 'react'

import LoginComponent from "./components/LoginComponent"
import Nav from '../../common/Nav/NavContainer'
import Notification from '../../common/Notification/NotificationController'
import { apiUserVerify, googleRedirect } from "../../endpoints"
import LoaderComponent from '../../common/Loader/components/LoaderComponent'

const Login = () => {

    const state = randomstring.generate()
    localStorage.setItem("state", state)

    const redirect = googleRedirect(state)

    const [alreadyLoggedIn, changeAlreadyLoggedIn] =  useState("norequest")

    useEffect(() => {
        changeAlreadyLoggedIn("pending")
        axios.get(apiUserVerify).then(res => {
            changeAlreadyLoggedIn("success")
        }).catch(err => {
            changeAlreadyLoggedIn("error")
        })
    }, [])

    if(alreadyLoggedIn === "norequest" || alreadyLoggedIn === "pending"){
        return <LoaderComponent />
    }else if(alreadyLoggedIn === "success"){
        return <Redirect to="/" />
    }else{
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
