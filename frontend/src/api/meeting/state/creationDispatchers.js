// Action creators

const actionPending = () => {
    return {
        type: "meeting/create",
        payload: {
            creationState: "pending"
        }
    }
}

const actionSuccess = (code) => {
    return {
        type: "meeting/create",
        payload: {
            creationState: "success",
            code: code
        }
    }
}

const actionError = (error) => {
    return {
        type: "meeting/creation",
        payload: {
            creationState: "error",
            error: error
        }
    }
}

// Action dispatchers
export const dispatchPending = (dispatch) => {
    dispatch(actionPending())
}

export const dispatchSuccess = (dispatch, code) => {
    dispatch(actionSuccess(code))
}

export const dispatchError = (dispatch, error) => {
    dispatch(actionError(error))
}
