import fs from 'fs'

// Only use self signed certification in dev
export const httpsOptions = process.env.NODE_ENV != 'dev' ? {} : {
    key: fs.readFileSync('../certificate/server.key'),
    cert: fs.readFileSync('../certificate/server.cert')
}