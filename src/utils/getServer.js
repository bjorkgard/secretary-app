export default function getServer(isDevelopment) {
    return isDevelopment ? 'http://secretary-server.test' : 'https://dev.jwapp.info'
}
