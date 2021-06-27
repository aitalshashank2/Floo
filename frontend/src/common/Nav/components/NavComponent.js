import {
    AppBar,
    IconButton,
    Toolbar,
    Tooltip,
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import NightsStayOutlinedIcon from "@material-ui/icons/NightsStayOutlined"


const NavComponent = (props) => {

    const useStyles = makeStyles((theme) => ({
        title: {
            flexGrow: 1,
            fontWeight: 700
        }
    }))

    const classes = useStyles()

    return (
        <AppBar position="absolute">
            <Toolbar>
                <Typography variant="h5" className={classes.title}>
                    Floo
                </Typography>
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
