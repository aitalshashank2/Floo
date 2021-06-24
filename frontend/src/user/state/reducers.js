const initialState = {
    theme: localStorage.getItem("theme") || "dark",
    apiState: "norequest",
    userDetails: {},
    errorDetails: {}
}

const changeTheme = (state, theme) => {
    return {
        ...state,
        theme: theme
    }
}

const changeUserInfo = (state, payload) => {
    return {
        ...state,
        ...payload
    }
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'user/change_theme':
            return changeTheme(state, action.payload.theme)
        case 'user/user_login':
            return changeUserInfo(state, action.payload)
        default:
            return state
    }
}

export default reducer
