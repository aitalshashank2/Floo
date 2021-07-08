import { useSelector } from "react-redux"
import { Redirect, useLocation } from "react-router"

import LoaderComponent from "./components/LoaderComponent"

const Loader = () => {

    const apiState = useSelector(state => state.user.apiState)
    const query = new URLSearchParams(useLocation().search)
    const redirect = query.get("redirect")

    if(apiState === "pending"){
        return <LoaderComponent />
    }else if(apiState === "success"){
        if(redirect){

            return (
                <Redirect to={redirect} />
            )

        }else{
            return (
                <Redirect to="/" />
            )
        }

    }else if(apiState === "error"){
        return (
            <Redirect to="/logout" />
        )
    }else{
        return (
            <LoaderComponent />
        )
    }


}

export default Loader
