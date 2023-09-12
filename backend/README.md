# Recipe App Backend API
![Code Coverage](https://img.shields.io/badge/coverage-94.45%-brightgreen)

# Table of Contents
- [Recipe App Backend API](#recipe-app-backend-api)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Setup](#setup)
- [Testing and Coverage](#testing-and-coverage)
- [Migrations](#migrations)
- [Error Handling](#error-handling)
- [Validation](#validation)

# Features
* **Authentication and authorization:** using [passport](http://www.passportjs.org/)
* **Local, JWT, and Google OAuth2**: supported strategies
* **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
* **Validation:** request data validation using [Joi](https://github.com/hapijs/joi)
* **Error handling:** centralized error handling mechanism
* **Testing:** unit and integration tests using [Mocha](https://mochajs.org/)
* **Code coverage**: using [c8](https://github.com/bcoe/c8)
* **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
* **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
* **Santizing**: sanitize request data against xss and query injection
* **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)

# Environment Variables
This project uses multiple env files, one for each environment. An example env file is provided. The following are the different env files supported:
* ```.env.test```
* ```.env.dev```
* ```.env.prod```

# Setup
The following steps will walk you through setting up the dev environment. To run in another environment simply replace *dev* with *test* or *prod*.

1. ```cd backend``` to move you into the correct directory
2. ```npm i``` to install all dependencies
3. add a ```.env.dev``` file to the ```backend``` folder and include all the required environment variables _*look to [Environment Variables](#environment-variables)_
4. ```npm run db:create:dev``` will create the database (using env vars provided) and runs all migrations
5. ```npm run start:dev``` starts the API

Now, the API is up and running in the development environment! Swagger documentation is accessible at ```/docs```

# Testing and Coverage
This project utilizes Mocha and Chai for testing. To run all tests in the test environment, use the following command:
```
npm run test
```

This project also uses c8 to test coverage. To get coverage of all tests, use the following command:
```
npm run coverage
```

# Migrations
This project manages database migrations using Sequelize CLI. You can perform the following migration-related tasks through node scripts, just replace *[env]* with the desired environment *(ex: npm run db:create:dev)*.

**Create DB and Run Migrations:**
```
npm run db:create:[env]
```

**Run Migrations:**
```
npm run db:migrate:[env]
```

**Undo a Migration:**
```
npm run db:migrate:undo:[env]
```

**Create a Migration:**
```
sequelize migration:generate --name [name-of-migration]
```

# Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```javascript
import catchAsync from '../utils/catchAsync'

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error('Something wrong happened')
})
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (catchAsync will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```javascript
import httpStatus from 'http-status'
import ApiError from '../utils/ApiError'

const getUser = async (userId) => {
  // ...get user from database
  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
}
```
When in production the app will transform non operational errors to protect any sensitive data being returned in the response, it would look like this:
```json
{
  "code": 500,
  "message": "Internal Server Error"
}
```
# Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validation` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
import express from 'express'
import validate from '../../middlewares/validate'
import userValidation from '../../validations/user.validation'
import userController from '../../controllers/user.controller'

const router = express.Router()

router.post('/users', validate(userValidation.createUser), userController.createUser)
```