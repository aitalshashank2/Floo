import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import axios from 'axios'

import App from './components/App'
import { store } from './store'

axios.defaults.xsrfCookieName = 'floo_csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <Route path='/' component={App} />
            </Router>
        </Provider>
    </React.StrictMode>
    ,
    document.getElementById('root')
);
