import { useEffect, useRef } from "react"

import {
    Card,
    CardContent,
    CssBaseline,
    Fab,
    Grid,
    Typography,
    TextField
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import SendOutlinedIcon from '@material-ui/icons/SendOutlined'

import { Scrollbars } from 'react-custom-scrollbars'

var moment = require('moment')

/**
 * Styles for custom material ui styling
 */
const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        width: "100%"
    },
    bottomBar: {
        position: "absolute",
        width: "90%",
        display: "grid",
        gridTemplate: "1fr / 1fr 75px"
    },
    textField: {
        gridArea: "1 / 1 / 2 / 2",
        zIndex: 9
    },
    buttonContainer: {
        gridArea: "1 / 2 / 2 / 3",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9
    },
    chatContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingBottom: "5em"
    },
    contentSavingWarning: {
        backgroundColor: theme.palette.background.default,
        textAlign: "center"
    }
}))

/**
 * Component for rendering messages in a particular chat
 * 
 * @param {Object} props
 * 
 * @param {Array<Object>} props.message Arrays of objects containing Objects
 * @param {string} props.newMessage Variable storing the contents of TextField where user types new messages
 * @param {boolean} props.showContentSavingWarning Boolean deciding if the message warning about messages not being saved should be displayed
 * 
 * @callback props.handleTextBox Function handling changes in message TextField
 * @callback props.handleSend Function that handles if the button for sending message is clicked
 * 
 * @returns {JSX.Element} ChatComponent
 */
const ChatComponent = (props) => {

    const classes = useStyles()

    // Reference to an empty div element to scroll the chat window down
    const scrollRef = useRef()

    useEffect(() => {
        scrollRef.current.scrollIntoView()
    }, [props.messages])

    return (
        <Grid
            container
            component="main"
            className={classes.root}
            justify="center"
            alignItems="flex-end"
        >

            <CssBaseline />

            <div className={classes.chatContainer}>

                <Scrollbars style={{ height: "100%", width: "100%" }}>
                    {
                        props.showContentSavingWarning &&
                        (
                            <Card>
                                <CardContent variant="caption" className={classes.contentSavingWarning}>
                                    This meeting is not created from within a team and hence the messages can
                                    only be seen by people in the call. The messages are not saved and are unavailable
                                    when the call ends. If the messages need to be preserved, please organize a meeting
                                    from within a team.
                                </CardContent>
                            </Card>
                        )
                    }
                    {
                        props.messages.map(message => {
                            return (
                                <Card key={message.id}>
                                    <CardContent>
                                        <Typography variant="overline">
                                            {`${message.sender.full_name} • ${moment(message.publish_time).format('LLL')}`}
                                        </Typography>
                                        <Typography variant="body2">
                                            {message.body}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                    <div ref={scrollRef} />
                </Scrollbars>

            </div>

            <div className={classes.bottomBar}>
                <TextField
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    multiline
                    placeholder="Type a message"
                    className={classes.textField}
                    value={props.newMessage}
                    onChange={(e) => props.handleTextBox(e.target.value)}
                />
                <div className={classes.buttonContainer}>
                    <Fab color="primary" onClick={props.handleSend}>
                        <SendOutlinedIcon />
                    </Fab>
                </div>
            </div>

        </Grid>
    )

}

export default ChatComponent
