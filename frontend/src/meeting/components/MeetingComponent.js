import { useEffect, useState } from "react"

import { makeStyles } from "@material-ui/core/styles"
import {
    Avatar,
    Card,
    CardMedia,
    CssBaseline,
    Grid
} from "@material-ui/core"
import CallEndIcon from "@material-ui/icons/CallEnd"
import MicIcon from "@material-ui/icons/Mic"
import MicOffIcon from "@material-ui/icons/MicOff"
import VideocamIcon from "@material-ui/icons/Videocam"
import VideocamOffIcon from "@material-ui/icons/VideocamOff"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh"
    },
    gallery: {
        height: "85vh",
        width: "100%",
        marginTop: "7vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    controlsContainer: {
        height: "8vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    selfVideo: {
        height: "150px",
        position: "absolute",
        bottom: "6vh",
        right: "10px",
        borderRadius: "10px",
        zIndex: "6"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "#666666",
        cursor: "pointer"
    },
    avatarLeave: {
        margin: theme.spacing(1),
        backgroundColor: "red",
        cursor: "pointer"
    },
    galleryGrid: {
        height: "85vh",
        width: "100%",
        marginTop: "7vh",
    },
    mediaCard: {
        margin: "0 10px 0 10px"
    }
}))

const MeetingComponent = (props) => {

    const classes = useStyles()
    const [scale, setScale] = useState(100)

    useEffect(() => {

        // console.log(props.selfStream)
        // console.log(props.selfStream.current)

        document.getElementById(`video-self`).srcObject = props.selfStream

        props.peers.forEach((peer) => {
            document.getElementById(`video-${peer.uuid}`).srcObject = props.peerStreams[peer.uuid]
        })

        setScale(100 / (1.5 * (Math.ceil(Math.sqrt(props.peers.length)))))

    }, [props])

    return (

        // </div>
        <Grid container component="main" className={classes.root} alignItems="center" justify="center">

            <CssBaseline />

            <video
                autoPlay
                muted
                playsInline
                controls={false}
                id={`video-self`}
                className={classes.selfVideo}
                onContextMenu={e => { e.preventDefault() }}
            />

            <Grid justify="center" alignItems="center" container spacing={3} className={classes.galleryGrid}>

                {
                    props.peers.length === 0
                    ?
                    <div>No one else is here</div>
                    :
                    props.peers.map((peer, i) => {
                        return (
                            <Card className={classes.mediaCard}>
                                <CardMedia
                                    component="video"
                                    autoPlay
                                    style={{
                                        width: `${scale}vw`,
                                    }}
                                    id={`video-${peer.uuid}`}
                                />
                            </Card>
                        )
                    })
                }
            </Grid>

            <div className={classes.controlsContainer}>
                <Avatar className={classes.avatar}>
                    <MicIcon />
                </Avatar>
                <Avatar className={classes.avatar}>
                    <VideocamIcon />
                </Avatar>
                <Avatar className={classes.avatarLeave}>
                    <CallEndIcon />
                </Avatar>
            </div>

        </Grid>
    )
}

export default MeetingComponent
