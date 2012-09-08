
function proxy(self, method){
    return (function(){
        method.apply(self,arguments);
    });
}

function randInt(max){
    return Math.floor(Math.random() * max);
}

module.exports = {
    proxy: proxy,
    randInt: randInt
}

