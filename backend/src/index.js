import './config/config.js'
import app from './app.js'

const port = process.env.PORT

app.listen(port, () => console.log(`listening on port ${port}`))