import { makeStyles } from "@material-ui/core/styles"
import {
    Avatar,
    CssBaseline,
    Fab,
    Grid,
    Hidden,
    Paper
} from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import FireplaceRoundedIcon from "@material-ui/icons/FireplaceRounded"

import logo from "../../common/assets/green-fire.png"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh"
    },
    image: {
        width: "25%"
    },
    imageContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    paperContainer: {
        borderLeft: "1px solid #8787874d",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    fabContainer: {
        margin: theme.spacing(1),
        fontWeight: 700
    },
    fabIcon: {
        marginRight: theme.spacing(1)
    },
    buttonTypography: {
        fontWeight: 700
    }
}))

const DashboardComponent = (props) => {

    const classes = useStyles()

    return (
        <Grid container component="main" className={classes.root}>

            <CssBaseline />

            <Hidden smDown>
                <Grid
                    item
                    md={7}
                    className={classes.imageContainer}
                >
                    <img
                        src={logo}
                        alt="Floo Logo"
                        className={classes.image}
                    />
                </Grid>
            </Hidden>

            <Grid
                item
                xs={12}
                sm={12}
                md={5}
                component={Paper}
                square
                className={classes.paperContainer}
            >
                <div className={classes.formContainer}>
                    <Avatar className={classes.avatar}>
                        <FireplaceRoundedIcon />
                    </Avatar>
                    <Fab
                        color="secondary"
                        variant="extended"
                        className={classes.fabContainer}
                        onClick={() => props.handleCreate()}
                    >
                        <AddIcon className={classes.fabIcon} />
                            Create Meeting
                    </Fab>
                </div>
            </Grid>

        </Grid>
    )
}

export default DashboardComponent
