import app from '../../src/app.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { constUserData } from '../fixtures/user.fixture.js'
import { usePool } from '../../src/config/mysql2.js'
import httpStatus from 'http-status'
import { faker } from '@faker-js/faker'
const should = chai.should()

chai.use(chaiHttp)

describe('Auth', usePool(async db => {

    describe('POST /auth/local', () => {
        it('should login a user with correct password', async () => {
            const res = await chai.request(app)
                .post('/auth/local')
                .send({
                    username: constUserData.username,
                    password: constUserData.plainPassword
                })

            res.should.have.status(httpStatus.OK)
            res.body.should.have.property('id').equal(constUserData.id)
            res.body.should.have.property('displayname').equal(constUserData.displayname)
            res.body.should.have.property('username').equal(constUserData.username)
            res.body.should.have.property('email').equal(constUserData.email)
            expect(res).to.have.header('authorization')
            res.body.should.not.have.property('password')
        })

        it('should deny a user with an incorrect password', async () => {
            const res = await chai.request(app)
                .post('/auth/local')
                .send({
                    username: constUserData.username,
                    password: constUserData.plainPassword + '1'
                })

            res.should.have.status(httpStatus.UNAUTHORIZED)
            expect(res).to.not.have.header('authorization')
            res.body.should.have.property('code').equal(httpStatus.UNAUTHORIZED)
            res.body.should.have.property('message').equal('Unauthorized')
        })

        it(`should deny a user who doesn't exist`, async () => {
            const res = await chai.request(app)
                .post('/auth/local')
                .send({
                    username: faker.string.uuid(),
                    password: '1234'
                })

            res.should.have.status(httpStatus.UNAUTHORIZED)
            expect(res).to.not.have.header('authorization')
            res.body.should.have.property('code').equal(httpStatus.UNAUTHORIZED)
            res.body.should.have.property('message').equal('Unauthorized')
        })

        it(`should inform user of a bad request`, async () => {
            const res = await chai.request(app)
            .post('/auth/local')
            .send({})

            res.should.have.status(httpStatus.BAD_REQUEST)
            expect(res).to.not.have.header('authorization')
            res.body.should.have.property('code').equal(httpStatus.BAD_REQUEST)

            const expected = ['username', 'password']
            res.body.should.have.property('message')

            for (const str of expected)
                res.body.message.should.include(str)
        })
    })

}))