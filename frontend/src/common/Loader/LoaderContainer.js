import { useSelector } from "react-redux"
import { Redirect, useLocation } from "react-router"

import LoaderComponent from "./components/LoaderComponent"

/**
 * Container for Loader Component
 * 
 * This container acts as a buffer region for keeping the user while the app loads all the 
 * credentials and decides where the user should be redirect post-authentication. It decides the 
 * redirect location by parsing the window URL and retrieving the URL parameter `redirect`
 * 
 * @returns {JSX.Element} Loader
 */
const Loader = () => {

    const apiState = useSelector(state => state.user.apiState)
    const query = new URLSearchParams(useLocation().search)
    const redirect = query.get("redirect")

    if (apiState === "pending") {
        return <LoaderComponent />
    } else if (apiState === "success") {
        if (redirect) {

            return (
                <Redirect to={redirect} />
            )

        } else {
            return (
                <Redirect to="/" />
            )
        }

    } else if (apiState === "error") {
        return (
            <Redirect to="/logout" />
        )
    } else {
        return (
            <LoaderComponent />
        )
    }


}

export default Loader
