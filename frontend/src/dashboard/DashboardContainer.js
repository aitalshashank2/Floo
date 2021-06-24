import { useSelector } from "react-redux"
import DashboardComponent from "./components/DashboardComponent"

const Dashboard = () => {

    const user = useSelector(state => state.user)
    console.log(user)

    return (
        <DashboardComponent />
    )
}

export default Dashboard
