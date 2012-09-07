
var CircleNode = cc.Node.extend({
    _strokeColor:"rgba(255,255,255,1)",
    _radius:10,

    setOptions: function(radius, strokeColor){
        this._strokeColor = strokeColor;
        this._radius = radius;
    },

    setStrokeColor: function(strokeColor){
        this._strokeColor = strokeColor;
    },

    setRadius: function(radius){
        this._radius = radius;
    },

    ctor:function (radius, strokeColor) {
        this._super();
        this.setOptions(radius, strokeColor);
    },

    draw:function () {
        this._super();
        cc.renderContext.fillStyle = "rgba(255,255,255,1)";
        cc.renderContext.strokeStyle = this._strokeColor;
        cc.renderContext.lineWidth = "2";
        cc.drawingUtil.drawCircle(cc.p(0,0), this._radius, 0, 10, false);
    }
});

