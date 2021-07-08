import { makeStyles } from "@material-ui/core/styles"
import {
    CssBaseline,
    Grid
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh"
    }
}))

const DashboardComponent = (props) => {

    const classes = useStyles()

    return (
        <Grid container component="main" className={classes.root}>

            <CssBaseline />
            
        </Grid>
    )
}

export default DashboardComponent
