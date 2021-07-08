import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Redirect } from "react-router-dom"

import { performVerify } from "../api/auth/auth"
import { apiTeamsBase } from "../endpoints"

import Nav from "../common/Nav/NavContainer"
import TeamCreationComponent from "./components/TeamCreationComponent"

const TeamCreation = () => {

    const [name, setName] = useState()
    const [isNameNull, changeIsNameNull] = useState(false)

    const apiState = useSelector(state => state.user.apiState)
    const userDetails = useSelector(state => state.user.userDetails)
    const dispatch = useDispatch()

    const handleName = (value) => {
        setName(value)
    }

    const handleCreate = () => {
        if(name.length === 0){
            changeIsNameNull(true)
        }else{
            
            axios.post(apiTeamsBase, {
                "name": name,
                "members": [
                    userDetails.uuid
                ]
            }).then(res => {
                window.location = `/teams/${res.data.code}`
            }).catch(err => {
                console.log(err)
            })

        }
    }

    if (apiState === "norequest") {
        performVerify(dispatch)
        return <Redirect to="/loader/?redirect=/teams/new" />
    } else {

        return (
            <>
                <Nav />
                <TeamCreationComponent
                    handleName={handleName}
                    handleCreate={handleCreate}
                    isNameNull={isNameNull}
                />
            </>
        )

    }

}

export default TeamCreation
