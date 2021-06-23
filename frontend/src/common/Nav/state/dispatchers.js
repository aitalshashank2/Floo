// Action Creators
const actionChangeTheme = (theme) => {
    return {
        type: 'user/change_theme',
        payload: {
            theme: theme
        }
    }
}

// Action Dispatchers
export const dispatchChangeTheme = (dispatch, theme = "dark") => {
    dispatch(actionChangeTheme(theme))
}
