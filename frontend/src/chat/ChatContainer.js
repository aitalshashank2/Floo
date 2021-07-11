import axios from "axios"
import { useEffect, useRef, useState } from "react"

import ChatComponent from "./components/ChatComponent"

import { apiMessages, apiWSMessage, apiWSMeetingChat } from "../endpoints"
import { useSelector } from "react-redux"

const Chat = (props) => {

    const ws = useRef()

    const apiState = useSelector(state => state.user.apiState)

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")

    // Retrieve previous chats
    useEffect(() => {

        ws.current = new WebSocket((props.topicID !== null) 
            ? apiWSMessage(props.topicID)
            : apiWSMeetingChat(props.meetingCode)
        )

        ws.current.onmessage = (event) => {
            const payload = JSON.parse(event.data)
            setMessages(prev => {
                return [
                    ...prev,
                    payload
                ]
            })
        }

        if (props.topicID !== null) {
            const cancelTokenSource = axios.CancelToken.source()

            axios.get(apiMessages(props.topicID), {
                cancelToken: cancelTokenSource.token
            }).then(res => {
                setMessages(res.data)
            }).catch(err => {
                console.log(err)
            })

            return () => {
                cancelTokenSource.cancel("Cancelling in cleanup")
            }
        }



    }, [apiState])

    const handleTextBox = (value) => {
        setNewMessage(value)
    }

    const handleSend = () => {

        const payload = {
            body: newMessage
        }
        ws.current.send(JSON.stringify(payload))

        setNewMessage("")
    }

    return (
        <ChatComponent
            messages={messages}
            newMessage={newMessage}
            handleTextBox={handleTextBox}
            handleSend={handleSend}
            showContentSavingWarning={props.topicID === null}
        />
    )

}

export default Chat
