// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Web server main JavaScript file.
// //////////////////////////////////////////////////
import fs from 'fs'
import http from 'http'
import https from 'https'
import parseArgs from 'minimist'

import { app } from './app.mjs'

const argv = parseArgs(process.argv.slice(2))
const httpPort = argv.p ?? argv['http-port'] ?? 8080
const httpsPort = argv.P ?? argv['https-port'] ?? 4443
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
process.on('unhandledRejection', (reason, promise) => { console.log(reason, promise) })
