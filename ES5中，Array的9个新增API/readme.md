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
    

#map

原型：

    //标准
    map(callback[,thisArg])
    
    //简单示例
    Array.map(function(item, index, array){
        //回调函数内容
    }, args);
    
简单说明：

    3个参数同forEach，args也同forEach，唯一不同的是，函数有回调函数里有return返回值。
    
    简单来说，该方法的返回值也是一个数组（类filter）；
    和filter的区别在于，filter是将原数组元素，选择性加入到新数组中。
    map是将原数组的每个元素，进行处理后，放到新数组中。
    
    例如：[1,2,3]作为原数组，map回调函数内的代码为：
    return item + 10;
    那么就相当于将1+10放到数组中，然后将2+10放到数组中，再将3+10放到数组中。
    结果为：[11, 12, 13]
    
    当然，也可以写更复杂的逻辑，比如if(item>3)时+10，然后else if(item>2)时+5，否则else -10
    那么结果就是[-9, 7, 13]
    
    见DEMO
    
兼容性扩展：

    if(!Array.prototype.map) {
        Array.prototype.map = function (callback, thisArg) {
            var temp = [];
            for (var i = 0; i < this.length; i++) {
                var newItem = callback.call(thisArg,this[i]);
                temp.push(newItem); //将callback返回的新元素压入temp中
            }
            return temp;
        }
    }
    
#reduce

原型：

    //标准
    reduce(callback[,initialValue])
    
    //简单示例
    arr.reduce(function (previousValue, item, index, Array) {
        return xxx;    //xxx表示省略
    });
    
简单说明：

    首先看回调函数，他有四个参数，
    item是当前元素，别的地方写的是currentValue表示当前值，为了方便理解，我这里写item和上面统一风格
    index是当前元素的索引；
    Array是整个数组（可以通过这个修改源数组）；
    上面3个都很好理解。
    
    第一个参数previousValue是核心。他表示上一次执行回调函数时的返回值。
    例如，有数组[1, 2, 3, 4]
    当我遍历到第二个元素时，回调函数的previousValue的值是1，item的值为2，
    return我写为：return previousValue + item
    那么当遍历到第三个元素时，回调函数的previousValue的值则为3（因为1+2），item的值为3
    当遍历到第四个元素时，previous的值则为6（因为3+3），
    最终reduce的返回值为10（因为6+4）
    
    那么问题来了，为什么没提到遍历第一个元素？
    原因是，当reduce没有第二个参数时，遍历从数组的第二个元素开始，
    第一次执行回调函数的previousValue的值是数组第一个元素的值
    
    当reduce存在第二个参数时（哪怕是null或者undefined），遍历都将从第一个元素开始；
    第一次执行回调函数时（遍历第一个元素），previousValue的值是第二个参数的值，而item是第一个元素的值
    
    所以在使用的时候需要注意，如果需要执行和数组元素个数一样次数的回调函数，那么必须设置reduce的第二个参数；
    如果不设置，那么回到函数次数执行的次数，将比数组元素个数少1。
    
    具体参见demo，我写了3种情况
    第一种是将数组的值相加；
    第二种是将数组的值相乘；
    第三种是将数组的值从reduce给的第二个参数中减去。
    事实上，还可以写第四种，比如说，将数组的值先相乘，然后加上一个数字，再用其结果和下个数组元素。
    即return previousValue * item + 5;这样的，具体写什么，应该根据实际需求来。