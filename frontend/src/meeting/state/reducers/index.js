import { combineReducers } from "redux"

import creationReducer from "./creation"

/**
 * Meeting Reducer
 * 
 * This reducer combines all the reducers associated with meeting
 */
const meetingReducer = combineReducers({
    creation: creationReducer
})

export default meetingReducer
