import MeetingComponent from "./components/MeetingComponent"

const Meeting = (props) => {

    console.log(props.match.params.code)
    return (
        <MeetingComponent />
    )
}

export default Meeting
