import { useSelector } from "react-redux"

import {
    AppBar,
    IconButton,
    Toolbar,
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

    const apiState = useSelector(state => state.user.apiState)

    return (
        <AppBar position="absolute">
            <Toolbar>
                <Typography variant="h5" className={classes.title}>
                    Floo
                </Typography>
                <IconButton color="inherit" onClick={() => props.changeTheme()}>
                    <NightsStayOutlinedIcon />
                </IconButton>
                {(apiState === "success") && (<IconButton color="inherit" onClick={() => props.logout()}>
                    <ExitToAppIcon />
                </IconButton>)}
            </Toolbar>
        </AppBar>
    )

}

export default NavComponent
