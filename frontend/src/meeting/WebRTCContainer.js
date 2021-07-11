import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

import { apiWSMeetingSignal, routeMeeting } from "../endpoints"
import MeetingComponent from "./components/MeetingComponent"


const WebRTCContainer = (props) => {

    const ws = useRef()
    const peerObjects = useRef({})
    const selfStreamRef = useRef()
    const senders = useRef({})

    const [selfStream, setSelfStream] = useState()
    const [peers, changePeers] = useState([])
    const [peerStreams, setPeerStreams] = useState({})
    const [peersWithVideosOff, changePeersWithVideosOff] = useState([])

    const micRef = useRef(props.micState)
    const videoRef = useRef(props.videoState)

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

                navigator.mediaDevices.getUserMedia({
                    audio: micRef.current ? {
                        echoCancellation: true
                    } : micRef.current,
                    video: videoRef.current ? {
                        width: 1280,
                        height: 720
                    } : videoRef.current
                }).then(stream => {
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

            } else if ((payload.type === "EXIT_ATTENDEE") && (self.uuid !== payload.data.uuid)) {

                changePeers(prev => {
                    let p = []
                    prev.forEach(peer => {
                        if (peer.uuid !== payload.data.uuid) {
                            p.push(peer)
                        }
                    })
                    return p
                })

            } else if ((payload.type === "VIDEO_OFF")) {

                changePeersWithVideosOff(prev => {
                    return [
                        ...prev,
                        payload.data.uuid
                    ]
                })

            } else if ((payload.type === "VIDEO_ON")) {

                changePeersWithVideosOff(prev => {
                    let p = []
                    prev.forEach(uuid => {
                        if (uuid !== payload.data.uuid) {
                            p.push(uuid)
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
        senders.current[uuid] = {}
        selfStreamRef.current.getTracks().forEach(track => {
            if (!senders.current[uuid][track.kind]) {
                const sender = peerObjects.current[uuid].addTrack(track, selfStreamRef.current)
                senders.current[uuid][track.kind] = sender
            }
        })

    }

    // Create Peer Object
    const createPeerObject = (uuid) => {

        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: "stun:stun.l.google.com:19302"
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

        const remote_uuid = data.caller
        if (!peerObjects.current[remote_uuid]) {
            peerObjects.current[remote_uuid] = createPeerObject(remote_uuid)
        }
        const sessionDescription = new RTCSessionDescription(data.sdp)
        peerObjects.current[remote_uuid].setRemoteDescription(sessionDescription).then(() => {

            selfStreamRef.current.getTracks().forEach(track => {
                if (!senders.current[remote_uuid]) {
                    senders.current[remote_uuid] = {}
                }
                if (!senders.current[remote_uuid][track.kind]) {
                    const sender = peerObjects.current[remote_uuid].addTrack(track, selfStreamRef.current)
                    senders.current[remote_uuid][track.kind] = sender
                }
            })
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
        const sessionDescription = new RTCSessionDescription(data.sdp)
        peerObjects.current[data.caller].setRemoteDescription(sessionDescription).catch(e => {
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
        micRef.current = !micRef.current
        props.handleMicToggle()

        selfStreamRef.current.getAudioTracks()[0].enabled = micRef.current

        if (micRef.current) {

            // Mic is turned on
            const payload = {
                type: "MIC_ON",
                data: {
                    uuid: self.uuid
                }
            }
            ws.current.send(JSON.stringify(payload))

        } else {

            // Mic is switched off

            const payload = {
                type: "MIC_OFF",
                data: {
                    user: self.uuid
                }
            }
            ws.current.send(JSON.stringify(payload))

        }

    }

    const handleToggleVideo = () => {
        videoRef.current = !videoRef.current
        props.handleVideoToggle()

        selfStreamRef.current.getVideoTracks()[0].enabled = videoRef.current

        if (videoRef.current) {

            // Video is turned on

            const payload = {
                type: "VIDEO_ON",
                data: {
                    uuid: self.uuid
                }
            }
            ws.current.send(JSON.stringify(payload))

        } else {

            // Video is switched off

            const payload = {
                type: "VIDEO_OFF",
                data: {
                    uuid: self.uuid
                }
            }
            ws.current.send(JSON.stringify(payload))

        }

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
            isMicActive={props.micState}
            isVideoActive={props.videoState}
            handleCopyLink={handleCopyLink}
            handleToggleMic={handleToggleMic}
            handleToggleVideo={handleToggleVideo}
            handleLeave={handleLeave}
            peersWithVideosOff={peersWithVideosOff}
            topicID={props.topicID}
            isChatDrawerOpen={props.isChatDrawerOpen}
            toggleChatDrawer={props.toggleChatDrawer}
            meetingCode={props.code}
        />
    )

}

export default WebRTCContainer
