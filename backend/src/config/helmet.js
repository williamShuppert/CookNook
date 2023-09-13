export default {
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'"],
        connectSrc: ["'self'", 'https://accounts.google.com']
      },
    }
}