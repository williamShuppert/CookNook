import ms from 'ms'

export const refreshTokenName = 'refresh'
export const refreshTokenLifetime = ms('2d')
export const refreshCookieOptions = {
    path: '/auth/refresh',
    maxAge: refreshTokenLifetime,
    httpOnly: true,
    secure: process.env.NODE_ENV != 'dev'
}

export const accessTokenName = 'access'
export const accessTokenLifetime = ms('5m')
export const accessCookieOptions = {
    maxAge: accessTokenLifetime,
    httpOnly: true,
    secure: process.env.NODE_ENV != 'dev'
}