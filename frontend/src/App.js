import { BrowserRouter as Router } from "react-router-dom"

import { createMuiTheme } from "@material-ui/core/styles"
import { ThemeProvider } from "@material-ui/core"

import BaseRouter from "./routes"
import themes from "./common/themes"

import { useSelector } from "react-redux"

const App = () => {
    const theme = (theme) => createMuiTheme({
        palette: themes[theme],
    })

    const currentTheme = useSelector(state => state.user.theme)

    return (
        <Router>
            <ThemeProvider theme={theme(currentTheme)}>
                <BaseRouter />
            </ThemeProvider>
        </Router>
    )
}

export default App;
