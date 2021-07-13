import { Link } from "@material-ui/core"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

import { apiWSMeetingSignal, routeMeeting } from "../endpoints"
import MeetingComponent from "./components/MeetingComponent"

const moment = require("moment")

/**
 * Container for Meeting Component
 * 
 * This component houses logic for WebRTC
 * 
 * @param {Object} props 
 * 
 * @param {string} props.code The code of the current meeting
 * @param {number} props.topicID The ID of the topic that is associated with the current meeting (if available)
 * 
 * @param {boolean} props.micState `true` if microphone is on
 * @param {boolean} props.videoState `true` if video is on
 * @param {boolean} props.isChatDrawerOpen `true` if the chat drawer is open
 * 
 * @callback props.handleMicToggle Toggle the active state of microphone
 * @callback props.handleVideoToggle Toggle the active state of video feed
 * @callback props.toggleChatDrawer Toggle the visibility of chat drawer
 * 
 * @returns {JSX.Element} WebRTCContainer
 */
const WebRTCContainer = (props) => {

    // Reference for storing a websocket connection
    const ws = useRef()
    // Reference for storing all the peer objects
    const peerObjects = useRef({})
    // Reference for storing the video feed of the current user
    const selfStreamRef = useRef()
    // Reference for storing the list of senders generated during creating a peer connection
    const senders = useRef({})

    // State containing the video feed of the current user
    const [selfStream, setSelfStream] = useState()
    // State containing the list of uuids of peers
    const [peers, changePeers] = useState([])
    // Dictionary containing the media streams of the peer connections
    const [peerStreams, setPeerStreams] = useState({})
    // List of peers who have their microphone off
    const [peersWithMicsOff, changePeersWithMicsOff] = useState([])
    // List of peers who have their video off
    const [peersWithVideosOff, changePeersWithVideosOff] = useState([])

    // Reference to store active state of microphone
    const micRef = useRef(props.micState)
    // Reference to store active state of video feed
    const videoRef = useRef(props.videoState)

    // State to store recording state
    const [isRecording, setIsRecording] = useState(false)
    // Reference to store the screen recorder object
    const screenRecorderRef = useRef()
    // Reference to store the screen stream
    const screenStreamRef = useRef()

    // State variable subscribed to redux store housing user information
    const self = useSelector(state => state.user.userDetails)

    useEffect(() => {

        ws.current = new WebSocket(apiWSMeetingSignal(props.code))

        ws.current.onmessage = (event) => {

            const payload = JSON.parse(event.data)

            if (payload.type === "ATTENDEES_LIST") {

                // Received initial participants list
                var p = []
                payload.data.forEach(element => {
                    if (element.uuid !== self.uuid) {
                        p.push(element)
                    }
                });
                changePeers(p)

                // Retrieve the video and audio feed of the user and call all the other participants who are in the meeting
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

            } else if ((payload.type === "MIC_OFF")) {

                changePeersWithMicsOff(prev => {
                    return [
                        ...prev,
                        payload.data.uuid
                    ]
                })

            } else if ((payload.type === "MIC_ON")) {

                changePeersWithMicsOff(prev => {
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

    // Handle ICE Candidates
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

    // Append the local streams with the new track
    const handleTrackEvent = (e, uuid) => {
        setPeerStreams(prev => {
            return {
                ...prev,
                [uuid]: e.streams[0]
            }
        })
    }

    // Perform negotiations
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

    // Receive Call
    const handleReceiveCall = (data) => {

        // Create a new peer object and add self video feed to that peer object and exchange descriptions
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

    // Exchange descriptions
    const handleAnswer = (data) => {
        const sessionDescription = new RTCSessionDescription(data.sdp)
        peerObjects.current[data.caller].setRemoteDescription(sessionDescription).catch(e => {
            console.log(e)
        })
    }

    // Add ICE Candidates
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
                    uuid: self.uuid
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

    const download = (blob, fileName = `floo-recording-${props.code}-${moment().format('LLL')}.mp4`) => {

        if (navigator && navigator.msSaveOrOpenBlob) {
            return navigator.msSaveOrOpenBlob(blob, fileName)
        }

        // Work-around for firefox
        const blobURL = URL.createObjectURL(blob)

        const blobLink = document.createElement('a')
        blobLink.href = blobURL
        blobLink.download = fileName

        blobLink.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        }))

        setTimeout(() => {
            URL.revokeObjectURL(blobURL)
            blobLink.remove()
        }, 100)

    }

    const toggleRecording = () => {

        if (!isRecording) {
            navigator.mediaDevices.getDisplayMedia({
                video: {
                    MediaSource: "screen",
                    cursor: "always"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            }).then(stream => {
                screenRecorderRef.current = new MediaRecorder(stream)
                screenStreamRef.current = stream

                const chunks = []
                screenRecorderRef.current.ondataavailable = (e) => {
                    chunks.push(e.data)
                }
                screenRecorderRef.current.onstop = e => {
                    const blob = new Blob(chunks, {
                        type: chunks[0].type
                    })
                    download(blob)
                }
                screenRecorderRef.current.start()
            })
        } else {
            if (screenStreamRef.current) {
                screenRecorderRef.current.stop()
                screenStreamRef.current.getTracks().forEach(track => track.stop())
            }
        }

        setIsRecording(prev => {
            return !prev
        })

    }

    return (
        <MeetingComponent
            selfStream={selfStream}
            peers={peers}
            peerStreams={peerStreams}

            isMicActive={props.micState}
            isVideoActive={props.videoState}
            isRecording={isRecording}

            handleCopyLink={handleCopyLink}
            handleToggleMic={handleToggleMic}
            handleToggleVideo={handleToggleVideo}
            handleLeave={handleLeave}
            toggleRecording={toggleRecording}

            peersWithMicsOff={peersWithMicsOff}
            peersWithVideosOff={peersWithVideosOff}
            topicID={props.topicID}
            isChatDrawerOpen={props.isChatDrawerOpen}
            toggleChatDrawer={props.toggleChatDrawer}
            meetingCode={props.code}
        />
    )

}

export default WebRTCContainer
