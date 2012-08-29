
_ = require('./utils');


function spawnMessage(ship){
    data = {
        type: 'spawn',
        pos: {
            x: ship.x,
            y: ship.y
        }
    }
    return data;
}

var GameWorld = function(){
    this.init.apply(this, arguments);
}

GameWorld.prototype = {
    ships: [],
    clients: [],
    init: function() {
        //
    },

    newClient: function(client){

        this.clients.push(client);
        for (var i = this.ships.length - 1; i >= 0; i--) {
            client.send(spawnMessage(this.ships[i]));
        }
    },

    clientMessage: function(message){
        this.spawnShip();
    },

    spawnShip: function(){
        function randomPos(x){
            return Math.floor(Math.random() * x);
        }
        ship = {
            x: randomPos(800),
            y: randomPos(450)
        }
        this.ships.push(ship);
        this.broadcast(spawnMessage(ship));
    },

    broadcast: function(data){
        for (var i = this.clients.length - 1; i >= 0; i--) {
            this.clients[i].send(data);
        };
    }
};

module.exports = GameWorld;

