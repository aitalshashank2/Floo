import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

import { apiWSMeetingSignal, routeMeeting } from "../endpoints"
import MeetingComponent from "./components/MeetingComponent"


const WebRTCContainer = (props) => {

    const ws = useRef()
    const peerObjects = useRef({})
    const selfStreamRef = useRef()

    const [selfStream, setSelfStream] = useState()
    const [peers, changePeers] = useState([])
    const [peerStreams, setPeerStreams] = useState({})

    const self = useSelector(state => state.user.userDetails)

    useEffect(() => {

        ws.current = new WebSocket(apiWSMeetingSignal(props.code))

        ws.current.onmessage = (event) => {

            const payload = JSON.parse(event.data)

            if (payload.type === "ATTENDEES_LIST") {

                var p = []
                payload.data.forEach(element => {
                    if (element.uuid !== self.uuid) {
                        p.push(element)
                    }
                });
                changePeers(p)

                navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                    setSelfStream(stream)
                    selfStreamRef.current = stream

                    p.forEach(peer => {
                        callUser(peer.uuid)
                    })
                })

            } else if ((payload.type === "OFFER") && (self.uuid === payload.data.target)) {

                handleReceiveCall(payload.data)

            } else if ((payload.type === "ANSWER") && (self.uuid === payload.data.target)) {

                handleAnswer(payload.data)

            } else if ((payload.type === "ICE_CANDIDATE") && (self.uuid === payload.data.target)) {

                handleNewIceCandidate(payload.data)

            } else if ((payload.type === "NEW_ATTENDEE") && (self.uuid !== payload.data.uuid)) {

                changePeers(prev => {
                    return [
                        ...prev,
                        payload.data
                    ]
                })

            } else if ((payload.type === "EXIT_ATTENDEE") && (self.uuid !== payload.data.uuid)){

                changePeers(prev => {
                    let p = []
                    prev.forEach(peer => {
                        if(peer.uuid !== payload.data.uuid){
                            p.push(peer)
                        }
                    })
                    return p
                })

            }

        }

    }, [])

    // Call a user
    const callUser = (uuid) => {

        peerObjects.current[uuid] = createPeerObject(uuid)
        selfStreamRef.current.getTracks().forEach(track => peerObjects.current[uuid].addTrack(track, selfStreamRef.current))

    }

    // Create Peer Object
    const createPeerObject = (uuid) => {

        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                }
            ]
        })

        peer.onicecandidate = (e) => handleIceCandidateEvent(e, uuid)
        peer.ontrack = (e) => handleTrackEvent(e, uuid)
        peer.onnegotiationneeded = (e) => handleNegotiationNeededEvent(e, uuid)

        return peer

    }

    const handleIceCandidateEvent = (e, uuid) => {
        if (e.candidate) {
            const payload = {
                type: "ICE_CANDIDATE",
                data: {
                    target: uuid,
                    caller: self.uuid,
                    candidate: e.candidate
                }
            }
            ws.current.send(JSON.stringify(payload))
        }
    }

    const handleTrackEvent = (e, uuid) => {
        setPeerStreams(prev => {
            return {
                ...prev,
                [uuid]: e.streams[0]
            }
        })
    }

    const handleNegotiationNeededEvent = (e, uuid) => {
        peerObjects.current[uuid].createOffer().then(offer => {
            return peerObjects.current[uuid].setLocalDescription(offer)
        }).then(() => {
            const payload = {
                type: "OFFER",
                data: {
                    target: uuid,
                    caller: self.uuid,
                    sdp: peerObjects.current[uuid].localDescription
                }
            }
            ws.current.send(JSON.stringify(payload))
        }).catch(e => console.log(e))
    }

    const handleReceiveCall = (data) => {
        // console.log(selfStream)

        const remote_uuid = data.caller
        peerObjects.current[remote_uuid] = createPeerObject(remote_uuid)
        const sessionDesciption = new RTCSessionDescription(data.sdp)
        peerObjects.current[remote_uuid].setRemoteDescription(sessionDesciption).then(() => {
            selfStreamRef.current.getTracks().forEach(track => peerObjects.current[remote_uuid].addTrack(track, selfStreamRef.current))
        }).then(() => {
            return peerObjects.current[remote_uuid].createAnswer()
        }).then(answer => {
            return peerObjects.current[remote_uuid].setLocalDescription(answer)
        }).then(() => {
            const payload = {
                type: "ANSWER",
                data: {
                    target: data.caller,
                    caller: self.uuid,
                    sdp: peerObjects.current[remote_uuid].localDescription
                }
            }
            ws.current.send(JSON.stringify(payload))
        }).catch(e => {
            console.log(e)
        })

    }

    const handleAnswer = (data) => {
        const sessionDesciption = new RTCSessionDescription(data.sdp)
        peerObjects.current[data.caller].setRemoteDescription(sessionDesciption).catch(e => {
            console.log(e)
        })
    }

    const handleNewIceCandidate = (data) => {

        const candidate = new RTCIceCandidate(data.candidate)
        peerObjects.current[data.caller].addIceCandidate(candidate).catch(e => {
            console.log(e)
        })

    }


    // Component event handlers
    const handleCopyLink = () => {
        navigator.clipboard.writeText(routeMeeting(props.code))
    }

    const handleToggleMic = () => {
        console.log("Toggle Mic")
    }

    const handleToggleVideo = () => {
        console.log("Toggle Video")
    }

    const handleLeave = () => {
        ws.current.close()
        window.location = "/"
    }

    return (
        <MeetingComponent
            selfStream={selfStream}
            peers={peers}
            peerStreams={peerStreams}
            handleCopyLink={handleCopyLink}
            handleToggleMic={handleToggleMic}
            handleToggleVideo={handleToggleVideo}
            handleLeave={handleLeave}
        />
    )

}

export default WebRTCContainer
