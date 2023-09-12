import '../config/env.config.js'
import { constUserData } from './fixtures/user.fixture.js'
import { usePool } from '../src/config/mysql2.js'

await usePool(async db => {
    // should always be available during testing and should not change
    const constUser = await db.execute('SELECT * FROM users WHERE id = ?', [constUserData.id])
    if (!constUser) await db.query('INSERT INTO users (id, username, displayname, email, password) VALUES (?, ?, ?, ?, ?)', [
        constUser.id,
        constUser.username,
        constUser.displayname,
        constUser.email,
        constUser.password
    ])
})
