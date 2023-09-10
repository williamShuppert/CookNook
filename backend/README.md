# Recipe App Backend API

## Table of Contents

## Features

## Routes
This project uses swagger, view the documentation at ```/docs```

## Environment Variables
Make sure to include environment variables for the test, development, and production environments. Create the following files: .env.test, .env.dev, and .env.prod for their respective environments. To start the API in a specific environment, you can use the following commands:

* ```npm run start:test``` for the test environment.
* ```npm run start:dev``` for the development environment.
* ```npm run start:prod``` for the production environment

Here's an example of the required environment variables:
```
PORT = 3000

## Database
DB_NAME = 'recipe_app'
DB_USERNAME = 'username'
DB_PASSWORD = 'password'
```

## Testing
This project utilizes Mocha and Chai for testing. To run all tests in the test environment, use the following command:

```
npm run test
```

## Migrations
This project manages database migrations using Sequelize. You can perform the following migration-related tasks:

* ```npm run migrate:test``` runs migrations on test database
* ```npm run migrate:dev``` runs migrations on dev database
* ```npm run migrate:prod``` runs migrations on prod database

<br>

* ```npx sequelize migration:generate --name [name of migration]``` generates a template migration
* ```npx sequelize``` shows commands for sequelize

## Setup
The following steps will walk you through setting up the dev environment.

1. ```cd backend``` to move you into the correct directory
2. ```npm i``` to install all dependencies
3. add a ```.env.dev``` file to the ```backend``` folder and include all the required environment variables _*shown above_
4. ```npm run migrate:dev``` sets up the tables in MySQL
5. ```npm run start:dev``` starts the API

Now, the API is up and running in the development environment!