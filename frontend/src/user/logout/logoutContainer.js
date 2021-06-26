import { Redirect } from "react-router"
import { useDispatch } from "react-redux"

import { performLogout } from "../../api/auth/auth"

const Logout = () => {

    const dispatch = useDispatch()
    performLogout(dispatch)

    return (
        <Redirect to="/login" />
    )

}

export default Logout
