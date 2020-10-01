// //////////////////////////////////////////////////
//	Piece for smartphone orchestra
//
// Web server main JavaScript file.
// //////////////////////////////////////////////////
// General
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');
const app = express();
// http options
const http = require('http');
const httpPort = 80;
// https options
const https =require('https');	//
const httpsPort = 443;
const key = './certs/server.key';
const certificate = './certs/server.crt';
const rootCA = './certs/root.crt';
const serverOptions = {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(certificate),
    ca: fs.readFileSync(rootCA)
};

// Create an HTTP server on port `httpPort` and redirect to HTTPS
// From
// https://www.grizzlypeaksoftware.com/blog?id=JDcsPW2raSic6oc6MCYaM
var httpServer = http.createServer( (req,res) => {
    // 301 redirect (reclassifies google listings)
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
});

httpServer.listen(httpPort, function(err){
    console.log('Http server listening on port: ', httpPort);
});

// Create https web server
const httpsServer = https.createServer(serverOptions, app);

httpsServer.listen(httpsPort, function(){
    console.log('Https server listening  on port: ', httpsPort);
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.use(express.static(path.join(__dirname, 'public'), {dotfiles: 'allow'}));
app.use(express.static(path.join(__dirname, 'node_modules/')));

// error handling - from https://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops! Something went wrong.');
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/views/soundCheck.html');
});

app.get('/instrument', function(req, res){
    res.sendFile(__dirname + '/public/views/pieceInstrument.html');
});

app.get('/root', function(req, res){
    res.sendFile(__dirname + '/certs/root.crt');
});
