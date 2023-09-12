import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'
import { usePool } from './mysql2.js'

export default new LocalStrategy((username, password, done) => usePool(async db => {
    let user = await db.execute('SELECT * FROM users WHERE username = ?', [username], true)
    if (!user) return done(null, false)
    const correctPassword = await bcrypt.compare(password, user.password)    
    if (!correctPassword) return done(null, false)
    user = {
        id: user.id,
        email: user.email,
        displayname: user.displayname,
        username: user.username
    }
    return done(null, user)
}))