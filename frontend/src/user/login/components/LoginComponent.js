import { makeStyles } from '@material-ui/core/styles'

import { 
    Avatar,
    Hidden,
    Button,
    CssBaseline,
    Grid,
    Paper,
    Typography
 } from '@material-ui/core'

import logo from '../../../common/assets/green-fire.png'
import FirePlaceRoundedIcon from '@material-ui/icons/FireplaceRounded'

const LoginComponent = (props) => {

    const useStyles = makeStyles((theme) => ({
        root: {
            height: "100vh",
        },
        image: {
            width: "40%",
        },
        imageContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        paperContainer: {
            borderLeft: "1px solid #8787874d",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main
        },
        formContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        },
        form: {
            width: "100%",
            marginTop: theme.spacing(1),
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        },
    }))

    const classes = useStyles()

    return (
        <Grid container component="main" className={classes.root}>

            <CssBaseline />

            <Hidden smDown>
                <Grid
                    item
                    md={7}
                    className={classes.imageContainer}
                >
                    <img
                        src={logo}
                        alt="Floo Logo"
                        className={classes.image}
                    />
                </Grid>
            </Hidden>

            <Grid
                item
                xs={12}
                sm={12}
                md={5}
                component={Paper}
                square
                className={classes.paperContainer}
            >
                <div className={classes.formContainer}>
                    <Avatar className={classes.avatar}>
                        <FirePlaceRoundedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h3">
                        Welcome to Floo
                    </Typography>
                    <br />
                    <form className={classes.form}>
                        <Button
                            variant="contained"
                            color="secondary"
                            href={props.googleRedirect}
                        >
                            Sign in with Google
                        </Button>
                    </form>
                </div>
            </Grid>


        </Grid>
    )
}

export default LoginComponent
