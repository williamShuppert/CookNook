import app from '../../src/app.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { genRandomUserData, constUserData } from '../fixtures/user.fixture.js'
import { faker } from '@faker-js/faker'
import { usePool } from '../../src/config/mysql2.js'
const should = chai.should()

chai.use(chaiHttp)

describe('Users', usePool(async db => {

    describe('POST /users', () => {
        it('should create a new user and return it', async () => {
            const randUserData = await genRandomUserData()

            const res = await chai.request(app)
                .post('/users')
                .send(randUserData)

            res.should.have.status(201)
            res.body.should.have.property('id')
            res.body.should.have.property('displayname').equal(randUserData.displayname)
            res.body.should.have.property('username').equal(randUserData.username)
            res.body.should.have.property('email').equal(randUserData.email)
            res.body.should.not.have.property('password')

            after(async () => {
                await db.execute('delete from users where id = ?', [res.body.id])
            })
        })

        it('should inform user email and username is already in use', async () => {
            const res = await chai.request(app)
                .post('/users')
                .send(constUserData)

            res.body.should.have.property('code').equal(400)
            res.body.should.have.property('message').equal('Email and username already in use')
        })

        it('should inform user username is already in use', async () => {
            const res = await chai.request(app)
                .post('/users')
                .send({...constUserData, email: faker.internet.email()})

            res.body.should.have.property('code').equal(400)
            res.body.should.have.property('message').equal('Username already in use')
        })

        it('should inform user email is already in use', async () => {
            const res = await chai.request(app)
                .post('/users')
                .send({...constUserData, username: faker.person.firstName()})

            res.body.should.have.property('code').equal(400)
            res.body.should.have.property('message').equal('Email already in use')
        })

        it('should inform user body vars are invalid (unimplemented)')

        it('should inform user body vars are missing', async () => {
            const res = await chai.request(app)
                .post('/users')
                .send({})

            res.body.should.have.property('code').equal(400)
            const expected = ['username', 'email', 'password', 'displayname']
            res.body.should.have.property('message')

            for (const str of expected)
                res.body.message.should.include(str)
        })
    })

    describe('GET /users/:id', () => {
        it('should return user with valid id', async () => {
            const res = await chai.request(app)
                .get(`/users/${constUserData.id}`)

            res.should.have.status(200)
            res.body.should.have.property('id').equal(constUserData.id)
            res.body.should.have.property('displayname').equal(constUserData.displayname)
            res.body.should.not.have.property('password')
            res.body.should.not.have.property('email')
        })

        it('should inform user the id param is invalid', async () => {
            const res = await chai.request(app)
                .get(`/users/0`)

            res.should.have.status(400)
            res.body.should.have.property('code').equal(400)
            res.body.should.have.property('message').equal('Invalid userId format. Please provide a valid UUID (version 4).')
        })

        it('should fail to find user with an incorrect id', async () => {
            const res = await chai.request(app)
                .get(`/users/${faker.string.uuid()}`)

            res.should.have.status(404)
            res.body.should.have.property('code').equal(404)
            res.body.should.have.property('message').equal('User not found')
        })
    })
}))