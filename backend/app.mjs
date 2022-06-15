// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Express app file.
// //////////////////////////////////////////////////
import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '../')
const serveFileDir = path.join(rootDir, process.env.NODE_ENV === 'production' ? 'build' : 'dist')
const app = express()

app.use(express.static(
  serveFileDir,
  {
    setHeaders: (res, path, stat) => { res.set('Service-Worker-Allowed', '/') }
  }
))

// error handling - from https://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Oops! Something went wrong.')
})

app.get('/', function (req, res) {
  res.sendFile(path.join(serveFileDir, '/index.html'))
})

app.get('/instrument', function (req, res) {
  res.sendFile(path.join(serveFileDir, '/instrument.html'))
})

app.get('/directions', function (req, res) {
  res.sendFile(path.join(serveFileDir, '/directions.html'))
})

export { app }
