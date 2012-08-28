
var WebSocketServer = require('websocket').server;
var static = require('node-static');
var http = require('http');

var clientFiles = new static.Server('../client');

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
    console.log('connection accepted from ' + request.origin);
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
            console.log(message);
            response = {'message':'pong'};
            connection.send(JSON.stringify(response));
        }
    });

    connection.on('close', function(connection) {
        // close user connection
        console.log('connection closed from ' + request.origin);
    });
});
