import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

const initialState = {}
const middleware = [thunk]

let rootReducer = combineReducers({
    
})

export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
)
