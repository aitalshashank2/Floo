import {
    Snackbar
} from "@material-ui/core"
import MuiAlert from "@material-ui/lab/Alert"

const Alert = (props) => {
    return <MuiAlert elevation={6} {...props} />
}

const NotificationComponent = (props) => {

    return (
        <Snackbar
            open={props.notificationState.open}
            autoHideDuration={6000}
            onClose={() => props.handleClose()}
        >
            <Alert
                severity={props.notificationState.severity}
                variant={props.variant}
            >
                {props.notificationState.message}
            </Alert>
        </Snackbar>
    )
}

export default NotificationComponent
