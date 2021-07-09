import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Redirect } from "react-router-dom"

import { apiTeamsDetails } from "../endpoints"
import { performVerify } from "../api/auth/auth"

import Nav from "../common/Nav/NavContainer"
import LoaderComponent from "../common/Loader/components/LoaderComponent"
import TeamDashboardComponent from "./components/TeamDashboardComponent"


const TeamDashboard = (props) => {

    const teamCode = props.match.params.code

    const apiState = useSelector(state => state.user.apiState)
    const dispatch = useDispatch()

    const [teamInfo, setTeamInfo] = useState({})
    const [receivedTeamInfo, setReceivedTeamInfo] = useState(false)
    const [isSettingsDialogueOpen, toggleSettingsDialogue] = useState(false)

    useEffect(() => {

        if(apiState === "success"){
            const cancelTokenSource = axios.CancelToken.source()
    
            axios.get(apiTeamsDetails(teamCode), {
                cancelToken: cancelTokenSource.token
            }).then(res => {
                setTeamInfo(res.data)
                setReceivedTeamInfo(true)
            }).catch(err => {
                console.log(err)
                window.location = "/"
            })

            // Cleanup
            return () => {
                cancelTokenSource.cancel("Cancelling in cleanup")
            }
        }

    }, [])

    const retrieveTeamInfo = () => {
        axios.get(apiTeamsDetails(teamCode)).then(res => {
            setTeamInfo(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const openSettingsDialogue = () => {
        retrieveTeamInfo()
        toggleSettingsDialogue(true)
    }

    const closeSettingsDialogue = () => {
        toggleSettingsDialogue(false)
    }

    const handleCopyTeamCode = () => {
        navigator.clipboard.writeText(teamCode)
    }

    if(apiState === "norequest"){
        performVerify(dispatch)
        return <Redirect to={`/loader/?redirect=/teams/${teamCode}`} />
    }else{

        if(receivedTeamInfo){

            return (
                <>
                    <Nav
                        teamCode={teamCode}
                        openSettingsDialogue={openSettingsDialogue}
                    />
                    <TeamDashboardComponent
                        teamInfo={teamInfo}
                        isSettingsDialogueOpen={isSettingsDialogueOpen}
                        closeSettingsDialogue={closeSettingsDialogue}
                        handleCopyTeamCode={handleCopyTeamCode}
                    />
                </>
            )

        }else{

            return (
                <LoaderComponent />
            )

        }
    }

}

export default TeamDashboard
