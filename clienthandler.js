
_ = require('./utils');

var ClientHandler = function (){
    this.init.apply(this, arguments);
}

ClientHandler.prototype = {
    init: function(connection, request, world){
        this.connection = connection;
        this.request = request;
        this.world = world;
        this.world.newClient(this);
        this.bindEvents();
        console.log('connection accepted from ' + request.origin);
        console.log(request);
    },

    bindEvents: function(){
        this.connection.on('message', _.proxy(this,this.message));
        this.connection.on('close', _.proxy(this,this.close));
    },

    message: function(message){
        console.log(message);
        this.world.clientMessage(message);
    },

    send: function(data){
        this.connection.send(JSON.stringify(data));
    },

    close: function(connection){
        console.log('connection closed');
    },

}

module.exports = ClientHandler;

