import axios from "axios"

import { apiMeetingCreate } from "../../endpoints"
import { dispatchError, dispatchPending, dispatchSuccess } from "./state/creationDispatchers"

export const createMeeting = (dispatch) => {

    dispatchPending(dispatch)
    axios.get(apiMeetingCreate).then(res => {
        dispatchSuccess(dispatch, res.data.code)
    }).catch(err => {
        dispatchError(dispatch, err.response.data)
    })

}
