import { useEffect, useState } from "react"
import { Redirect } from "react-router-dom"

import { performLogin } from "../../api/auth"
import BrokerComponent from "./components/BrokerComponent"

const Broker = () => {

    const params = new URLSearchParams(window.location.search)
    const storedState = localStorage.getItem("state")

    const areStatesSame = useState(params.get("state") === storedState)[0]
    const code = useState(params.get("code"))[0]
    
    useEffect(() => {
        if(areStatesSame){
            performLogin(code)
        }
    }, [areStatesSame, code])

    return (
        (areStatesSame) ? (
            <BrokerComponent />
        ) : (
            <Redirect to="/login" />
        )
    )

}

export default Broker
