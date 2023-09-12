import app from '../../src/app.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { constUserData } from '../fixtures/user.fixture.js'
import { usePool } from '../../src/config/mysql2.js'
import httpStatus from 'http-status'
const should = chai.should()

chai.use(chaiHttp)

describe('Auth', usePool(async db => {

    describe('POST /auth/local', () => {
        it('should login with a correct local login', async () => {
            const res = await chai.request(app)
                .post('/auth/local')
                .send({
                    username: constUserData.username,
                    password: constUserData.plainPassword
                })

            res.should.have.status(200)
            res.body.should.have.property('id').equal(constUserData.id)
            res.body.should.have.property('displayname').equal(constUserData.displayname)
            res.body.should.have.property('username').equal(constUserData.username)
            res.body.should.have.property('email').equal(constUserData.email)
            expect(res).to.have.header('authorization')
            res.body.should.not.have.property('password')
        })

        it('should deny an invalid local login', async () => {
            const res = await chai.request(app)
                .post('/auth/local')
                .send({
                    username: constUserData.username,
                    password: constUserData.plainPassword + '1'
                })

            res.should.have.status(httpStatus.UNAUTHORIZED)
            expect(res).to.not.have.header('authorization')
        })

    })

}))