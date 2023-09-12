import bcrypt from 'bcrypt'
import {faker} from '@faker-js/faker'

export const constUserData = {
    id: 'd7e11921-ceea-49b6-bfec-abd1476a647c',
    email: 'test@example.com',
    username: 'test-user',
    displayname: 'test user',
    password: '$2b$12$XPMZtqOCAZNMZz0Ndl4kCuseB2NKBTYO7G3C0YdTmqn0WBTcuRzfK',
    plainPassword: 'password'
}

export const genRandomUserData = async () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    return {
        userId: faker.string.uuid(),
        email: faker.internet.email(),
        username: firstName + '-' + lastName,
        displayname: firstName + ' ' + lastName,
        password: await bcrypt.hash('password', 12)
    }
}