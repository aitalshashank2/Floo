import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"

import userReducer from "./user/state/reducers"
import meetingReducer from "./meeting/state/reducers"

const initialState = {}
const middleware = [thunk]

const rootReducer = combineReducers({
    user: userReducer,
    meeting: meetingReducer
})

export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
)
