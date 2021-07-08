import { combineReducers } from "redux"

import creationReducer from "./creation"

const meetingReducer = combineReducers({
    creation: creationReducer
})

export default meetingReducer
