import {
    CssBaseline,
    Fab,
    Grid,
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh"
    },
    meetingsContainer: {
        textAlign: "center"
    },
    fab: {
        margin: theme.spacing(1)
    }
}))

const WarningOtherMeetingComponent = (props) => {

    const classes = useStyles()

    return (
        <Grid
            container
            component="main"
            className={classes.root}
            justify="center"
            alignItems="center"
        >

            <CssBaseline />

            <div className={classes.meetingsContainer}>
                You are already in the following meetings: <br />
                {
                    props.otherMeetings.map(meeting => {
                        return (
                            <Typography key={meeting.code}>
                                {meeting.code}
                            </Typography>
                        )
                    })
                }
                <Typography variant="h6">
                    Do you want to proceed?
                </Typography>
                <Fab
                    variant="extended"
                    onClick={() => props.handleProceedToMeeting()}
                    className={classes.fab}
                >
                    Proceed
                </Fab>
                <Fab
                    variant="extended"
                    color="secondary" onClick={() => props.goToHome()}
                    className={classes.fab}
                >
                    Dashboard
                </Fab>
            </div>

        </Grid>
    )

}

export default WarningOtherMeetingComponent
