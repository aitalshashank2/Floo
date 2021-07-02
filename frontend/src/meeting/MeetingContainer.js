import { useState } from "react"
import { Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { performVerify } from "../api/auth/auth"
import MeetingComponent from "./components/MeetingComponent"
import PreviewComponent from "./components/PreviewComponent"

const Meeting = (props) => {

    const apiState = useSelector(state => state.user.apiState)
    const code = props.match.params.code
    const dispatch = useDispatch()

    const [approved, changeApproved] = useState(false)

    const handleJoin = () => {
        changeApproved(true)
    }

    if(apiState === "norequest"){
        performVerify(dispatch)
        return <Redirect to={`/loader/?redirect=/meeting/${code}`} />
    }else{

        if(approved){
            return (
                <MeetingComponent code={code} />
            )
        }

        return (
            <PreviewComponent code={code} handleJoin={handleJoin} />
        )
    }

}

export default Meeting
