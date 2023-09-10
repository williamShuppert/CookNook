import app from '../../app.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import User from '../../models/user.model.js'
const should = chai.should()

chai.use(chaiHttp)

describe('Users', () => {

    describe('POST /users', () => {
        it('should create a new user and return it', async () => {
            let user = await User.findOne({ where: {username: 'temp_user'}})
            if (user) await user.destroy()

            const res = await chai.request(app)
                .post('/users')
                .send({
                    email: 'temp_user@test.com',
                    username: 'temp_user',
                    displayname: 'temp_user',
                    password: 'password1',
                })

            res.should.have.status(201)
            res.body.should.have.property('id')
            res.body.should.have.property('displayname')
            res.body.should.not.have.property('password')
            res.body.should.not.have.property('email')
        })

        it('should inform user email is already in use (unimplemented)')
        it('should inform user username is already in use (unimplemented)')
        it('should inform user body vars are invalid (unimplemented)')
        it('should inform user body vars are missing (unimplemented)')
    })

    describe('GET /users/:id', () => {
        it('should return user with valid id', async () => {
            let user = await User.findOne()
            // if (!user) user = await userService.createUser('temp_user@test.com', 'temp_user', 'temp_user', '1234')

            const res = await chai.request(app)
                .get(`/users/${user.id}`)

            res.should.have.status(200)
            res.body.should.have.property('id')
            res.body.should.have.property('displayname')
            res.body.should.not.have.property('password')
            res.body.should.not.have.property('email')
        })

        it('should inform user the id param is invalid', async () => {
            const res = await chai.request(app)
                .get(`/users/0`)

            res.should.have.status(400)
        })

        it('should fail to find user with an incorrect id', async () => {
            const res = await chai.request(app)
                .get(`/users/3795ebbb-262c-4374-bd17-7370222a894c`)

            res.should.have.status(404)
        })
    })
})