import {
    Snackbar
} from "@material-ui/core"
import MuiAlert from "@material-ui/lab/Alert"

const Alert = (props) => {
    return <MuiAlert elevation={6} {...props} />
}

/**
 * Component for rendering pop up messages
 * 
 * @param {Object} props 
 * 
 * @param {string} props.variant Information about color of alert
 * 
 * @param {Object} props.notificationState Houses information about notification
 * @param {boolean} props.notificationState.open Determines if notification should be shown
 * @param {string} props.notificationState.severity Determines the color of the pop up
 * @param {string} props.notificationState.message Message that is supposed to be displayed
 * 
 * @callback props.handleClose Handle closing of the pop up
 * 
 * @returns {JSX.Element} NotificationComponent
 */
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
