import LocalStrategy from 'passport-local'
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'

export default new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({where:{username}})
    if (!user) return done(null, false)
    const correctPassword = await bcrypt.compare(password, user.password)    
    if (!correctPassword) return done(null, false)
    return done(null, user.get({plain: true}))
})