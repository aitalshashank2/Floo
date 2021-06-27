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

const creationReducer = (state = initialState, action) => {
    switch(action.type){
        case 'meeting/create':
            return changeCreationInfo(state, action.payload)
        default:
            return state
    }
}

export default creationReducer
