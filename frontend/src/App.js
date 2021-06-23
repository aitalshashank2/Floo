import { BrowserRouter as Router } from "react-router-dom"

import { createMuiTheme } from "@material-ui/core/styles"
import { ThemeProvider } from "@material-ui/core"

import themes from "./common/themes"
import BaseRouter from './routes'

const App = () => {
    const theme = (theme) => createMuiTheme({
        palette: themes[theme],
    })

    return (
        <Router>
            <ThemeProvider theme={theme('dark')}>
                <BaseRouter />
            </ThemeProvider>
        </Router>
    )
}

export default App;
