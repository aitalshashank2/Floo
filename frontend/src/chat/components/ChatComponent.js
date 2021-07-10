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
    }
}))

const ChatComponent = (props) => {

    const classes = useStyles()

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
