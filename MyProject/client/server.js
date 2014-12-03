var fs = require('fs');
var http = require('http');

var express = require('express');
var config = require('./build.config.js');

require('express-namespace');

var app = express();
var server = http.createServer(app);
app.use(express.static(config.server.distFolder));
app.use(express.logger());                                  // Log requests to the console
app.use(express.bodyParser());                              // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method

app.use(function(req, res, next) {
	if ( req.user ) {
		console.log('Current User:', req.user.firstName, req.user.lastName);
	} else {
		console.log('Unauthenticated');
	}
	next();
});

// A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Start up the server on the port specified in the config
server.listen(config.server.listenPort, '0.0.0.0', 511, function() {
	// // Once the server is listening we automatically open up a browser
	var open = require('open');
	open('http://localhost:' + config.server.listenPort + '/', config.server.browser);
});
console.log('Angular App Server - listening on port: ' + config.server.listenPort);