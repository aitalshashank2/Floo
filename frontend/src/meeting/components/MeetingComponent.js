import { useEffect, useState } from "react"

import { makeStyles } from "@material-ui/core/styles"
import {
    Avatar,
    Card,
    CardMedia,
    CssBaseline,
    Grid,
    Tooltip,
    Typography
} from "@material-ui/core"
import CallEndIcon from "@material-ui/icons/CallEnd"
import LinkIcon from '@material-ui/icons/Link';
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
    avatarRed: {
        margin: theme.spacing(1),
        backgroundColor: "red",
        cursor: "pointer"
    },
    galleryGrid: {
        height: "92vh",
        width: "100%",
    },
    mediaCard: {
        margin: "0 10px 0 10px",
        maxHeight: "100%"
    },
    personInfo: {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 6,
    },
    cardName: {
        fontWeight: 700,
        fontSize: "1.1em"
    },
    imageContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    hugeAvatar: {
        width: theme.spacing(11),
        height: theme.spacing(11)
    }
}))

const MeetingComponent = (props) => {

    const classes = useStyles()
    const [scale, setScale] = useState(100)

    useEffect(() => {

        document.getElementById(`video-self`).srcObject = props.selfStream

        props.peers.forEach((peer) => {
            if(props.peerStreams[peer.uuid]){
                if(props.peerStreams[peer.uuid].getVideoTracks().length !== 0 && !props.peersWithVideosOff.includes(peer.uuid)){
                    document.getElementById(`video-${peer.uuid}`).srcObject = props.peerStreams[peer.uuid]
                }
            }
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
                        if(props.peerStreams[peer.uuid]){
                            const vts = props.peerStreams[peer.uuid].getVideoTracks()
                            if(vts.length === 0 || props.peersWithVideosOff.includes(peer.uuid)){

                                return (
                                    <Card className={classes.mediaCard} key={i}>
                                        <div
                                            className={classes.imageContainer}
                                            style={{
                                                width: `${scale}vw`,
                                                height: `${scale*720/1280}vw`
                                            }}
                                        >
                                            <Avatar
                                                alt={peer.full_name}
                                                src={peer.profile_picture}
                                                className={classes.hugeAvatar}
                                            />
                                        </div>
                                        <div className={classes.personInfo}>
                                            <Typography component="p" className={classes.cardName}>
                                                {peer.full_name}
                                            </Typography>
                                        </div>
                                    </Card>
                                )

                            }else{
                                return (
                                    <Card className={classes.mediaCard} key={i}>
                                        <CardMedia
                                            component="video"
                                            autoPlay
                                            style={{
                                                width: `${scale}vw`,
                                                height: `${scale*720/1280}vw`
                                            }}
                                            id={`video-${peer.uuid}`}
                                            onContextMenu={e => e.preventDefault()}
                                        />
                                        <div className={classes.personInfo}>
                                            <Typography component="p" className={classes.cardName}>
                                                {peer.full_name}
                                            </Typography>
                                        </div>
                                    </Card>
                                )
                            }
                        }
                    })
                }
            </Grid>

            <div className={classes.controlsContainer}>
                <Tooltip title="Copy Link" onClick={() => props.handleCopyLink()}>
                    <Avatar className={classes.avatar}>
                        <LinkIcon />
                    </Avatar>
                </Tooltip>
                {
                    props.isMicActive
                    ?
                    <Tooltip title="Turn off microphone" onClick={() => props.handleToggleMic()}>
                        <Avatar className={classes.avatar}>
                            <MicIcon />
                        </Avatar>
                    </Tooltip>
                    :
                    <Tooltip title="Turn on microphone" onClick={() => props.handleToggleMic()}>
                        <Avatar className={classes.avatarRed}>
                            <MicOffIcon />
                        </Avatar>
                    </Tooltip>
                }
                {
                    props.isVideoActive
                    ?
                    <Tooltip title="Turn off Video" onClick={() => props.handleToggleVideo()}>
                        <Avatar className={classes.avatar}>
                            <VideocamIcon />
                        </Avatar>
                    </Tooltip>
                    :
                    <Tooltip title="Turn on Video" onClick={() => props.handleToggleVideo()}>
                        <Avatar className={classes.avatarRed}>
                            <VideocamOffIcon />
                        </Avatar>
                    </Tooltip>
                }
                <Tooltip title="Leave" onClick={() => props.handleLeave()}>
                    <Avatar className={classes.avatarRed}>
                        <CallEndIcon />
                    </Avatar>
                </Tooltip>
            </div>

        </Grid>
    )
}

export default MeetingComponent
