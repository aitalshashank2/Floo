import { Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { performVerify } from "../api/auth/auth"
import PreviewComponent from "./components/PreviewComponent"

const Meeting = (props) => {

    const apiState = useSelector(state => state.user.apiState)
    const code = props.match.params.code
    const dispatch = useDispatch()

    const handleJoin = () => {
        console.log("Join the meeting")
    }

    if(apiState === "norequest"){
        performVerify(dispatch)
        return <Redirect to={`/loader/?redirect=/meeting/${code}`} />
    }else{

        return (
            <PreviewComponent code={code} handleJoin={handleJoin} />
        )
    }

}

export default Meeting
