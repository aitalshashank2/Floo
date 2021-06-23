import LoginComponent from "./components/LoginComponent"
import { googleRedirect } from "../../endpoints"

const Login = () => {
    return (
        <LoginComponent googleRedirect={googleRedirect} />
    )
}

export default Login
