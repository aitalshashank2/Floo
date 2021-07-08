import {
    Avatar,
    CssBaseline,
    Grid,
    Hidden,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import FireplaceRoundedIcon from "@material-ui/icons/FireplaceRounded"

import logo from "../../common/assets/green-fire.png"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh"
    },
    imageContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        width: "25%"
    },
    paperContainer: {
        borderLeft: "1px solid #8787874d",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        width: "90%"
    },
    formContainer: {
        display: "grid",
        gridTemplate: "1fr / 1fr 10em",
        width: "100%",
        marginTop: theme.spacing(5)
    },
    TextField: {
        gridArea: "1 / 1 / 2 / 2"
    },
    avatarContainer: {
        gridArea: "1 / 2 / 2 / 3",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    }
}))

const TeamCreationComponent = (props) => {

    const classes = useStyles()

    return (
        <Grid
            container
            component="main"
            className={classes.root}
        >

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
                <div className={classes.container}>
                    <Typography variant="h4" component="h4">
                        Create New Team
                    </Typography>
                    <div className={classes.formContainer}>
                        <TextField
                            required
                            label="Team Name"
                            variant="outlined"
                            color="secondary"
                            onChange={(e) => props.handleName(e.target.value)}
                            error={props.isNameNull}
                            fullWidth
                        />
                        <div className={classes.avatarContainer}>
                            <Tooltip title="Create">
                                <Avatar className={classes.avatar}>
                                    <IconButton color="inherit" onClick={props.handleCreate}>
                                        <FireplaceRoundedIcon />
                                    </IconButton>
                                </Avatar>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </Grid>

        </Grid>
    )
}

export default TeamCreationComponent
