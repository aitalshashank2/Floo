import {
    Grid,
    CssBaseline,
    Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh"
    },
    innerContainer: {
        textAlign: "center"
    }
}))

const Page404Component = () =>{

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
            <div className={classes.innerContainer}>
                <Typography variant="h1" component="h1">
                    404
                </Typography>
                <Typography variant="h3" component="h3">
                    Foundn't!
                </Typography>
            </div>
        </Grid>
    )
}

export default Page404Component
