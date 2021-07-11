import {
    FRONTEND,
    BACKEND,
    OAUTH
} from "./configuration/config"

// Frontend
const routeHome = FRONTEND.routeHome
export default routeHome

export const routeLoader = `${routeHome}loader/`
export const routeLogin = `${routeHome}login/`
export const routeMeetingBase = `${routeHome}meeting/`
export const routeMeeting = (code) => {
    return `${routeMeetingBase}${code}/`
}

// Backend

// HTTP
export const apiBase = BACKEND.apiBase
export const apiUserBase = `${apiBase}user/`
export const apiUserLogin = `${apiUserBase}login/`
export const apiUserLogout = `${apiUserBase}logout/`
export const apiUserVerify = `${apiUserBase}verify/`
export const apiUserPresentMeetings = `${apiUserBase}present_meetings/`
export const apiMeetingBase = `${apiBase}meeting/`
export const apiMeetingCreate = `${apiMeetingBase}new/`
export const apiMeetingDetail = (code) => {
    return `${apiMeetingBase}${code}/`
}
export const apiMeetingCreateWithTeam = (team_code) => {
    return `${apiMeetingCreate}?team=${team_code}`
}
export const apiTeamsBase = `${apiBase}teams/`
export const apiTeamsDetails = (team_code) => {
    return `${apiTeamsBase}${team_code}/`
}
export const apiTeamsJoin = (team_code) => {
    return `${apiTeamsDetails(team_code)}join/`
}
export const apiTeamsLeave = (team_code) => {
    return `${apiTeamsDetails(team_code)}leave/`
}
export const apiTopics = `${apiBase}topics/`
export const apiMessages = (topicID) => {
    return `${apiTopics}${topicID}/messages/`
}


// WS
export const apiWSBase = BACKEND.apiWSBase
export const apiWSMeetingBase = `${apiWSBase}meeting/`
export const apiWSMeetingSignal = (code) => {
    return `${apiWSMeetingBase}${code}/signalling/`
}
export const apiWSMeetingChat = (code) => {
    return `${apiWSMeetingBase}${code}/chat/`
}
export const apiWSMessage = (topicID) => {
    return `${apiWSBase}topics/${topicID}/`
}


// Oauth
const REDIRECT_URI = OAUTH.REDIRECT_URI
const GOOGLE_CLIENT_ID = OAUTH.GOOGLE_CLIENT_ID

export const googleRedirect = (state) => {
    return (
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `response_type=code&` + 
        `client_id=${GOOGLE_CLIENT_ID}&` + 
        `scope=openid%20profile%20email&` + 
        `redirect_uri=${REDIRECT_URI}&` +
        `state=${state}`
    )
}
