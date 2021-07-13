import axios from "axios"

import { useEffect, useState } from "react"
import { Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { apiMeetingDetail, apiUserPresentMeetings } from "../endpoints"
import { performVerify } from "../api/auth/auth"

import LoaderComponent from "../common/Loader/components/LoaderComponent"
import WebRTCContainer from "./WebRTCContainer"
import PreviewComponent from "./components/PreviewComponent"
import WarningOtherMeetingComponent from "./components/WarningOtherMeetingComponent"

/**
 * Container for all Meeting Components
 * 
 * This component houses logic for rendering all the meeting components
 * 
 * @param {Object} props 
 * 
 * @returns {JSX.Element} Meeting
 */
const Meeting = (props) => {

    const apiState = useSelector(state => state.user.apiState)
    const code = props.match.params.code
    const dispatch = useDispatch()

    const [approved, changeApproved] = useState(false)

    const [micState, changeMicState] = useState(true)
    const [videoState, changeVideoState] = useState(true)

    const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false)

    const [topicID, setTopicID] = useState(null)

    const [receivedOtherMeetingDetails, setReceivedOtherMeetingDetails] = useState(false)
    const [isPartOfAnotherMeeting, setIsPartOfAnotherMeeting] = useState(false)
    const [otherMeetings, setOtherMeetings] = useState([])

    const handleJoin = () => {
        changeApproved(true)
    }

    const handleMicToggle = () => {
        changeMicState(prev => {
            return !prev
        })
    }

    const handleVideoToggle = () => {
        changeVideoState(prev => {
            return !prev
        })
    }

    const toggleChatDrawer = () => {
        setIsChatDrawerOpen(prev => {
            return !prev
        })
    }

    useEffect(() => {

        // Retrieve meeting details
        const cancelTokenSourceMeetingDetail = axios.CancelToken.source()
        axios.get(apiMeetingDetail(code), {
            cancelToken: cancelTokenSourceMeetingDetail.token
        }).then(res => {

            setTopicID(res.data.topic)

        }).catch(err => {
            console.log(err)
        })

        // Retrieve all the meetings in which the user is already present
        const cancelTokenSourcePresentMeeting = axios.CancelToken.source()
        axios.get(apiUserPresentMeetings, {
            cancelToken: cancelTokenSourcePresentMeeting.token
        }).then(res => {
            if (res.data.length > 0) {
                setReceivedOtherMeetingDetails(true)
                setIsPartOfAnotherMeeting(true)
                setOtherMeetings(res.data)
            } else {
                setReceivedOtherMeetingDetails(true)
            }
        }).catch(err => {
            console.log(err)
        })

        // Cleanup
        return () => {
            cancelTokenSourceMeetingDetail.cancel("Cancelling in cleanup")
            cancelTokenSourcePresentMeeting.cancel("Cancelling in cleanup")
        }

    }, [])

    const handleProceedToMeeting = () => {
        setIsPartOfAnotherMeeting(false)
    }

    const goToHome = () => {
        window.location = "/"
    }

    if (apiState === "norequest") {
        performVerify(dispatch)
        return <Redirect to={`/loader/?redirect=/meeting/${code}`} />
    } else {

        if (receivedOtherMeetingDetails) {
            if (isPartOfAnotherMeeting) {

                return (
                    <WarningOtherMeetingComponent
                        otherMeetings={otherMeetings}
                        handleProceedToMeeting={handleProceedToMeeting}
                        goToHome={goToHome}
                    />
                )

            } else {
                if (approved) {
                    return (
                        <WebRTCContainer
                            code={code}
                            micState={micState}
                            videoState={videoState}
                            handleMicToggle={handleMicToggle}
                            handleVideoToggle={handleVideoToggle}
                            topicID={topicID}
                            isChatDrawerOpen={isChatDrawerOpen}
                            toggleChatDrawer={toggleChatDrawer}
                        />
                    )
                } else {


                    return (
                        <PreviewComponent
                            code={code}
                            handleJoin={handleJoin}
                            micState={micState}
                            videoState={videoState}
                            handleMicToggle={handleMicToggle}
                            handleVideoToggle={handleVideoToggle}
                        />
                    )
                }
            }

        } else {

            return (
                <LoaderComponent />
            )

        }

    }

}

export default Meeting
