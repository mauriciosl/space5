
var _ = require('./utils');
var Universe = require('./universe').Universe;
var ClientHandler = require('./clienthandler');


var Game = function(){
    this.init.apply(this, arguments);
};

Game.prototype = {
    clients: [],
    universe: null,

    init: function() {
        this.universe = new Universe();
        this.universe.newObject('ship', 400, 200, {});
        this.universe.on('new', _.proxy(this, this.onNewObject));
    },

    newConnection: function(connection){
        var client = new ClientHandler(connection, this);
        var playerShip = this.universe.newObject('ship', 200,200, {});
        this.sendUniverse(client);
        client.setShip(playerShip);
        this.clients.push(client);
    },

    sendUniverse: function(client){
        universeData = this.universe.serialize();
        universeMessage = {
            type: 'universe',
            universe: universeData
        }
        console.log(universeData);
        client.send(universeMessage);
    },

    onNewObject: function(uObject){
        objectData = uObject.serialize();
        newObjectMessage = {
            type: 'newObject',
            object: objectData
        }
        this.broadcast(newObjectMessage);
    },

    broadcast: function(data){
        for (var i = this.clients.length - 1; i >= 0; i--) {
            this.clients[i].send(data);
        };
    }
};

module.exports = Game;

