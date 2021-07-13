import { Redirect } from "react-router"
import { useDispatch } from "react-redux"

import { performLogout } from "../../api/auth/auth"

/**
 * This component handles the logic for logging the user out
 * 
 * @returns {JSX.Element} Logout
 */
const Logout = () => {

    const dispatch = useDispatch()
    performLogout(dispatch)

    return (
        <Redirect to="/login" />
    )

}

export default Logout
