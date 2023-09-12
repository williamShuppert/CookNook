import app from '../../src/app.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { constUserData } from '../fixtures/user.fixture.js'
import { usePool } from '../../src/config/mysql2.js'
import httpStatus from 'http-status'
const should = chai.should()

chai.use(chaiHttp)

describe('Miscellaneous', usePool(async db => {
    describe('GET /tests/non-operational-error', () => {
        it('should handle a non operation error correctly', async () => {
            const res = await chai.request(app)
                .get('/tests/non-operational-error')
                .send({
                    username: constUserData.username,
                    password: constUserData.plainPassword
                })

            res.should.have.status(httpStatus.INTERNAL_SERVER_ERROR)
            res.body.should.have.property('code').equal(httpStatus.INTERNAL_SERVER_ERROR)
            res.body.should.have.property('message').equal(httpStatus[httpStatus.INTERNAL_SERVER_ERROR])
        })
    })
}))