const initialState = {
    theme: localStorage.getItem("theme") || "dark",
}

const changeTheme = (state, theme) => {
    return {
        ...state,
        theme: theme
    }
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'user/change_theme':
            return changeTheme(state, action.payload.theme)
        default:
            return state
    }
}

export default reducer
