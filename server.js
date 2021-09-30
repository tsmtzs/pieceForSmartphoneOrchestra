// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Web server main JavaScript file.
// //////////////////////////////////////////////////
const path = require('path')
const fs = require('fs')
const express = require('express')
const http = require('http')
const https = require('https')
const argv = require('minimist')(process.argv.slice(2))

const serveFileDir = process.env.NODE_ENV === 'production' ? 'build' : 'dist'

const app = express()
const httpPort = argv.p || argv['http-port'] || 8080
const httpsPort = argv.P || argv['https-port'] || 4443
const key = './certs/smartphoneOrchestra-key.pem'
const certificate = './certs/smartphoneOrchestra-crt.pem'
const credentials = {
  key: fs.readFileSync(key, 'utf8'),
  cert: fs.readFileSync(certificate, 'utf8')
}

// Create an HTTP server on port `httpPort` and redirect to HTTPS
// Adapted from
// https://www.grizzlypeaksoftware.com/blog?id=JDcsPW2raSic6oc6MCYaM
const httpServer = http.createServer((req, res) => {
  const host = req.headers.host.split(':')[0]
  // 301 redirect (reclassifies google listings)
  res.writeHead(301, { Location: `https://${host}:${httpsPort}${req.url}` })
  res.end()
})

httpServer.listen(httpPort, function (err) {
  if (err) {
    // Catch with the process.setUncaughtExceptionCaptureCallback
    throw new Error(err)
  }
  console.log('Http server listening on port: ', httpPort)
})

const httpsServer = https.createServer(credentials, app)

httpsServer.listen(httpsPort, function (err) {
  if (err) {
    // Catch with the process.setUncaughtExceptionCaptureCallback
    throw new Error(err)
  }
  console.log('Https server listening  on port: ', httpsPort)
})

process.setUncaughtExceptionCaptureCallback(err => { console.error(err.stack) })

app.use(express.static(
  path.join(__dirname, serveFileDir),
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
  res.sendFile(path.join(__dirname, serveFileDir, '/index.html'))
})

app.get('/instrument', function (req, res) {
  res.sendFile(path.join(__dirname, serveFileDir, '/instrument.html'))
})

app.get('/directions', function (req, res) {
  res.sendFile(path.join(__dirname, serveFileDir, '/directions.html'))
})
