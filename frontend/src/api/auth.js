import axios from "axios"

import { apiUserLogin } from "../endpoints"

export const performLogin = (code) => {

    axios.post(apiUserLogin, {
        code: code
    }).then(res => {
        console.log(res.data)
    }).catch(err => {
        console.log(err)
    })

}
