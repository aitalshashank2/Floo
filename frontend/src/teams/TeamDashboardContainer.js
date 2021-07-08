import { useDispatch, useSelector } from "react-redux"
import { Redirect } from "react-router-dom"

import { performVerify } from "../api/auth/auth"

import Nav from "../common/Nav/NavContainer"
import TeamDashboardComponent from "./components/TeamDashboardComponent"

const TeamDashboard = (props) => {

    const teamCode = props.match.params.code

    const apiState = useSelector(state => state.user.apiState)
    const dispatch = useDispatch()

    if(apiState === "norequest"){
        performVerify(dispatch)
        return <Redirect to={`/loader/?redirect=/teams/${teamCode}`} />
    }else{

        return (
            <>
                <Nav teamCode={teamCode} />
                <TeamDashboardComponent />
            </>
        )
    }

}

export default TeamDashboard
