import {
    Grid
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh"
    }
}))

const TeamDashboardComponent = () => {

    const classes = useStyles()

    return (
        <Grid
            container
            component="main"
            className={classes.root}
        >

        </Grid>
    )
}

export default TeamDashboardComponent
