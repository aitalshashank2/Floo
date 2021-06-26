import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Redirect } from "react-router-dom"

import { performLogin } from "../../api/auth/auth"
import BrokerComponent from "./components/BrokerComponent"

const Broker = () => {

    const params = new URLSearchParams(window.location.search)
    const storedState = localStorage.getItem("state")

    const areStatesSame = useState(params.get("state") === storedState)[0]
    const code = useState(params.get("code"))[0]

    const dispatch = useDispatch()
    const [requestMade, changeRequestMade] = useState(false)
    
    useEffect(() => {
        if(areStatesSame){
            performLogin(code, dispatch)
            changeRequestMade(true)
            // window.location = routeLoader
        }
    }, [areStatesSame, code, dispatch, changeRequestMade])

    if(areStatesSame){
        if(requestMade){
            return <Redirect to="/loader" />
        }else{
            return <BrokerComponent />
        }
    }else{
        return <Redirect to="/login" />
    }

}

export default Broker
