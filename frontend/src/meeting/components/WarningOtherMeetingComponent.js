import {
    CssBaseline,
    Fab,
    Grid,
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

/**
 * Styles for custom material ui styling
 */
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

/**
 * Renders a component that warns the user that they are a part of other meeting at the moment
 * 
 * @param {Object} props 
 * 
 * @param {Array<Object>} props.otherMeetings List of the other meetings that the user is a part of
 * 
 * @callback props.handleProceedToMeeting Handle the event in which user chooses to proceed to the meeting
 * @callback props.goToHome Handle the event in which the user chooses to proceed to Home
 * 
 * @returns {JSX.Element} WarningOtherMeetingComponent
 */
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
