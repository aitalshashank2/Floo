import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import axios from "axios"

import App from "./App"
import { store } from "./store"

axios.defaults.xsrfCookieName = 'floo_csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
    ,
    document.getElementById('root')
);
