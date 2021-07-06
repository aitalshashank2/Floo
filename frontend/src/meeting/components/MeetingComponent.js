import { createRef, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

import { apiWSMeetingSignal } from "../../endpoints"

const MeetingComponent = (props) => {

    const ws = useRef()
    const selfVideo = useRef()
    const selfStream = useRef()

    const [peers, changePeers] = useState([])
    const peerObjects = useRef({})
    const remoteStreams = useRef({})

    const self = useSelector(state => state.user.userDetails)
    
    useEffect(() => {
        
        ws.current = new WebSocket(apiWSMeetingSignal(props.code))
        
        ws.current.onopen = () => {
            console.log("Connected")
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
                changePeers(p)

                navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                    selfVideo.current.srcObject = stream
                    selfStream.current = stream
        
                    p.forEach(peer => {
                        console.log("Calling " + peer.uuid)
                        callUser(peer.uuid)
                    })
        
                })

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

                changePeers(prev => {
                    return [
                        ...prev,
                        payload.data
                    ]
                })
                console.log("NEW ATTENDEE")
                console.log(payload.data)
                console.log(peers)

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

        document.getElementById(`video-${uuid}`).srcObject = e.streams[0]
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

    console.log(peers)
    try{

        peers.map((peer, i) => {
            console.log("YAYYYYYYY")
            console.log(peer)
        })
    }catch{
        console.log("NOT SO MUCH")
        console.log(peers)
        console.log(typeof(peers))
    }
    
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
                peers.map((peer, i) => {
                    return (
                        <video
                            autoPlay
                            playsInline
                            controls={false}
                            key={i}
                            id={`video-${peer.uuid}`}
                            onContextMenu={e => {e.preventDefault()}}
                        />
                    )
                })
            }
            
        </div>
    )
}

export default MeetingComponent
