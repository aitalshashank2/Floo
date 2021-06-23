import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import userReducer from './user/state/reducers'

const initialState = {}
const middleware = [thunk]

const rootReducer = combineReducers({
    user: userReducer
})

export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
)
