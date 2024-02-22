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