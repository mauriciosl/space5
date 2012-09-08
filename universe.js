
var events = require('events');
var util = require('util');
var _ = require('underscore');

function Universe(){
    events.EventEmitter.call(this);
    this.objects = {};
}

util.inherits(Universe, events.EventEmitter);

_.extend(Universe.prototype, {
    add: function(uObject){
        this.objects[uObject.id] = uObject;
        this.emit('new', uObject);
    },

    getObjectByID: function(objectID){
        return this.objects[objectID];
    },

    newObject: function(){
        var newUniverseObject = UniverseObject.newObject.apply(this, arguments);
        this.add(newUniverseObject);
        return newUniverseObject;
    },

    serialize: function(){
        var universeData = {};
        _.each(this.objects, function(universeObject, id){
            universeData[id] = universeObject.serialize();
        });
        return universeData;
    }

});

var UniverseObject = function(id, type, x, y, props){
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.props = props;
};

UniverseObject.idSequence = 0;
UniverseObject.newObject = function(type, x, y, props){
    return new UniverseObject(UniverseObject.idSequence++, type, x, y, props);
};

UniverseObject.prototype = {
    serialize: function(){
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            props: this.props
        };
    }
};

module.exports = {
    Universe: Universe,
    UniverseObject: UniverseObject
}
