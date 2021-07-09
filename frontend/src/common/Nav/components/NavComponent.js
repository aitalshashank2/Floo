import {
    AppBar,
    IconButton,
    Toolbar,
    Tooltip,
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import GroupWorkOutlinedIcon from '@material-ui/icons/GroupWorkOutlined'
import NightsStayOutlinedIcon from "@material-ui/icons/NightsStayOutlined"
import VideoCallOutlinedIcon from '@material-ui/icons/VideoCallOutlined'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'


const NavComponent = (props) => {

    const useStyles = makeStyles((theme) => ({
        title: {
            flexGrow: 1,
            fontWeight: 700
        },
        pointer: {
            cursor: "pointer",
            width: "fit-content"
        }
    }))

    const classes = useStyles()

    return (
        <AppBar position="absolute">
            <Toolbar>
                <Typography variant="h5" className={classes.title}>
                    <div className={classes.pointer} onClick={() => props.clickHome()}>
                        Floo
                    </div>
                </Typography>
                {(props.apiState === "success") && (
                    <Tooltip title="Start an Instant Meeting">
                        <IconButton color="inherit" onClick={() => props.createInstantMeeting()}>
                            <VideoCallOutlinedIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                )}
                {(props.apiState === "success") && ((props.teamCode)
                    ?
                    (
                        <Tooltip title="Manage Team">
                            <IconButton color="inherit" onClick={() => props.manageTeam()}>
                                <SettingsOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )
                    :
                    (
                        <Tooltip title="Create or Join Team">
                            <IconButton color="inherit" onClick={() => props.createTeam()}>
                                <GroupWorkOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )
                )}
                <Tooltip title="Change Theme">
                    <IconButton color="inherit" onClick={() => props.changeTheme()}>
                        <NightsStayOutlinedIcon />
                    </IconButton>
                </Tooltip>
                {(props.apiState === "success") && (
                    <Tooltip title="Logout">
                        <IconButton color="inherit" onClick={() => props.logout()}>
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </AppBar>
    )

}

export default NavComponent
