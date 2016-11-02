#forEach

原型：

    Array.forEach(function(item, index, array){
        //回调函数内容
    }, args);
    
简单说明：

    item指遍历数组的当前元素，index指当前元素的索引，array指数组本身，默认情况下this指向Window对象
    
    当存在第二个参数args时，this指向args。
    
兼容性扩展（对不支持ES5的进行扩展）：

    if(!Array.prototype.forEach){
    Array.prototype.forEach = function(callback,thisArg){
        for (var i=0;i<this.length;i++){
            //当thisArg为undefined时，JS引擎会将window作为其调用者
            callback.call(thisArg,this[i],i,this.toString());
        }
    }
}