###Function.bind(obj, arguments)

说明

    1. 简单来说，这个的返回值是一个函数，该函数未执行，该函数中的this指向obj这个对象。
    2. 有一些类似apply和call，但是apply和call是在改变this指向对象时，执行函数；
    3. 但bind不执行，只单纯改变了this指向的目标；
    4. 但有第二、三个甚至更多参数时，参数会依次作为Function的第一、二或更多的参数，在执行函数时，新参数则将被放置在后面；
    5. 具体来说，假如原函数test有a, b, c三个参数，在bind绑定结束后，执行该函数test(1, 2, 3)
    6. 在只有一个参数的情况下，a、b、c分别对应1，2，3；
    7. 假如bind过程中，第二个参数是10，那么a、b、c分别对应10、1、2（注意，此时tset(1,2,3)是没变的）
    8. 假如bind过程中，不仅有第二个参数，还有第三个参数20，那么a、b、c分别对应10、20、1
    9. 假如bind过程中，甚至还有第四个参数30，那么a、b、c跟1、2、3就没关系了，分别是10、20、30。

兼容性写法

    if (!Function.prototype.bind) {
        Function.prototype.bind = function () {
            var self = this; // 保存原函数
            var context = [].shift.call(arguments); // 需要绑定的this上下文，shift表示从数组最前面拿出一个元素
            var args = [].slice.call(arguments); // 剩余的参数转成数组，slice方法会返回一个全新的数组（避免数组按引用传递）
            return function () { // 返回一个新函数
                // 执行新函数时，将传入的上下文context作为新函数的this
                // 并且组合concat两次分别传入的参数，作为新函数的参数
                // 这里的arguments指的是新函数的参数了（bind结束后调用时，是个数组），而不是bind时的参数
                return self.apply(context, [].concat.call(args, [].slice.call(arguments)));
            }
        };
    }