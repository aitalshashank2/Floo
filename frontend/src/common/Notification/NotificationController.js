import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import NotificationComponent from "./components/NotificationComponent"


/**
 * Controller for Notifications
 * 
 * This component houses the logic for rendering the notifications
 * 
 * @returns {JSX.Element} Notification
 */
const Notification = () => {

    const user = useSelector(state => state.user)
    const theme = useSelector(state => state.user.theme)
    const [notifState, changeNotifState] = useState({
        open: false,
        severity: "success",
        message: "Hi there!"
    })
    const handleClose = () => {
        changeNotifState({
            ...notifState,
            open: false
        })
    }

    useEffect(() => {

        if (user.apiState === "success") {
            changeNotifState({
                open: true,
                severity: "success",
                message: `Welcome, ${user.userDetails.full_name}`
            })
        } else if (user.apiState === "error") {
            changeNotifState({
                open: true,
                severity: "error",
                message: user.errorDetails
            })
        }

    }, [user])

    return (
        <NotificationComponent
            notificationState={notifState}
            handleClose={handleClose}
            variant={(theme === "default") ? "filled" : "outlined"}
        />
    )
}

export default Notification
