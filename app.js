
var Game  = require('./game');
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

game = new Game();

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    console.log('connection accepted from ' + request.origin);
    game.newConnection(connection);
});
