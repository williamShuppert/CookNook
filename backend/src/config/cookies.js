import ms from 'ms'

export const cookieConfig = {
    access: {
        name: 'access',
        options: {
            maxAge: ms('1h'),
            httpOnly: true,
            secure: true,
            sameSite: process.env.NODE_ENV == 'dev' ? 'lax' : 'strict'
        }
    },
    refresh: {
        name: 'refresh',
        options: {
            path: '/api/auth/refresh',
            maxAge: ms('2d'),
            httpOnly: true,
            secure: true,
            sameSite: process.env.NODE_ENV == 'dev' ? 'lax' : 'strict'
        }
    }
}