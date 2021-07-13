import {
    Avatar,
    CssBaseline,
    Grid,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import FireplaceRoundedIcon from "@material-ui/icons/FireplaceRounded"

/**
 * Styles for custom material ui styling
 */
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

/**
 * Component for rendering a view where users can create or join a team
 * 
 * @param {Object} props 
 * 
 * @param {boolean} props.isCodeNull `true` if the team code entered (to join) is empty
 * @param {string} props.errorTextCode Error text to be displayed below `Join Team` text field
 * @param {boolean} props.isNull `true` if the name of the new team is empty
 * 
 * @callback props.handleCode Function that handles the event in which the user types something in the text field for joining a team
 * @callback props.handleJoin Function that handles the event in which the user wants to join the team
 * @callback props.handleName Function that handles the event in which the user types something in the text field for creating a team
 * @callback props.handleCreate Function that handles the event in which the user wants to create a team
 * 
 * @returns {JSX.Element} TeamCreationComponent
 */
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
