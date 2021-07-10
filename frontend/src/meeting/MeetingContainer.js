import axios from "axios"

import { useEffect, useState } from "react"
import { Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { apiMeetingDetail } from "../endpoints"
import { performVerify } from "../api/auth/auth"
import WebRTCContainer from "./WebRTCContainer"
import PreviewComponent from "./components/PreviewComponent"

const Meeting = (props) => {

    const apiState = useSelector(state => state.user.apiState)
    const code = props.match.params.code
    const dispatch = useDispatch()

    const [approved, changeApproved] = useState(false)

    const [micState, changeMicState] = useState(true)
    const [videoState, changeVideoState] = useState(true)

    const [topicID, setTopicID] = useState(null)

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

    useEffect(() => {

        const cancelTokenSource = axios.CancelToken.source()
        axios.get(apiMeetingDetail(code), {
            cancelToken: cancelTokenSource.token
        }).then(res => {

            setTopicID(res.data.topic)

        }).catch(err => {
            console.log(err)
        })

        return () => {
            cancelTokenSource.cancel("Cancelling in cleanup")
        }

    }, [])

    if (apiState === "norequest") {
        performVerify(dispatch)
        return <Redirect to={`/loader/?redirect=/meeting/${code}`} />
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

}

export default Meeting
