/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

graphics = {
    'ship': 'res/gfx/coco.png'
}


var MyLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    tmxMap:null,
    connection:null,
    universeLayer:null,
    universe:null,
    myShipID:null,


    init:function (connection) {

        this.connection = connection;
        this.bindConnection();
        //////////////////////////////
        // 1. super init first
        this._super();
        this.universe = {};

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            this,
            function () {
                console.log('button');
                this.connection.send('ping');
            });
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem, null);
        menu.setPosition(cc.PointZero());
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));


        var universeLayer = cc.LayerColor.create(cc.c4b(0,0,40,100));
        this.universeLayer = universeLayer;
        this.addChild(this.universeLayer, 0);
        return true;
    },

    setUniverse: function(universe){
        var self = this;
        this.universeLayer.removeAllChildrenWithCleanup(true);
        _.each(universe, function(universeObject, id){
            self.spawn(universeObject);
        });

    },

    spawn: function(universeObject){
        sprite = cc.Sprite.create(graphics[universeObject.type]);
        sprite.setAnchorPoint(cc.p(0.5, 0.5));
        sprite.setPosition(cc.p(universeObject.x, universeObject.y));

        var emergencyAction = cc.RepeatForever.create(
            cc.Sequence.create([
                cc.TintTo.create(0.25, 255,0,0),
                cc.TintTo.create(0.25, 255,255,255),
            ])
        );
        // sprite.runAction(emergencyAction);
        this.universe[universeObject.id] = sprite;
        this.universeLayer.addChild(sprite,1);
        sprite.setColor(cc.c3b(255,0,0));
    },

    setShip: function(id){
        this.myShipID = id;
        myShipSprite = this.universe[id];
        var selectionSprite = cc.Sprite.create("res/gfx/small_selection.png");
        selectionSprite.setAnchorPoint(cc.p(0.5,0.5));
        // selectionSprite.setPosition(cc.p(s.width / 2, s.height / 2));
        var rect = myShipSprite.getBoundingBox();
        console.log(rect);
        myShipSprite.addChild(selectionSprite, 5);
        selectionSprite.setPosition(cc.p(rect.width / 2, rect.height / 2));
        var pulseAction = cc.RepeatForever.create(
            cc.Sequence.create([
                cc.TintTo.create(0.25, 0, 80, 0),
                cc.TintTo.create(0.25, 0, 20, 0)
            ])
        );
        selectionSprite.runAction(pulseAction);
    },

    bindConnection: function(){
        var self = this;
        this.connection.onopen = function () {
            // connection is opened and ready to use
            console.log('connection opened');
        };

        this.connection.onerror = function (error) {
            // an error occurred when sending/receiving data
            console.error('connection error:' + error);
        };

        this.connection.onmessage = function (message) {
            // try to decode json (I assume that each message from server is json)
            try {
                var json = JSON.parse(message.data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', message.data);
                return;
            }
            // handle incoming message
            console.log(json);
            self.onmessage(json);
        };
    },

    onmessage: function(data){
        switch(data.type){
            case 'universe':
                this.setUniverse(data.universe);
                break;
            case 'control':
                this.setShip(data.id);
                break;
            default:
                console.log('data not valid:' + data);
                break;
        }
    }

});

function getConnection(){
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    var connection = new WebSocket('ws://' + window.location.host);
    return connection;
}

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init(getConnection());
    }
});
