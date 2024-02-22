# Recipe App Backend API

## Setup
The following steps will walk you through setting up the dev environment. To run in another environment simply replace *dev* with *stage* or *prod*.

1. ```cd backend``` to move you into the correct directory.
2. ```npm i``` to install all dependencies.
3. add a ```.env.dev``` file to the ```backend``` folder and include all the required environment variables. _(look to [Environment Variables](#environment-variables) for further clarification)_
4. ```npm run db:create:dev``` will create the database (using env vars provided) and runs all migrations
5. ```npm run start:dev``` starts the API

## Environment Variables
This project uses multiple env files, one for each environment. An example env file is provided. The following are the different env files supported:
* ```.env.dev```
* ```.env.stage```
* ```.env.prod```

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







# Auth Flow

* Post to ```/auth``` and get refresh, access, and logout JWT cookies _(Requires valid login info)_
* Access JWT is sent with every request
* Post to ```/auth/refresh``` to get new refresh, access, and logout JWT cookies _(Requires valid refresh and logout JWT cookies)_
* to logout on frontend, delete logout JWT cookie and clear application state

## JWT Cookie Types
### Refresh JWT (secure, HTTPOnly)
Allows silent refresh of tokens 
 * "userId": identifier for the user
 * "version": refresh token version

### Access JWT (secure, HTTPOnly)
Allows access to protected routes
 * "userId": identifier for the user

### Logout JWT (secure)
Allows users to log out, even without a server connection.
* "version": version of corresponding refresh token