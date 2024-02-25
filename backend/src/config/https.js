import fs from 'fs'

export const httpsOptions = {
    key: fs.readFileSync('../certificate/server.key'),
    cert: fs.readFileSync('../certificate/server.cert')
}