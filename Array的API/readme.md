##Array.from()

原型：

    Array.from(string, mapFunction, thisArg)

说明：

    第一个参数是字符串（也可以是其他，参照备注），例如"abc"，
    然后返回值是一个空数组，
    然后从字符串的开头依次取出字符，放到返回的数组中，
    例如上面的返回值是["a", "b", "c"]
    
    三个参数。
    第一个参数是string类型，
    第二个参数是一个函数，函数类似是Array的map方法（但没有第三个array参数）；
    第三个参数是第二个回调函数的this指向的目标；
    
备注：

    第一个参数可以的类型是：
    string：字符串
    Set：ES6新增，简单来说，是一个不能包含重复项的有序列表的类型
    Map：ES6新增，简单来说，是将一个值映射给一个唯一的键
    arguments：函数的参数关键词
    更多可以参照：
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
    
兼容性：

    IE似乎不支持（包括IE11），Edge浏览器支持，其他的参照上面的url的文档

兼容性写法：（抄自MDN，下同）
    
    if (!Array.from) {
        Array.from = (function () {
            var toStr = Object.prototype.toString;
            var isCallable = function (fn) {
                return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
            };
            var toInteger = function (value) {
                var number = Number(value);
                if (isNaN(number)) {
                    return 0;
                }
                if (number === 0 || !isFinite(number)) {
                    return number;
                }
                return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
            };
            var maxSafeInteger = Math.pow(2, 53) - 1;
            var toLength = function (value) {
                var len = toInteger(value);
                return Math.min(Math.max(len, 0), maxSafeInteger);
            };

            // The length property of the from method is 1.
            return function from(arrayLike/*, mapFn, thisArg */) {
                // 1. Let C be the this value.
                var C = this;

                // 2. Let items be ToObject(arrayLike).
                var items = Object(arrayLike);

                // 3. ReturnIfAbrupt(items).
                if (arrayLike == null) {
                    throw new TypeError("Array.from requires an array-like object - not null or undefined");
                }

                // 4. If mapfn is undefined, then let mapping be false.
                var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                var T;
                if (typeof mapFn !== 'undefined') {
                    // 5. else
                    // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                    if (!isCallable(mapFn)) {
                        throw new TypeError('Array.from: when provided, the second argument must be a function');
                    }

                    // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    if (arguments.length > 2) {
                        T = arguments[2];
                    }
                }

                // 10. Let lenValue be Get(items, "length").
                // 11. Let len be ToLength(lenValue).
                var len = toLength(items.length);

                // 13. If IsConstructor(C) is true, then
                // 13. a. Let A be the result of calling the [[Construct]] internal method
                // of C with an argument list containing the single item len.
                // 14. a. Else, Let A be ArrayCreate(len).
                var A = isCallable(C) ? Object(new C(len)) : new Array(len);

                // 16. Let k be 0.
                var k = 0;
                // 17. Repeat, while k < len… (also steps a - h)
                var kValue;
                while (k < len) {
                    kValue = items[k];
                    if (mapFn) {
                        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                    } else {
                        A[k] = kValue;
                    }
                    k += 1;
                }
                // 18. Let putStatus be Put(A, "length", len, true).
                A.length = len;
                // 20. Return A.
                return A;
            };
        }());
    }


##Array.isArray()

说明：
    检测参数是否是数组。
    如果是数组返回true，否则返回false。
    
    原理是通过检查Object.prototype.toString.call()方法来确认是否是数组类型的
    
    所以Array.prototype的返回值也是true，
    但Array的返回值是false（Object.prototype.toString.call(Array)）的返回值是"[object Function]"
    

兼容性写法：

    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }