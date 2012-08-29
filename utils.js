
function proxy(self, method){
    return (function(){
        method.apply(self,arguments);
    });
}

module.exports = {
    proxy: proxy
}

