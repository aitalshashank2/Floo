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

export const performLogout = (dispatch) => {

    dispatchLogout(dispatch)
    axios.get(apiUserLogout).then(res => {
        // Pass
    }).catch(err => {
        // Pass
    })

}

export const performVerify = (dispatch) => {

    axios.get(apiUserVerify).then(res => {
        dispatchUserDetails(dispatch, res.data)
    }).catch(err => {
        dispatchErrorDetails(dispatch, err.response.data.error)
    })

}
