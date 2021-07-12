import {
    CircularProgress,
    CssBaseline
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

/**
 * Styles for custom material ui styling
 */
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    }
}))

/**
 * Component for rendering a green loader in the middle of the screen
 * 
 * @returns {JSX.Element} LoaderComponent
 */
const LoaderComponent = () => {

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <CssBaseline />
            <CircularProgress color="secondary" />
        </div>
    )

}

export default LoaderComponent
