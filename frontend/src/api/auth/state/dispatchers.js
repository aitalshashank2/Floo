// Action creators

const actionPendingState = () => {
    return {
        type: 'user/user_login',
        payload: {
            apiState: "pending"
        }
    }
}

const actionUserDetails = (userDetails) => {
    return {
        type: 'user/user_login',
        payload: {
            apiState: "success",
            userDetails: userDetails
        }
    }
}

const actionErrorDetails = (errorDetails) => {
    return {
        type: 'user/user_login',
        payload: {
            apiState: "error",
            errorDetails: errorDetails
        }
    }
}

// Action Dispatchers
export const dispatchPendingState = (dispatch) => {
    dispatch(actionPendingState())
}

export const dispatchUserDetails = (dispatch, userDetails) => {
    dispatch(actionUserDetails(userDetails))
}

export const dispatchErrorDetails = (dispatch, errorDetails) => {
    dispatch(actionErrorDetails(errorDetails))
}
