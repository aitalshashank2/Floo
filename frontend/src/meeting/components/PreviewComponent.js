import { useEffect, useRef } from "react"

import { makeStyles } from "@material-ui/core/styles"
import {
    Avatar,
    CssBaseline,
    Fab,
    Grid,
    Paper,
    Typography
} from "@material-ui/core"
import FireplaceRoundedIcon from "@material-ui/icons/FireplaceRounded"
import MeetingRoomRoundedIcon from "@material-ui/icons/MeetingRoomRounded"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh"
    },
    videoContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    videoElement: {
        borderRadius: "1px",
        height: "300px",
    },
    paperContainer: {
        borderLeft: "1px solid #8787874d",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    infoContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    fabContainer: {
        margin: theme.spacing(1),
        fontWeight: 700
    },
    fabIcon: {
        marginRight: theme.spacing(1)
    },
    codeTypography: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}))

const PreviewComponent = (props) => {

    const classes = useStyles()
    const videoRef = useRef(null)
    const streamObject = useRef()

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({
            audio: props.micState,
            video: props.videoState ? {
                width: 1280,
                height: 720
            } : props.videoState
        }).then(stream => {
            let video = videoRef.current
            video.srcObject = stream
            streamObject.current = stream
            video.play()
        }).catch(err => {
            console.log("error: ", err)
        })

        
    }, [videoRef])

    useEffect(() => {

        return () => {
            // Stop all tracks while unmounting
            streamObject.current.getTracks().map(t => t.stop())
        }

    }, [])

    return (
        // <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        //     <video ref={videoRef} autoPlay controls={false} playsInline style={{width: "1200px", borderRadius: "1em"}} />
        // </div>
        <Grid container component="main" className={classes.root}>

            <CssBaseline />

            <Grid
                item
                md={7}
                sm={12}
                xs={12}
                className={classes.videoContainer}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    controls={false}
                    playsInline
                    className={classes.videoElement}
                    muted
                    onContextMenu={e => {e.preventDefault()}}
                />
            </Grid>

            <Grid
                item
                md={5}
                sm={12}
                xs={12}
                component={Paper}
                square
                className={classes.paperContainer}
            >
                <div className={classes.infoContainer}>
                    <Avatar className={classes.avatar}>
                        <FireplaceRoundedIcon />
                    </Avatar>
                    <Typography variant="h5" className={classes.codeTypography}>
                        {props.code}
                    </Typography>
                    
                    <Fab
                        color="secondary"
                        variant="extended"
                        className={classes.fabContainer}
                        onClick={() => props.handleJoin()}
                    >
                        <MeetingRoomRoundedIcon className={classes.fabIcon} />
                        Join Now
                    </Fab>
                </div>
            </Grid>

        </Grid>
    )

}

export default PreviewComponent
