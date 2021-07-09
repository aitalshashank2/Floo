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
        border: "1px solid #8787874d",
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

            <Grid
                item
                xs={12}
                sm={12}
                md={6}
                component={Paper}
                square
                className={classes.paperContainer}
            >
                <div className={classes.container}>
                    <Typography variant="h4" component="h4">
                        Join Team
                    </Typography>
                    <div className={classes.formContainer}>
                        <TextField
                            required
                            label="Team Code"
                            variant="outlined"
                            color="secondary"
                            onChange={(e) => props.handleCode(e.target.value)}
                            error={props.isCodeNull}
                            fullWidth
                            helperText={props.errorTextCode}
                        />
                        <div className={classes.avatarContainer}>
                            <Tooltip title="Join">
                                <Avatar className={classes.avatar}>
                                    <IconButton color="inherit" onClick={() => props.handleJoin()}>
                                        <FireplaceRoundedIcon />
                                    </IconButton>
                                </Avatar>
                            </Tooltip>
                        </div>
                    </div>
                </div>

            </Grid>

            <Grid
                item
                xs={12}
                sm={12}
                md={6}
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
                                    <IconButton color="inherit" onClick={() => props.handleCreate()}>
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
