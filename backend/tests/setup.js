import '../config/env.config.js'
import { constUserData } from './fixtures/user.fixture.js'
import { usePool } from '../src/config/mysql2.js'

await usePool(async db => {
    // should always be available during testing and should not change
    await db.execute('DELETE FROM users WHERE id = ? OR username = ? OR email = ?', [
        constUserData.id,
        constUserData.username,
        constUserData.email
    ])
    await db.execute('INSERT INTO users (id, username, displayname, email, password) VALUES (?, ?, ?, ?, ?)', [
        constUserData.id,
        constUserData.username,
        constUserData.displayname,
        constUserData.email,
        constUserData.password
    ])
})
