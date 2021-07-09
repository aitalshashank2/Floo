import {
    Avatar,
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
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core"
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'

const useStyles = makeStyles((theme) => ({
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
    flexCenteredContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%"
    }
}))

const TeamDashboardComponent = (props) => {

    const classes = useStyles()

    return (
        <Grid
            container
            component="main"
            className={classes.root}
        >

            <CssBaseline />

            <Dialog
                open={props.isSettingsDialogueOpen}
                onClose={props.closeSettingsDialogue}
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



            {
                (props.teamInfo.members.length <= 1)
                ?
                (
                    <div className={classes.flexCenteredContainer}>
                        <Typography variant="body2">
                            Looks like no one else is here
                        </Typography>
                    </div>
                )
                :
                (
                    <div>

                    </div>
                )
            }



        </Grid>
    )
}

export default TeamDashboardComponent
