import {
    CircularProgress,
    CssBaseline
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    }
}))

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
