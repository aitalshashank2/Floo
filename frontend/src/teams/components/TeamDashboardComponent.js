import { useEffect, useRef } from "react"

import {
    Avatar,
    Button,
    Card,
    CardHeader,
    CardContent,
    CssBaseline,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'

import { Scrollbars } from 'react-custom-scrollbars'

var moment = require('moment')

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
        height: "100vh"
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
    memberList: {
        maxWidth: "90%",
        width: "125em"
    },
    codeFab: {
        float: "right"
    },
    mainContainer: {
        maxWidth: "1250px",
        width: "100%",
        height: "100%",
        maxHeight: "100vh",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingLeft: "5em",
        paddingRight: "5em"
    },
    bottomBar: {
        position: "absolute",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        margin: theme.spacing(1)
    },
    topicContainer: {
        width: "100%",
        height: "100vh",
        paddingTop: "5em",
        paddingBottom: "5em"
    },
    textField: {
        marginBottom: theme.spacing(1)
    },
    topicSubmit: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    topicCard: {
        width: "100%",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        cursor: "pointer"
    }
}))

const TeamDashboardComponent = (props) => {

    const classes = useStyles()

    const scrollRef = useRef()

    useEffect(() => {
        if(props.teamInfo.members.length > 1){
            scrollRef.current.scrollIntoView()
        }
    }, [])

    return (
        <Grid
            container
            component="main"
            className={classes.root}
            justify="center"
            alignItems="center"
        >

            <CssBaseline />

            <Dialog
                open={props.isSettingsDialogOpen}
                onClose={props.closeSettingsDialog}
                scroll="body"
            >
                <DialogTitle style={{ width: "100%" }}>
                    {props.teamInfo.name}
                    <Fab
                        variant="extended"
                        size="small"
                        className={classes.codeFab}
                        onClick={() => props.handleCopyTeamCode()}
                    >
                        <FileCopyOutlinedIcon className={classes.extendedIcon} />
                        <Typography variant="body2">
                            {props.teamInfo.code}
                        </Typography>
                    </Fab>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Team Members
                    </Typography>
                    <List className={classes.memberList}>
                        {
                            props.teamInfo.members.map(member => {
                                return (
                                    <ListItem key={member.uuid}>
                                        <ListItemAvatar>
                                            <Avatar alt={member.full_name} src={member.profile_picture} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={member.full_name}
                                        />
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </DialogContent>
            </Dialog>

            <Dialog
                open={props.isCreateTopicDialogOpen}
                onClose={props.closeCreateTopicDialog}
                scroll="body"
            >
                <DialogTitle>Start new Topic of Discussion</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        label="Topic Title"
                        variant="outlined"
                        color="secondary"
                        className={classes.textField}
                        onChange={(e) => props.handleCreateTopicTitle(e.target.value)}
                        error={props.isCreateTopicTitleNull}
                        fullWidth
                    />
                    <TextField
                        required
                        label="Topic Description"
                        variant="outlined"
                        color="secondary"
                        className={classes.textField}
                        onChange={(e) => props.handleCreateTopicDescription(e.target.value)}
                        error={props.isCreateTopicDescriptionNull}
                        fullWidth
                        multiline
                    />
                    <Button
                        variant="outlined"
                        fullWidth
                        className={classes.topicSubmit}
                        onClick={props.handleCreateTopicPublish}
                    >
                        Publish Topic
                    </Button>
                </DialogContent>
            </Dialog>

            <Dialog
                open={props.isTopicDialogOpen}
                onClose={props.closeTopicDialog}
                scroll="body"
            >
                <DialogTitle>{props.topicDialogID}</DialogTitle>
            </Dialog>

            {
                (props.teamInfo.members.length <= 1)
                    ?
                    (
                        <Typography variant="body2" style={{ textAlign: "center" }}>
                            Looks like no one else is here. <br />
                            Invite others by clicking the gear icon
                        </Typography>
                    )
                    :
                    (
                        <div className={classes.mainContainer}>

                            <div className={classes.topicContainer}>
                                <Scrollbars style={{ height: "100%", width: "100%" }}>
                                    {
                                        props.teamInfo.topics.map(topic => {
                                            return (
                                                <Card key={topic.id} className={classes.topicCard} onClick={() => {props.openTopicDialog(topic.id)}}>
                                                    <CardHeader
                                                        avatar={
                                                            <Avatar
                                                                alt={topic.creator.full_name}
                                                                src={topic.creator.profile_picture}
                                                            />
                                                        }
                                                        title={topic.title}
                                                        subheader={
                                                            <>
                                                                {`${topic.creator.full_name} • ${moment(topic.publish_time).format('LLL')}`}
                                                            </>
                                                        }
                                                    />
                                                    <CardContent>
                                                        <Typography variant="body2">
                                                            {topic.description}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })
                                    }
                                    <div ref={scrollRef} style={{display: "block",}} ></div>
                                </Scrollbars>
                            </div>

                            <div className={classes.bottomBar}>
                                <Tooltip title="Start a discussion" onClick={() => props.openCreateTopicDialog()}>
                                    <Fab color="primary" className={classes.icon}>
                                        <AddIcon />
                                    </Fab>
                                </Tooltip>
                            </div>

                        </div>
                    )
            }



        </Grid>
    )
}

export default TeamDashboardComponent
