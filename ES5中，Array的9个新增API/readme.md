#forEach

原型：

    //标准
    forEach(callback[,thisArg])

    //简单示例
    Array.forEach(function(item, index, array){
        //回调函数内容
    }, args);
    
简单说明：

    item指遍历数组的当前元素，index指当前元素的索引，array指数组本身，默认情况下this指向Window对象
    
    当存在第二个参数args时，this指向args。
    
兼容性扩展（对不支持ES5的进行扩展）：

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (callback, thisArg) {
            for (var i = 0; i < this.length; i++) {
                //当thisArg为undefined时，JS引擎会将window作为其调用者
                callback.call(thisArg, this[i], i, this.toString());
            }
        }
    }
    
#filter

原型：

    //标准
    filter(callback[,thisArg])
    
    //简单示例
    Array.filter(function(item, index, array){
        //回调函数内容
    }, args);
    
简单说明：

    3个参数同forEach，args也同forEach，唯一不同的是，函数有回调函数里有return返回值。
    
    简单来说，该方法返回值是一个数组。
    初始时，这个数组是空数组，该方法会通过回调函数遍历整个数组（指Array这个），
    假如当前的元素返回值为true（或者可以隐式转换为true的，比如一个长度大于0的字符串），
    那么会将当前元素添加到被返回的数组中。
    
    例如：[1, 2, 3]，
    回调函数的return是item > 1, 
    当第一个元素1时，1>1为false，因此不会添加到返回的数组中，
    而2和3 >1显然是true，因此会被添加到数组中。最终，返回值是[2,3]。
    
    具体可以见demo。
    
兼容性扩展：

    if(!Array.prototype.filter) {
        Array.prototype.filter = function (callback, thisArg) {
            var temp = [];
            for (var i = 0; i < this.length; i++) {
                if(callback.call(thisArg,this[i])){
                    //如果callback返回true,则该元素符合过滤条件，将元素压入temp中
                    temp.push(this[i]);
                }
            }
            return temp;
        }
    }