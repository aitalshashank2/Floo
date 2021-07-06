import { useEffect } from "react"

const MeetingComponent = (props) => {

    useEffect(() => {

        // console.log(props.selfStream)
        // console.log(props.selfStream.current)

        document.getElementById(`video-self`).srcObject = props.selfStream

        props.peers.forEach((peer) => {
            document.getElementById(`video-${peer.uuid}`).srcObject = props.peerStreams[peer.uuid]
        })

    }, [props])

    return (
        <div>
            <video
                autoPlay
                muted
                playsInline
                controls={false}
                id={`video-self`}
                onContextMenu={e => {e.preventDefault()}}
            />
            {
                props.peers.map((peer, i) => {
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
