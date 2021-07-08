// Frontend
const isDev = true
const routeHome = isDev ? "http://localhost:54320/" : "http://localhost:54321/"
export default routeHome

export const routeLoader = `${routeHome}loader/`
export const routeLogin = `${routeHome}login/`
export const routeMeetingBase = `${routeHome}meeting/`
export const routeMeeting = (code) => {
    return `${routeMeetingBase}${code}/`
}

// Backend

// HTTP
export const apiBase = "http://localhost:54321/api/"
export const apiUserLogin = `${apiBase}user/login/`
export const apiUserLogout = `${apiBase}user/logout/`
export const apiUserVerify = `${apiBase}user/verify/`
export const apiMeetingCreate = `${apiBase}meeting/new/`

// WS
export const apiWSBase = "ws://localhost:54321/ws/"
export const apiWSMeetingBase = `${apiWSBase}meeting/`
export const apiWSMeetingSignal = (code) => {
    return `${apiWSMeetingBase}${code}/signalling/`
}

// Oauth
const REDIRECT_URI = isDev ? "http%3A//localhost:54320/broker" : "http%3A//localhost:54321/broker"
const GOOGLE_CLIENT_ID = "447332830232-ojo6pfrul2sdbkehmj170gh9iokg3a30.apps.googleusercontent.com"

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
