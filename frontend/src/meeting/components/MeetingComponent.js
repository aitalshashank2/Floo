import { useEffect, useState } from "react"

import { makeStyles } from "@material-ui/core/styles"
import {
    Avatar,
    Card,
    CardMedia,
    CssBaseline,
    Drawer,
    Grid,
    Tooltip,
    Typography
} from "@material-ui/core"
import CallEndIcon from "@material-ui/icons/CallEnd"
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import LinkIcon from '@material-ui/icons/Link';
import MicIcon from "@material-ui/icons/Mic"
import MicOffIcon from "@material-ui/icons/MicOff"
import VideocamIcon from "@material-ui/icons/Videocam"
import VideocamOffIcon from "@material-ui/icons/VideocamOff"

import Chat from "../../chat/ChatContainer"

/**
 * Component for rendering the meeting view
 * 
 * @param {Object} props 
 * 
 * @param {boolean} props.isChatDrawerOpen `true` if chat drawer is open
 * @param {number} props.topicID The ID of the topic that the meeting is linked to (if available)
 * @param {string} props.meetingCode The code of the ongoing meeting
 * 
 * @param {MediaStream} props.selfStream Contains the media stream of the user
 * @param {Array<string>} props.peers List of the uuids of the participants
 * @param {Object<string, MediaStream>} props.peerStreams Dictionary mapping media streams of the peers with their uuids
 * @param {Array<string>} props.peersWithVideosOff List of the uuids of all the participants with their video off
 * 
 * @param {boolean} props.isMicActive `true` is microphone is active
 * @param {boolean} props.isVideoActive `true` if video is active
 * @param {boolean} props.isRecording `true` if screen recording is turned on
 * 
 * @callback props.handleCopyLink Function that copies the meeting link to clipboard
 * @callback props.handleToggleMic Function that toggles the state of microphone
 * @callback props.handleToggleVideo Function that toggles the state of video feed
 * @callback props.toggleChatDrawer Function that toggles the chat drawer
 * @callback props.toggleRecording Function that toggles the recording state
 * @callback props.handleLeave Function that removes the user from the meeting
 * 
 * @returns {JSX.Element} MeetingComponent
 */
const MeetingComponent = (props) => {

    const drawerWidth = 350

    /**
     * Styles for custom material ui styling
     */
    const useStyles = makeStyles((theme) => ({
        '@global': {
            '*::-webkit-scrollbar': {
                width: '0.4em'
            },
            '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '*::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.9)',
                outline: `1px solid ${theme.palette.background.default}`
            }
        },
        root: {
            height: "100vh",
            paddingRight: props.isChatDrawerOpen ? `${drawerWidth}px` : 0
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
            bottom: "1vh",
            right: props.isChatDrawerOpen ? `${drawerWidth + 10}px` : `10px`,
            borderRadius: "10px",
            zIndex: "-1"
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
        avatarActive: {
            margin: theme.spacing(1),
            backgroundColor: "#999999",
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
        },
        chatContainer: {
            width: `${drawerWidth}px`,
            height: "100%",
            paddingBottom: theme.spacing(3)
        }
    }))

    const classes = useStyles()
    const [scale, setScale] = useState(100)

    useEffect(() => {

        // Render self video
        document.getElementById(`video-self`).srcObject = props.selfStream

        // For each of the peers, find the video element and set source for each of the elements
        props.peers.forEach((peer) => {
            if (props.peerStreams[peer.uuid]) {
                if (props.peerStreams[peer.uuid].getVideoTracks().length !== 0 && !props.peersWithVideosOff.includes(peer.uuid)) {
                    document.getElementById(`video-${peer.uuid}`).srcObject = props.peerStreams[peer.uuid]
                }
            }
        })

        setScale(100 / (1.5 * (Math.ceil(Math.sqrt(props.peers.length)))))

    }, [props])

    return (


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

            <Drawer
                variant="persistent"
                anchor="right"
                open={props.isChatDrawerOpen}
            >
                <div className={classes.chatContainer}>
                    <Chat
                        topicID={props.topicID}
                        meetingCode={props.meetingCode}
                    />
                </div>
            </Drawer>

            <Grid
                justify="center"
                alignItems="center"
                container
                spacing={3}
                className={classes.galleryGrid}
            >

                {
                    props.peers.length === 0
                        ?
                        <div>No one else is here</div>
                        :
                        props.peers.map((peer, i) => {
                            if (props.peerStreams[peer.uuid]) {
                                const vts = props.peerStreams[peer.uuid].getVideoTracks()
                                const showImage = vts.length === 0 || props.peersWithVideosOff.includes(peer.uuid)

                                return (

                                    <div key={i}>
                                        <Card
                                            className={classes.mediaCard}
                                            hidden={!showImage}
                                        >
                                            <div
                                                className={classes.imageContainer}
                                                style={{
                                                    width: `${scale}vw`,
                                                    height: `${scale * 720 / 1280}vw`
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
                                        <Card
                                            className={classes.mediaCard}
                                            hidden={showImage}
                                        >
                                            <CardMedia
                                                component="video"
                                                hidden={showImage}
                                                autoPlay
                                                style={{
                                                    width: `${scale}vw`,
                                                    height: `${scale * 720 / 1280}vw`
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
                                    </div>
                                )
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
                    props.isRecording
                        ?
                        <Tooltip title="Stop recording" onClick={() => props.toggleRecording()}>
                            <Avatar className={classes.avatarRed}>
                                <FiberManualRecordIcon />
                            </Avatar>
                        </Tooltip>
                        :
                        <Tooltip title="Start recording" onClick={() => props.toggleRecording()}>
                            <Avatar className={classes.avatar}>
                                <FiberManualRecordIcon />
                            </Avatar>
                        </Tooltip>

                }
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
                <Tooltip title="Chat" onClick={() => props.toggleChatDrawer()}>
                    <Avatar className={props.isChatDrawerOpen ? classes.avatarActive : classes.avatar}>
                        <ChatOutlinedIcon />
                    </Avatar>
                </Tooltip>
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
