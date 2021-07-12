import axios from "axios"

import { apiMeetingCreate, apiMeetingCreateWithTeam } from "../../endpoints"
import { dispatchError, dispatchPending, dispatchSuccess } from "./state/creationDispatchers"

/**
 * Make a request to the backend for creating a new meeting and update the store accordingly.
 * 
 * If the code is provided, a meeting with the given code is created, 
 * else, a custom meeting without a team is created.
 * 
 * @param {Dispatch} dispatch Hook used for dispatching the response received from backend
 * @param {string} code Code of the team in which the meeting is being created
 */
export const createMeeting = (dispatch, code = undefined) => {

    dispatchPending(dispatch)

    if (code) {
        axios.get(apiMeetingCreateWithTeam(code)).then(res => {
            dispatchSuccess(dispatch, res.data.code)
        }).catch(err => {
            dispatchError(dispatch, err.response.data)
        })
    } else {
        axios.get(apiMeetingCreate).then(res => {
            dispatchSuccess(dispatch, res.data.code)
        }).catch(err => {
            dispatchError(dispatch, err.response.data)
        })
    }

}
