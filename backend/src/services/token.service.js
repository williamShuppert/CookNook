import jwt from 'jsonwebtoken'

export const generateToken = (userId, type, payload = {}) => {
    if (type != 'access' && type != 'refresh')
        throw new Error(`type for generating token is not 'access' or 'refresh'`)
    
    let secret
    let expiresIn
    if (type == 'access') {
        expiresIn = '30min'
        secret = process.env.ACCESS_JWT_SECRET            
    }
    else if (type == 'refresh') {
        expiresIn = '1h'
        secret = process.env.REFRESH_JWT_SECRET
    }

    return jwt.sign({...payload, userId, type}, secret, { expiresIn })
}

export default {
    generateToken
}