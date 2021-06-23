import { useSelector, useDispatch } from 'react-redux'

import NavComponent from "./components/NavComponent"

import { dispatchChangeTheme } from './state/dispatchers'


const Nav = () => {

    const theme = useSelector(state => state.user.theme)
    const dispatch = useDispatch()

    const changeTheme = () => {

        let newTheme
        switch (theme) {
            case "default":
                newTheme = "dark"
                break
            case "dark":
                newTheme = "default"
                break
            default:
                newTheme = "dark"
        }

        localStorage.setItem("theme", newTheme)
        dispatchChangeTheme(dispatch, newTheme)

    }


    return (
        <NavComponent changeTheme={changeTheme} />
    )

}

export default Nav
