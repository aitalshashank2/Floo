import {
    AppBar,
    IconButton,
    Toolbar,
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import NightsStayOutlinedIcon from '@material-ui/icons/NightsStayOutlined'

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
                <IconButton color="inherit" onClick={() => props.changeTheme()}>
                    <NightsStayOutlinedIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )

}

export default NavComponent
