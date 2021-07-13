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
 * Renders a circular progress ring while its parent processes login information
 * 
 * @returns {JSX.Element} BrokerComponent
 */
const BrokerComponent = () => {

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <CssBaseline />
            <CircularProgress color="secondary" />
        </div>
    )

}

export default BrokerComponent
