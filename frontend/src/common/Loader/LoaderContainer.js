import { useSelector } from "react-redux"
import { Redirect } from "react-router"

import LoaderComponent from "./components/LoaderComponent"

const Loader = () => {

    const apiState = useSelector(state => state.user.apiState)

    if(apiState === "pending"){
        return <LoaderComponent />
    }else if(apiState === "success"){
        return (
            <Redirect to="/" />
        )
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
