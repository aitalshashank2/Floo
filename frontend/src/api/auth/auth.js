import axios from "axios"

import { 
    apiUserLogin,
    apiUserLogout
} from "../../endpoints"

import {
    dispatchErrorDetails,
    dispatchPendingState,
    dispatchUserDetails
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

export const performLogout = () => {

    axios.get(apiUserLogout).then(res => {
        // Pass
    }).catch(err => {
        // Pass
    })

}
