import { makeStyles } from "@material-ui/core/styles"
import {
    Card,
    CardContent,
    CardMedia,
    CssBaseline,
    Fab,
    Grid,
    Typography
} from "@material-ui/core"
import GroupWorkOutlinedIcon from '@material-ui/icons/GroupWorkOutlined'

import logo from "../../common/assets/green-fire.png"

/**
 * Styles for custom material ui styling
 */
const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh"
    },
    card: {
        maxWidth: "250px",
        margin: theme.spacing(1),
        cursor: "pointer"
    },
    content: {
        width: "100%",
        display: "flex",
        justifyContent: "center"
    },
    zeroTeamsContainer: {
        textAlign: "center"
    },
    icon: {
        margin: theme.spacing(1),
        fontSize: "3em"
    }
}))

/**
 * Component for rendering the dashboard where all the teams will be displayed
 * 
 * @param {Object} props 
 * 
 * @param {Object} props.userDetails Information about the current user
 * 
 * @callback props.handleCreateJoinTeam Handle when the user clicks the button for creating or joining a team
 * @callback props.handleTeamClick Handle when the user clicks a team
 * 
 * @returns {JSX.Element} DashboardComponent
 */
const DashboardComponent = (props) => {

    const classes = useStyles()

    return (
        <Grid
            container
            component="main"
            className={classes.root}
            justify="center"
            alignItems="center"
        >

            <CssBaseline />

            {
                props.userDetails &&
                    (props.userDetails.teams.length === 0)
                    ?
                    (
                        <div className={classes.zeroTeamsContainer}>
                            <Typography variant="body2" component="p">
                                You are not part of any teams yet!
                            </Typography>
                            <Typography variant="h4" component="h4">
                                How about creating one?
                            </Typography>

                            <Fab color="primary" onClick={() => props.handleCreateJoinTeam()}>
                                <GroupWorkOutlinedIcon className={classes.icon} />
                            </Fab>
                        </div>
                    )
                    :
                    (
                        props.userDetails.teams.map(team => {
                            return (
                                <Card className={classes.card} key={team.code} onClick={() => props.handleTeamClick(team.code)}>
                                    <CardMedia
                                        component="img"
                                        src={logo}
                                        title={team.code}
                                    />
                                    <CardContent className={classes.content}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {team.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )
                        })
                    )
            }

        </Grid>
    )
}

export default DashboardComponent
