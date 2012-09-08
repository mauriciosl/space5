
_ = require('./utils');

var ClientHandler = function (){
    this.init.apply(this, arguments);
}

ClientHandler.prototype = {

    myShip: null,
    game: null,

    init: function(connection, game){
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
        if(message.type != 'utf8'){
            console.error('invalid message format');
            return;
        }
        message = JSON.parse(message.utf8Data);
        console.log(message);
        if(message.type == 'control'){
            this.handleKey(message.key);
        }
        // this.world.clientMessage(message);
    },

    handleKey: function(key){
        if(key == 'LEFT'){
            this.game.goLeft(this.myShip.id);
        }else if(key == 'RIGHT'){
            this.game.goRight(this.myShip.id);
        }
    },

    send: function(data){
        this.connection.send(JSON.stringify(data));
    },

    close: function(connection){
        console.log('connection closed');
    },

}

module.exports = ClientHandler;

