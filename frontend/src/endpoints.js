import {
    FRONTEND,
    BACKEND,
    OAUTH
} from "./configuration/config"

// Frontend

// Base URL on which frontend is being served
const routeHome = FRONTEND.routeHome
export default routeHome

// URL to Loader View
export const routeLoader = `${routeHome}loader/`

// URL to Login View
export const routeLogin = `${routeHome}login/`

// Base URL to all the meetings
export const routeMeetingBase = `${routeHome}meeting/`

// Unique meeting URL generated for a meeting
export const routeMeeting = (code) => {
    return `${routeMeetingBase}${code}/`
}

// Backend

// HTTP

// Base URL on which backend is being served
export const apiBase = BACKEND.apiBase

// User URLs
// Base URL on the backend containing all user views
export const apiUserBase = `${apiBase}user/`
// Backend view which logs the user in
export const apiUserLogin = `${apiUserBase}login/`
// Backend view which logs the user out
export const apiUserLogout = `${apiUserBase}logout/`
// Backend view which verifies if the user is logged in
export const apiUserVerify = `${apiUserBase}verify/`
// Backend view for obtaining all the meetings that the user is currently a part of
export const apiUserPresentMeetings = `${apiUserBase}present_meetings/`

// Meeting URLs
// Base URL on the backend to all the meetings
export const apiMeetingBase = `${apiBase}meeting/`
// Backend view which creates a new meeting
export const apiMeetingCreate = `${apiMeetingBase}new/`
// Backend view which returns meeting details corresponding to the meeting code
export const apiMeetingDetail = (code) => {
    return `${apiMeetingBase}${code}/`
}
// Backend view which creates a new meeting in a specified team
export const apiMeetingCreateWithTeam = (team_code) => {
    return `${apiMeetingCreate}?team=${team_code}`
}

// Team URLs
// Base URL on the backend to all the teams
export const apiTeamsBase = `${apiBase}teams/`
// Backend view which returns team details corresponding to the team code
export const apiTeamsDetails = (team_code) => {
    return `${apiTeamsBase}${team_code}/`
}
// Backend view which adds the user to the team specified by the team code
export const apiTeamsJoin = (team_code) => {
    return `${apiTeamsDetails(team_code)}join/`
}
// Backend view which removes the user from the team specified by the team code
export const apiTeamsLeave = (team_code) => {
    return `${apiTeamsDetails(team_code)}leave/`
}

// Backend view which returns all the topics that the user has access to
export const apiTopics = `${apiBase}topics/`

// Backend view which returns all the messages corresponding to a particular topic
export const apiMessages = (topicID) => {
    return `${apiTopics}${topicID}/messages/`
}


// WS

// Base URL of backend on which websockets are handled
export const apiWSBase = BACKEND.apiWSBase

// Base URL on backend for handling websockets corresponding to a meeting
export const apiWSMeetingBase = `${apiWSBase}meeting/`
// Backend websocket which acts as a signalling server for the meeting specified by the meeting code
export const apiWSMeetingSignal = (code) => {
    return `${apiWSMeetingBase}${code}/signalling/`
}
// Backend websocket which acts as a consumer for relaying chat messages for the meeting specified by the meeting code
export const apiWSMeetingChat = (code) => {
    return `${apiWSMeetingBase}${code}/chat/`
}
// Backend websocket which acts as a consumer for relaying messages in a topic discussion
export const apiWSMessage = (topicID) => {
    return `${apiWSBase}topics/${topicID}/`
}


// OAUTH
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
