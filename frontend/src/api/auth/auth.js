import axios from "axios"

import {
    apiUserLogin,
    apiUserLogout,
    apiUserVerify
} from "../../endpoints"

import {
    dispatchErrorDetails,
    dispatchPendingState,
    dispatchUserDetails,
    dispatchLogout
} from "./state/dispatchers"

/**
 * Make a login request to the backend while sending the authorization code to the backend
 * 
 * @param {string} code The autorization code to be sent to the backend
 * @param {Dispatch} dispatch Hook used for dispatching the response received from backend
 */
export const performLogin = (code, dispatch) => {

    dispatchPendingState(dispatch)
    axios.post(apiUserLogin, {
        code: code
    }).then(res => {
        dispatchUserDetails(dispatch, res.data)
    }).catch(err => {
        dispatchErrorDetails(dispatch, err.response.data.error)
    })

}

/**
 * Make a logout request to the backend
 * 
 * @param {Dispatch} dispatch Hook used for dispatching the response received from backend
 */
export const performLogout = (dispatch) => {

    dispatchLogout(dispatch)
    axios.get(apiUserLogout).then(res => {
        // Pass
    }).catch(err => {
        // Pass
    })

}

/**
 * Make a verify request to the backend.
 * Depending on the response, dispatch user details or error details
 * 
 * @param {Dispatch} dispatch 
 */
export const performVerify = (dispatch) => {

    axios.get(apiUserVerify).then(res => {
        dispatchUserDetails(dispatch, res.data)
    }).catch(err => {
        dispatchErrorDetails(dispatch, err.response.data.error)
    })

}
