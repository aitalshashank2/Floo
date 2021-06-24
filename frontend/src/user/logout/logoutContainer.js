import { performLogout } from "../../api/auth/auth"
import { routeLogin } from "../../endpoints"

const Logout = () => {

    performLogout()
    window.location = routeLogin

    return (
        <div>Logging you out</div>
    )

}

export default Logout
