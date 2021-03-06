import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Redirect } from "react-router-dom"

import { apiTeamsDetails, apiTopics, apiTeamsLeave } from "../endpoints"
import { performVerify } from "../api/auth/auth"

import Nav from "../common/Nav/NavContainer"
import LoaderComponent from "../common/Loader/components/LoaderComponent"
import TeamDashboardComponent from "./components/TeamDashboardComponent"


/**
 * Container for Team Dashboard Component
 * 
 * This component handles the logic for retrieving all the topics corresponding to a team and passing it 
 * on to the `Team Dashboard Component`
 * 
 * @param {Object} props 
 * 
 * @returns {JSX.Element} TeamDashboard
 */
const TeamDashboard = (props) => {

    const teamCode = props.match.params.code

    const apiState = useSelector(state => state.user.apiState)
    const dispatch = useDispatch()

    const [teamInfo, setTeamInfo] = useState({})
    const [receivedTeamInfo, setReceivedTeamInfo] = useState(false)
    const [isSettingsDialogOpen, toggleSettingsDialog] = useState(false)

    const [isCreateTopicDialogOpen, toggleCreateTopicDialog] = useState(false)

    const [createTopicTitle, setCreateTopicTitle] = useState("")
    const [createTopicDescription, setCreateTopicDescription] = useState("")
    const [isCreateTopicTitleNull, setIsCreateTopicTitleNull] = useState(false)
    const [isCreateTopicDescriptionNull, setIsCreateTopicDescriptionNull] = useState(false)

    const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false)
    const [topicDialog, setTopicDialog] = useState()

    useEffect(() => {

        // Retrieve team information from the backend
        if (apiState === "success") {
            const cancelTokenSource = axios.CancelToken.source()

            axios.get(apiTeamsDetails(teamCode), {
                cancelToken: cancelTokenSource.token
            }).then(res => {
                setTeamInfo(res.data)
                setReceivedTeamInfo(true)
            }).catch(err => {
                console.log(err)
            })

            // Cleanup
            return () => {
                cancelTokenSource.cancel("Cancelling in cleanup")
            }
        }

    }, [])

    // Retrieve team information from the backend
    const retrieveTeamInfo = () => {
        axios.get(apiTeamsDetails(teamCode)).then(res => {
            setTeamInfo(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const openSettingsDialog = () => {
        retrieveTeamInfo()
        toggleSettingsDialog(true)
    }

    const closeSettingsDialog = () => {
        toggleSettingsDialog(false)
    }

    const handleCopyTeamCode = () => {
        navigator.clipboard.writeText(teamCode)
    }

    const openCreateTopicDialog = () => {
        toggleCreateTopicDialog(true)
    }

    const closeCreateTopicDialog = () => {
        toggleCreateTopicDialog(false)
        setCreateTopicTitle("")
        setCreateTopicDescription("")
    }

    const handleCreateTopicTitle = (value) => {
        setCreateTopicTitle(value)
    }

    const handleCreateTopicDescription = (value) => {
        setCreateTopicDescription(value)
    }

    // Make a request to leave the team on the backend
    const handleLeaveTeam = () => {

        axios.get(apiTeamsLeave(teamCode)).then(res => {
            window.location = "/"
        }).catch(err => {
            console.log(err)
        })

    }

    // Make the request to the backend to publish the topic stored in state variables
    const handleCreateTopicPublish = () => {

        if (createTopicTitle.length === 0) {
            setIsCreateTopicTitleNull(true)
        } else {
            setIsCreateTopicTitleNull(false)
        }

        if (createTopicDescription.length === 0) {
            setIsCreateTopicDescriptionNull(true)
        } else {
            setIsCreateTopicDescriptionNull(false)
        }

        if (createTopicTitle.length !== 0 && createTopicDescription.length !== 0) {

            axios.post(apiTopics, {
                "title": createTopicTitle,
                "description": createTopicDescription,
                "team": teamCode
            }).then(res => {
                window.location = `/teams/${teamCode}`
            }).catch(err => {
                console.log(err)
            })

        }

    }

    const openTopicDialog = (topic) => {
        setIsTopicDialogOpen(true)
        setTopicDialog(topic)
    }

    const closeTopicDialog = () => {
        setIsTopicDialogOpen(false)
    }



    if (apiState === "norequest") {
        performVerify(dispatch)
        return <Redirect to={`/loader/?redirect=/teams/${teamCode}`} />
    } else {

        if (receivedTeamInfo) {

            return (
                <>
                    <Nav
                        teamCode={teamCode}
                        openSettingsDialog={openSettingsDialog}
                    />
                    <TeamDashboardComponent

                        teamInfo={teamInfo}

                        isSettingsDialogOpen={isSettingsDialogOpen}
                        closeSettingsDialog={closeSettingsDialog}
                        handleCopyTeamCode={handleCopyTeamCode}

                        isCreateTopicDialogOpen={isCreateTopicDialogOpen}
                        openCreateTopicDialog={openCreateTopicDialog}
                        closeCreateTopicDialog={closeCreateTopicDialog}

                        createTopicTitle={createTopicTitle}
                        createTopicDescription={createTopicDescription}
                        handleCreateTopicTitle={handleCreateTopicTitle}
                        handleCreateTopicDescription={handleCreateTopicDescription}
                        isCreateTopicTitleNull={isCreateTopicTitleNull}
                        isCreateTopicDescriptionNull={isCreateTopicDescriptionNull}
                        handleCreateTopicPublish={handleCreateTopicPublish}

                        isTopicDialogOpen={isTopicDialogOpen}
                        topicDialog={topicDialog}
                        openTopicDialog={openTopicDialog}
                        closeTopicDialog={closeTopicDialog}

                        handleLeaveTeam={handleLeaveTeam}

                    />
                </>
            )

        } else {

            return (
                <LoaderComponent />
            )

        }
    }

}

export default TeamDashboard
