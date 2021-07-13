const initialState = {
    creationState: "norequest",
    code: ""
}

const changeCreationInfo = (state, payload) => {
    return {
        ...state,
        ...payload
    }
}

/**
 * Reducer handling creation of a meeting
 * 
 * @param {Object} state Before state update
 * 
 * @param {Object} action Action to be tallied against
 * @param {string} action.type Type of the action
 * @param {Object} action.payload New data
 * 
 * @returns {Object} final state
 */
const creationReducer = (state = initialState, action) => {
    switch(action.type){
        case 'meeting/create':
            return changeCreationInfo(state, action.payload)
        default:
            return state
    }
}

export default creationReducer
