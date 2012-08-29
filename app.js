
var ClientHandler = require('./clienthandler');
var WebSocketServer = require('websocket').server;
var static = require('node-static');
var http = require('http');

var clientFiles = new static.Server('client');

var server = http.createServer(function(request, response) {
    request.addListener('end', function () {
        clientFiles.serve(request, response);
    });
});
server.listen(8000);

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    new ClientHandler(connection, request);
});
