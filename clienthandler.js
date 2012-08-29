
function proxy(self, method){
    return (function(){
        method.apply(self,arguments);
    });
}

var ClientHandler = function (){
    this.init.apply(this, arguments);
}

ClientHandler.prototype = {
    init: function(connection, request){
        this.connection = connection;
        this.request = request;
        this.bindEvents();
        console.log('connection accepted from ' + request.origin);
        console.log(request);
    },

    bindEvents: function(){
        this.connection.on('message', proxy(this,this.message));
        this.connection.on('close', proxy(this,this.close));
    },

    message: function(message){
        console.log(message);
        this.send({data:'pong'});
    },

    send: function(data){
        this.connection.send(JSON.stringify(data));
    },

    close: function(connection){
        console.log('connection closed');
    }

}

module.exports = ClientHandler;

