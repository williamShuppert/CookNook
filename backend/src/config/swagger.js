import fs from 'fs'
const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const { version, license } = packageData

export default {
  openapi: '3.0.0',
  info: {
    title: `Recipe App API Documentation - ${process.env.NODE_ENV}`,
    version,
    license: {
      name: license
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`,
    },
  ],
}