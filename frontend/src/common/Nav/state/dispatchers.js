// Action Creators
/**
 * Creates action that changes the theme to the specified theme
 * 
 * @param {string} theme 
 * @returns {Object} Create an action that sets theme
 */
const actionChangeTheme = (theme) => {
    return {
        type: 'user/change_theme',
        payload: {
            theme: theme
        }
    }
}

// Action Dispatchers
/**
 * 
 * @param {Dispatch} dispatch Redux dispatch callback function
 * @param {string} theme Theme name that is to be dispatched
 */
export const dispatchChangeTheme = (dispatch, theme = "dark") => {
    dispatch(actionChangeTheme(theme))
}
