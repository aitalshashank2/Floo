import randomstring from 'randomstring'

import LoginComponent from "./components/LoginComponent"
import { googleRedirect } from "../../endpoints"

const Login = () => {

    const state = randomstring.generate()
    localStorage.setItem("state", state)

    const redirect = googleRedirect(state)

    return (
        <LoginComponent googleRedirect={redirect} />
    )
}

export default Login
