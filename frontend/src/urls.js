// Frontend
const isDev = true

export default routeHome = () => {
    return isDev ? "http://localhost:54320/" : "http://localhost:54321/"
}

// Backend
export const apiBase = () => {
    return "http://localhost:54321/api/"
}

export const apiWSChat = () => {
    return "ws://localhost:54321/ws/"
}
