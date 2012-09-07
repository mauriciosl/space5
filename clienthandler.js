
_ = require('./utils');

var ClientHandler = function (){
    this.init.apply(this, arguments);
}

ClientHandler.prototype = {

    myShip: null,

    init: function(connection, request, game){
        this.connection = connection;
        this.game = game;
        this.bindEvents();
    },

    setShip: function(universeObject){
        this.myShip = universeObject;
        this.send({
            type: 'control',
            id: this.myShip.id
        });
    },

    bindEvents: function(){
        this.connection.on('message', _.proxy(this,this.message));
        this.connection.on('close', _.proxy(this,this.close));
    },

    message: function(message){
        console.log(message);
        // this.world.clientMessage(message);
    },

    send: function(data){
        this.connection.send(JSON.stringify(data));
    },

    close: function(connection){
        console.log('connection closed');
    },

}

module.exports = ClientHandler;

