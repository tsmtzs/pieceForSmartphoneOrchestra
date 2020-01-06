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
const certificate = './certs/server.cert';
const serverOptions = {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(certificate)
};


// Redirect http messages to https
app.use( (request, response) => {
    if (!request.secure) {
	console.log('https://' + request.headers.host + request.url);
	response.redirect('https://' + request.headers.host + request.url);
    }
});

// Create http server
const httpServer = http.createServer(app).listen(httpPort);

// Create https web server
const httpsServer = https.createServer(serverOptions, app);
// //////////////////////////////////////////////////
const path = require('path');
const bodyParser = require('body-parser');
// const WebSocketServer = require('ws').Server;
// const wss = new WebSocketServer({server: httpsServer});

httpsServer.listen(httpsPort, function(){
    console.log('Https server listening  on port: ', httpsPort);
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/')));

// error handling - from https://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops! Something went wrong.');
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/pieceA.html');
});
