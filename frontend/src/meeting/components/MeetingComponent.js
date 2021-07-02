import { createRef, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

import { apiWSMeetingSignal } from "../../endpoints"

const MeetingComponent = (props) => {

    const ws = useRef()
    const selfVideo = useRef()
    const selfStream = useRef()

    const peers = useRef([])
    const peerObjects = useRef({})
    const remoteStreams = useRef({})

    const [remoteVideoRefs, changeRemoteVideoRefs] = useState({})

    const self = useSelector(state => state.user.userDetails)
    
    useEffect(() => {
        
        ws.current = new WebSocket(apiWSMeetingSignal(props.code))
        
        ws.current.onopen = () => {
            console.log("Connected")
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                selfVideo.current.srcObject = stream
                selfStream.current = stream
    
                peers.current.forEach(peer => {
                    console.log("Calling " + peer.uuid)
                    callUser(peer.uuid)
                })
    
            })
        }

        ws.current.onmessage = (event) => {

            const payload = JSON.parse(event.data)

            if(payload.type === "ATTENDEES_LIST"){

                var p = []
                payload.data.forEach(element => {
                    if(element.uuid !== self.uuid){
                        p.push(element)
                    }
                });
                peers.current = p

            }else if((payload.type === "OFFER") && (self.uuid === payload.data.target)){

                handleReceiveCall(payload.data)

                console.log("OFFER RECEIVED: ")
                console.log(payload.data)

            }else if((payload.type === "ANSWER") && (self.uuid === payload.data.target)){

                handleAnswer(payload.data)
                console.log("ANSWER RECEIVED: ")
                console.log(payload.data)

            }else if((payload.type === "ICE_CANDIDATE") && (self.uuid === payload.data.target)){

                handleNewIceCandidate(payload.data)
                console.log("ICE RECEIVED: ")
                console.log(payload.data)

            }else if((payload.type === "NEW_ATTENDEE") && (self.uuid !== payload.data.uuid)){

                peers.current.push(payload.data)

            }

        }


    }, [])

    // Call a user
    const callUser = (uuid) => {

        peerObjects.current[uuid] = createPeerObject(uuid)
        selfStream.current.getTracks().forEach(track => peerObjects.current[uuid].addTrack(track, selfStream.current))

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
        if(e.candidate){
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
        remoteStreams.current[uuid] = e.streams[0]

        changeRemoteVideoRefs(prev => {
            return {
                ...prev,
                [uuid]: createRef()
            }
        })

        remoteVideoRefs[uuid].current.srcObject = remoteStreams.current[uuid]

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
            console.log("Negotiation")
        }).catch(e => console.log(e))
    }

    const handleReceiveCall = (data) => {

        const remote_uuid = data.caller
        peerObjects.current[remote_uuid] = createPeerObject(remote_uuid)
        const sessionDesciption = new RTCSessionDescription(data.sdp)
        peerObjects.current[remote_uuid].setRemoteDescription(sessionDesciption).then(() => {
            selfStream.current.getTracks().forEach(track => peerObjects.current[remote_uuid].addTrack(track, selfStream.current))
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

    console.log(remoteStreams)
    return (
        <div>
            <video
                autoPlay
                muted
                playsInline
                controls={false}
                ref={selfVideo}
                onContextMenu={e => {e.preventDefault()}}
            />
            {
                Object.entries(remoteVideoRefs).map(([key, value]) => {
                    return (
                        <video
                            autoPlay
                            playsInline
                            controls={false}
                            key={key}
                            ref={value}
                            onContextMenu={e => {e.preventDefault()}}
                        />
                    )
                })
            }
            
        </div>
    )
}

export default MeetingComponent
