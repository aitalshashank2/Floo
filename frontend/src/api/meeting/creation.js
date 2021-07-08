import axios from "axios"

import { apiMeetingCreate, apiMeetingCreateWithTeam } from "../../endpoints"
import { dispatchError, dispatchPending, dispatchSuccess } from "./state/creationDispatchers"

export const createMeeting = (dispatch, code=undefined) => {

    dispatchPending(dispatch)

    if(code){
        axios.get(apiMeetingCreateWithTeam(code)).then(res => {
            dispatchSuccess(dispatch, res.data.code)
        }).catch(err => {
            dispatchError(dispatch, err.response.data)
        })
    }else{
        axios.get(apiMeetingCreate).then(res => {
            dispatchSuccess(dispatch, res.data.code)
        }).catch(err => {
            dispatchError(dispatch, err.response.data)
        })
    }

}
