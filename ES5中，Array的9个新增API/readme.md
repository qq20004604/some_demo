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
    
兼容性扩展（对不支持ES5的进行扩展）（下面的兼容性扩展，是根据别人的然后拿来再优化的）：

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (callback, thisArg) {
            for (var i = 0; i < this.length; i++) {
                //当thisArg为undefined时，JS引擎会将window作为其调用者
                if (this[i])
                    callback.call(thisArg, this[i], i, this);
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

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (callback, thisArg) {
            var temp = [];
            for (var i = 0; i < this.length; i++) {
                if (this[i]) {
                    if (callback.call(thisArg, this[i], i, this)) {
                        //如果callback返回true,则该元素符合过滤条件，将元素压入temp中
                        temp.push(this[i]);
                    }
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

    if (!Array.prototype.map) {
        Array.prototype.map = function (callback, thisArg) {
            var temp = [];
            for (var i = 0; i < this.length; i++) {
                if (this[i]) {
                    var newItem = callback.call(thisArg, this[i], i, this);
                    temp[i] = newItem//将callback返回的新元素压入temp中
                }
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
    
更多：

    数组中有空元素时，不会报错。
    例如：var arr = [1, 2, 3, 4, , 6, 7];
    他会自动跳过4和6中间的元素。
    但下面的兼容性扩展会，
    
兼容性扩展：

    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, initialValue) {
            var previousValue = initialValue || this[0];//如果不指定intialValue,则默认为数组的第一个元素
            //如果不指定initialValue（即第二个参数），i从1（第二个元素）开始遍历，否则就从0（第一个元素）开始遍历
            for (var i = initialValue ? 0 : 1; i < this.length; i++) {
                //previousValue 累加每一次返回的结果
                if (this[i])
                    previousValue = callback(previousValue, this[i], i, this.toString());
            }
            return previousValue;
        }
    }
    

#reduceRight

原型：

    //标准
    reduceRight(callback[,initialValue])
    
    //简单示例
    arr.reduceRight(function (previousValue, item, index, Array) {
        return xxx;    //xxx表示省略
    });
    
简单说明：

    和reduce几乎一样，唯一区别是，他从数组的最右边开始。只要理解了reduce就能理解这个
    
兼容性扩展：

    if (!Array.prototype.reduceRight) {
        Array.prototype.reduceRight = function (callback, initialValue) {
            var previousValue = initialValue || this[this.length - 1];//如果不指定intialValue,则默认为数组的第一个元素
            //如果不指定initialValue（即第二个参数），i从1（第二个元素）开始遍历，否则就从0（第一个元素）开始遍历
            for (var i = (initialValue ? this.length - 1 : this.length - 2); i > -1; i--) {
                //previousValue 累加每一次返回的结果
                if (this[i])
                    previousValue = callback(previousValue, this[i], i, this);
            }
            return previousValue;
        }
    }
    
#every

原型：

    //标准
    every(callback, thisArg);
    
    //简单示例
    arr.every(function(item, index, array){
        return item > xx;
    });
    
简单说明：

    返回值是true或者false
    初始情况下是true；
    然后遍历数组，有一个不满足，则为false，并且终止遍历过程。
    
    回调函数的this依然默认指向window，或者是every的第二个参数。
    
    空数组的every返回结果是true。
    
兼容性扩展：

    if (!Array.prototype.every) {
        Array.prototype.every = function (callback, thisArg) {
            var result = true;
            for (var i = 0; i < this.length; i++) {
                if (this[i]) {
                    if (!callback.call(thisArg ? thisArg : window, this[i], i, this)) {
                        result = false;
                        break;
                    }
                }
            }
            return result; //所有元素都符合条件，返回true
        }
    }
    

#indexOf

原型：

    //标准
    arr.indexOf(searchElement, fromIndex);
    
    //简单示例
    [1,2,3].indexOf(2);    //1（数组的第二个元素）
    [1,2,3].indexOf(4);    //-1（未找到，注意，-1不是false，隐式转换后他的值为true）
    
简单说明：

    用于查找第一个参数是否在数组中；
    如果不在，返回-1；
    如果在，返回在数组中遇见的第一个的下标；
    例如：[1,2,3,2].indexOf(2)的返回值是1，虽然第二个和第四个元素都是，但是先遇见第二个，而第二个的下标是1
        
    如果indexOf有第二个参数，那么从数组中第二个参数所指向的下标位置开始往后找；
    例如：[1,2,3,2].indexOf(2,2)的返回值是3，因为开始下标是2（即第三个元素3），因此从第三个开始，遇见的第一个2的下标是2；
    判断时含第二个参数所指向的数组元素
    
兼容性写法：

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var result = -1;
            for (var i = fromIndex ? fromIndex : 0; i < this.length; i++) {
                if (this[i]) {
                    if (searchElement === this[i]) {
                        result = i;
                        break;
                    }
                }
            }
            return result; //所有元素都符合条件，返回true
        }
    }
    
#lastIndexOf

注意：

    Index的I是大写

原型：

    //标准
    arr.lastIndexOf(searchElement, fromIndex);
    
    //简单示例
    [1,2,1].lastIndexOf(1);    //2
    [1,2,1].lastIndexOf(1, 1);    //0
    
简单说明：

    和indexOf几乎一样，唯一区别是从后往前找；
    
    下标指的是正常的下标（即从前往后的），不要想多了。
    
兼容性写法：

    if (!Array.prototype.lastIndexOf) {
        Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
            var result = -1;
            for (var i = (fromIndex ? fromIndex : this.length - 1); i > -1; i--) {
                if (this[i]) {
                    if (searchElement === this[i]) {
                        result = i;
                        break;
                    }
                }
            }
            return result; //所有元素都符合条件，返回true
        }
    }
    
#更多array方法

见MDN：

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array