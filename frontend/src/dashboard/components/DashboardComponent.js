import { makeStyles } from "@material-ui/core/styles"
import {
    Card,
    CardContent,
    CardMedia,
    CssBaseline,
    Grid,
    Typography
} from "@material-ui/core"

import logo from "../../common/assets/green-fire.png"

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
    }
}))

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
                        <Typography variant="body2" component="body">
                            You are not part of any teams yet!
                        </Typography>
                        <Typography variant="h4" component="h4">
                            How about creating one?
                        </Typography>
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
