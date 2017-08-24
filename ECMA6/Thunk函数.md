<h3>1、Thunk函数基本定义</h3>

<h4>1.1、缘由</h4>

与函数的求值策略有关，求值策略分为两种：

1. 传名策略：在需要求值的时候才求值；
2. 传值策略：在传入函数的时候就求值；（又有说法叫按值传递）

如以下的示例代码：

```
function foo(a) {
    return a * 10   // 1+2在这里计算结果叫做【传名策略】
}
foo(1 + 2)  // 1+2在这里计算结果叫做【传值策略】
```

JavaScript是采用【传值策略】的语言。

**注意：**

基本类型传的是值，引用类型传的是地址。

<h4>1.2、传值策略的优点</h4>

传值策略有其优点，比如说：

foo这个函数里，对于传入进来的参数只调用了一次``a * 10``，因此似乎并没有什么区别。但假如代码改成如下形式：

```
function foo(a) {
    let count = 0;
    for (let i = 0; i < 10000; i++) {
        count += a * i
    }
    return count;
}
foo(1 + 2）
```

在这种情况下，【传值策略】的``1+2``只计算了一次，而若是【传名策略】，那么``1+2``显然要计算10000次，性能消耗明显大于前者。

<h4>1.3、传名策略的优点</h4>

而传名函数自然也有其优点。

foo的参数a在以上代码中，是必然执行的，假如参数a不一定执行呢？那么这次计算显然是没有意义的。

并且，若是参数里的表达式极为复杂，性能消耗巨大，那么只有在使用的时候，才会去执行和计算的传名策略，优点自然十分明显了。

如代码：

```
function foo(a, b) {
    if (b) {
        return a + 1;
    } else {
        return 0;
    }
}
// 阶乘求值函数
function bar(i) {
    if (i === 1) {
        return 1
    } else {
        return i * bar(i - 1)
    }
}
foo(bar(100))
```

在以上代码中，foo并没有传第二个参数，所以作为foo参数的表达式：``bar(100)``显然是白计算了。假如bar的参数的值比较大的时候，那么不必要的性能消耗显然十分严重。

如果类似的可能不会被使用的参数很多，那么不要的性能消耗显然就更多了。

这个时候，传名策略的优点即显现了，只有当foo有第二个参数（并且为true）时，执行到``return a + 1``这一段代码的时候，才会执行阶乘函数，也就是说，无论你参数多么复杂，我不关心，不执行这个参数的时候，对我来说就没有影响。

<h3>2、在JavaScript中实现传名策略</h3>

<h4>2.1、代码改造</h4>

js是函数式编程，所以可以把函数作为参数传给另外一个函数。

假如我把复杂的表达式放在一个函数里，然后将这个函数作为参数传给目标函数，只有当我需要执行的时候，直接执行这个函数，不就做到变相的按名传递咯。

对1.3中的代码进行改造，结果如下：

```
function foo(a, b) {
    if (b) {
        return a() + 1; // 改造点1：从a -> a()
    } else {
        return 0;
    }
}
// 阶乘求值函数
function bar(i) {
    if (i === 1) {
        return 1
    } else {
        return i * bar(i - 1)
    }
}
function thunk(){   // 第二个改造点，将bar(100)放置在thunk函数中
    bar(100)
}
foo(thunk)  //并用thunk函数替代原有的参数
```

当改造完毕后，再也不用担心在foo的第二个参数不是true的时候，会去执行第一个参数了。

这里的thunk函数，就是一般实现传名策略的编译器的做法，即将参数放在临时函数中，在需要的时候再去执行。

这个临时函数，就称为【**Thunk函数**】

<h3>3、JS中的Thunk函数</h3>

<h4>3.1、JS中Thunk函数的不同</h4>

上面实现的是一般Thunk函数，但是js中的Thunk函数有所不同。

**通常的Thunk函数：**

--》在参数需要执行的时候才执行；

**js的Thunk函数：**

--》在需要对结果进行处理的时候才执行，特点是只有一个参数，并且该参数是回调函数。

也就是说，在js的Thunk函数中，具有2+1个特点：

```
1. 有且只有一个参数是callback的函数；
2. 原函数是多参数函数；（如果只有一个参数是没有改造必要的）
3. 通常情况下，callback的第一个参数是error
```

一般来说，经过Thunk函数改造之后，函数会具有几个优点：

1. 只关心回调函数的实现，不关心其他参数；
2. 实现了柯里化，具体参照[这篇博文](http://www.jianshu.com/p/9b6b5c7527fc)。简单来说，假如我引用了一个函数，他有3个参数，但我每次使用它，有2个参数的值都是固定的，只有第3个参数的值不固定，那么我每次都这么写2个固定参数是很麻烦的，柯里化可以解决这个问题。
3. 和Generator结合后，异步函数的写法与同步函数的写法十分相似；

<h4>3.2、示例</h4>

```
function Foo(callback, time) {
    setTimeout(function () {
        callback()  // 为了方便理解，没有简写
    }, time)
}
function Thunk(time) {
    return function (callback) {
        Foo(callback, time)
    }
}
let foo = Thunk(1000)
foo(function () {
    console.log("test")
})
// 延迟1秒后
// 'test'
```

解释：

1. Foo函数是一个异步函数，他有2个参数，分别是延迟后执行的函数，以及延迟时间；
2. 在通过Thunk函数处理后，我们在Thunk函数中传了延迟时间，返回了一个新函数，这个函数只有一个参数，那就是处理函数；
3. 我们在执行的时候，只需要传处理函数即可（代码中是打印'test'）；

<h4>3.3、Thunk函数与异步函数</h4>

单纯的Thunk函数有优点，但不明显，但当和ES6的Generator函数结合之后，Thunk函数将十分好用。

先看示例代码：

```
// 一个普通的异步函数，接受3个参数，分别是延迟，执行处理函数，和回调函数
function delay(time, dealCallback, callback) {
    setTimeout(function () {
        dealCallback()
        callback()
    }, time ? time : 1000)
}
// 一个标准的thunk函数，声明时暴露打印内容和时间的配置，但不会立即执行
// 返回值是一个参数为回调函数的函数（执行本函数时，异步不会执行）
function thunkForAsync(time, dealCallback) {
    return function (callback) {
        delay(time, dealCallback, callback)
    }
}

// 一个Generator函数，目的是连续发起2次异步请求，但打印内容不同
function *g() {
    yield thunkForAsync(null, function () {
        console.log('first')
    })
    yield thunkForAsync(500, function () {
        console.log('second')
    })
}
// 一个用于自动执行（管理）Generator函数的Thunk函数
// 自动控制 Generator 函数的流程，接收和交还程序的执行权
// 但要求Generator函数的每个yield表达式，都是Thunk函数（不然next没有办法作为参数传过去）
function thunkForGenerator(callback) {
    let g = callback()

    function next() {
        let result = g.next()
        if (result.done) {
            return
        }
        result.value(next)
    }

    // 这里启动函数
    next()
}
// 执行管理函数，将Generator函数作为参数传给他即可
thunkForGenerator(g)
```

这个代码比较复杂，初次接触时可能无法理解，这里慢慢解释：

1. 首先，需要有1个Thunk函数，用于管理Generator函数，他的作用是自动控制 Generator 函数的流程，接收和交还程序的执行权；
2. 在以上代码中，这个函数是``thunkForGenerator``；
3. 其次，``thunkForGenerator``这个函数要求``g``这个Generator函数里，每个异步请求都是Thunk函数；
4. 具体来说，就是yield表达式的值是一个函数，该函数只有一个参数，并且该参数是回调函数；
5. 在``thunkForAsync``函数对``delay``函数进行封装后，满足了这一点；
6. 于是``thunkForGenerator``函数可以管理``g``函数了

``thunkForGenerator``这个函数的管理是这么做的：

1. 当Generator函数传入函数内后，执行他，获得一个遍历器；
2. 执行这个遍历器的next()方法，获取返回值result；
3. 假如result的done属性为true时，返回（说明遍历完毕了）；
4. 否则说明该result.value有值，且该值是yield表达式的值；
5. 由于yield表达式的值是一个Thunk函数，因此可以将传一个函数给他，而这个函数是重新循环本流程的第二至五步（``thunkForGenerator``的``next``方法）；

控制权的交还流程如下：

1. 虽然``thunkForGenerator函数``将next方法传给了Thunk函数，但该函数不会立即执行，而是传给了delay函数的参数三；
2. 而delay函数的参数三是一个函数，但该函数只会在异步执行完毕后去执行；
3. 也就是说，当第一次执行遍历器的next方法后，控制权从``thunkForGenerator函数``交给了``g函数``；
4. 然后``g函数``会触发一次1000ms延迟的异步（thunkForAsync函数），等异步执行完毕后，``g函数``执行了``thunkForGenerator函数``的next方法，将控制权重新还给了他；
5. 然后``thunkForGenerator函数``发现done为false，于是又执行了遍历器的next方法，将控制权交给了``g函数``；
6. ``g函数``执行完代码，通过执行``thunkForGenerator函数``的next方法，将控制权还了回去；
7. 此时``thunkForGenerator函数``再次执行遍历器的next，但``g函数``发现此时没代码可执行了，于是返回结果，done为true；
8. 因为done为true，所以``thunkForGenerator函数``不再继续下去，也返回了。

<h3>4、Thunk函数的通用处理</h3>

<h4>4.1、es6版的Thunk函数转换器</h4>

Thunk函数还是有用的，但每次都要封装一个Thunk函数，还是有点麻烦。

由于Thunk函数的特点鲜明，即：

1. 只有一个回调函数作为参数；

因此可以进行固定的封装处理，写一个转换器就好啦，具体方法如下：

1、最后需要执行目标函数。可以用call或者apply来执行，执行的时候需要指定this，其他参数，以及回调函数：

```
fn.call(this, ...args, callback);
// 分别是this，其他参数（扩展运算符展开），执行的回调函数
```

2、执行上面这段代码的时候，应该是将回调函数传入函数，那么应在上面代码外面加一层壳。<br>
由于同时要获取该函数执行完毕后的返回值，因此应返回``fn.call()``的返回值

```
let foo = function (callback) {
    return fn.call(this, ...args, callback)
}
```

3、回调函数的参数处理了，但我们也得配置一下其他参数吧，用一个函数搞定他。

```
let foo = function (...args) {
    return function (callback) {
        return fn.call(this, ...args, callback)
    }
}
```
这个的核心就是利用扩展运算符，即[es6新增的函数的rest参数](http://blog.csdn.net/qq20004604/article/details/72513009)，具体可以参考链接里的博客。<br>
简单来说，就是将传的所有参数取出来，然后放到一个数组里并赋值给args。在fn.call里面，再将这个数组展开作为fn调用时的前n个参数。

4、等等，我们配好了fn的参数，也配好了他的回调函数，但fn函数呢？

```
const Thunk = function (fn) {
    return function (...args) {
        return function (callback) {
            return fn.call(this, ...args, callback)
        }
    }
}
```

5、Thunk通用转换函数写好了——es6版本的！老版本的懒得写了，反正就是把不支持的新特性用老的方法实现一遍而已啦。

<h4>4.2、实战利用转换器转换函数变为Thunk函数</h4>

为了方便，原函数的回调函数应作为函数的最后一个参数使用。

不然还得改写Thunk函数转换器，没必要，所以原函数如果不符合的话，调整一下原函数的参数就行。

1、被处理的函数，为了方便理解，具有以下特点：<br>
①console.log(this)，显示this指向目标；<br>
②有两个参数，对两个参数进行计算，并将值传给身为第三个参数的回调函数；<br>
③执行第三个参数的回调函数；<br>
④有返回值；<br>
如代码：

```
function foo(x, y, callback) {
    console.log(this)	// ①
    let result = x + y;	// ②
    callback(result)	// ③
    return result		// ④
}
```

2、将foo函数传入Thunk函数转换器进行第一步处理：

```
let setting = Thunk(foo)
// setting = function (...args) {
//     return function (callback) {
//         return foo.call(this, ...args, callback)
//     }
// }
```

**为了帮助理解，处理后的结果见注释**

3、传入foo函数需要的其他参数，为了帮助理解，特通过bind绑定this指向的对象：

```
let fn = setting(1, 2).bind("abc")  //在这步绑定this指向的目标
// fn = (function (callback) {
//     return foo.call(this, 1, 2, callback)
// }).bind("abc")
```

此时只是改变了this指向的目标，和传入了参数，但尚未执行foo

4、传入回调函数，执行foo函数：

```
let result = fn(data => {
    console.log(data)
})
// result = foo.call(this, 1, 2, data => {
//     console.log(data)
//     console.log(this)
// })

// 输出：
// "abc"
// 3
```
5、别忘了，为了测试，我们还添加了返回值，如果运转正确的话，返回值被赋值给了result（毫无疑问会运转正确）：

```
result;	//3
```

6、如果简化，也可以这么写，即第二三步合并。

```
let fn = Thunk(foo)(1, 2).bind("abc")
```

7、假如不用bind来修改this指向对象，然后改变this指向目标呢？

两种解决办法：<br>
①Thunk函数再封装一层，即执行callback的时候尚不执行foo函数，等调用call的时候再执行。<br>
但这种缺点很明显，增加了复杂度，执行回调函数的时候，每次都需要加一个call、apply，或者加一对括号``()``

```
const Thunk = function (fn) {
    return function (...args) {
        return function (callback) {
            return function () {		//额外增加的一层
                return fn.call(this, ...args, callback)
            }
        }
    }
}
```

②在绑定参数的时候，让this指向第一个参数。这种方法需要修改Thunk函数转换器。<br>
但缺点也有，即利用此Thunk转换器转换函数的时候，每次绑定参数，都必须指定this指向的目标，如果忘记的话，代码执行将出现问题。

修改方式如下：

```
const Thunk = function (fn) {
    return function (...args) {
        return function (callback) {
            return fn.call(...args, callback)   // 这里去掉原本的第一个参数this
        }
    }
}

function foo(x, y, callback) {
    // 略
}

let fn = Thunk(foo)("abc", 1, 2)    // 这里的第一个参数就是this指向的目标
let result = fn(data => {
    // 略
})
```

修改的地方参照注释

<h4>4.3、实战演示改造3.3中的代码</h4>

改造后的代码如下：

```
// delay函数略
const Thunk = function (fn) {
    return function (...args) {
        return function (callback) {
            return fn.call(this, ...args, callback)
        }
    }
}
function *g() {
    yield Thunk(delay)(null, function () {
        console.log('first')
    })
    yield Thunk(delay)(500, function () {
        console.log('second')
    })
}
// thunkForGenerator函数略
```


<h3>5、Promise对象的Generator函数自动执行器</h3>

<h4>5.1、改造管理自动执行的函数</h4>

上面用的是Thunk函数自动执行Generator函数，让其可以依次执行。

原理是：

1. 将管理Generator函数自动执行的Thunk函数称之为（T函数），并且要求每个Generator函数的yield表达式都是一个Thunk函数。
2. T函数会判断遍历器的``next()``的返回值的done是否为true，不是true的话将下一次判断的函数作为回调函数传给yield表达式的Thunk函数；
3. 而yield表达式因为是Thunk函数，因此在执行完毕后，会执行这个回调函数，让T函数的判断函数继续执行；
4. 然后循环，直到done为true的时候终止

关键点是什么？

由于Generator函数的yield表达式是Thunk函数，那么只要T函数传过去的回调函数，能判断结果，再次执行判断并传递同样的回调函数，那么就可以做到。

假如我们只改造管理管理Generator函数的T函数，使用Promise来实现，那么代码改如何改？

很简单，只需要改上面``thunkForGenerator函数``的next函数即可

```
function promiseForGenerator(callback) {
    let g = callback()

    let next = function () {
        let result = g.next()
        if (result.done) {
            return
        }
        return new Promise((resolve, reject) => {
            resolve(result.value)
        }).then(fn => {
            fn(next)
        })
    }
    next()
}
promiseForGenerator(g)
```

核心思想就一点，在没结束的时候返回一个Promise对象，将result.value作为resolve的参数，然后在then里面执行。

讲道理说，如果只是这样，这种改造方法没啥意义，只是提供一种思路——我们还会面临使用Promise的情况。

例如：

yield表达式的值不是Thunk函数，而是Promise对象呢，显然之前的``thunkForGenerator函数``是不能解决这个问题的。

<h4>5.2、使用promise管理Generator函数自动执行</h4>

这时，假设yield表达式不是Thunk函数了，而是一个Promise对象呢（这显然很常见，异步请求用Promise对象来实现，在es6出来后是很正常的事情）。

显然，上面的thunkForGenerator不能满足要求，我们需要改造他。

首先，我们需要制造一个转换器，用于将普通的异步请求转换为Promise对象。

```
const bePromise = function (fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn.call(this, ...args, resolve)
        })
    }
}
```

Generator函数和3.3比起来有变化，但和4.3的相同：

```
function *g() {
    yield bePromise(delay)(null, function () {
        console.log('first')
    })
    yield bePromise(delay)(500, function () {
        console.log('second')
    })
}
```

因为改成了Promise对象，所以处理函数也需要做相应的改变

```
function thunkForGenerator(callback) {
    let g = callback()
    function next() {
        // 这个时候，假如是Promise对象，已经开始执行异步请求了
        let result = g.next()
        if (result.done) {
            return
        }
        // 当Promise的对象改变时，会触发then
        result.value.then(() => {
            next()
        })
    }
    next()
}
```

完整代码如下：

```
function delay(time, dealCallback, callback) {
    setTimeout(function () {
        dealCallback()
        callback()
    }, time ? time : 1000)
}

const bePromise = function (fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn.call(this, ...args, resolve)
        })
    }
}

function *g() {
    yield bePromise(delay)(null, function () {
        console.log('first')
    })
    yield bePromise(delay)(500, function () {
        console.log('second')
    })
}

function thunkForGenerator(callback) {
    let g = callback()

    function next() {
        // 这个时候，假如是Promise对象，已经开始执行异步请求了
        let result = g.next()
        if (result.done) {
            return
        }
        // 当Promise的对象改变时，会触发then
        result.value.then(() => {
            next()
        })
    }

    next()
}
thunkForGenerator(g)
```

<h4>5.3、Co模块</h4>

Co模块的具体介绍参照[阮一峰的博文](http://es6.ruanyifeng.com/#docs/generator-async#co-模块)，我这里只讲一些大概内容。

首先，Co模块的实现原理，与5.2中的``thunkForGenerator函数``相近。

5.2代码中的缺陷（Co模块改进内容）：

1. 5.2中代码是没有返回值的，因此只能假定不会出错，但实际中显然是不可能的；
2. yield表达式，虽然使用了Promise对象，但没考虑到对出错情况的捕获和管理。即，假如在执行next的时候出错了，会导致代码中断运行；
3. 没有考虑到``thunkForGenerator函数``的参数不符合要求的情况；
4. 没有考虑到yield表达式并非Promise对象的情况；

[Co模块的github地址](https://github.com/tj/co/blob/master/index.js)

但基于仿其原理，进行改造并不难，当然，不会像Co模块那样完善。

另外，为了处理对错误的捕获，需要修改delay函数为模拟真正的Promise异步函数（而非取巧的）

```
function delay(time, dealCallback) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            try {
                dealCallback()
                throw new Error("abc")
                resolve()
            } catch (err) {
                reject(err)
            }
        }, time ? time : 1000)
    })
}

const byPromise = function (fn) {
    return function (...args) {
        return fn.call(this, ...args)
    }
}

function *g() {
    yield byPromise(delay)(null, function () {
        console.log('first')
    })
    yield byPromise(delay)(500, function () {
        console.log('second')
    })
}

function co(gen) {
    return new Promise((resolve, reject) => {
        // 略去判断gen不是generator函数的代码

        let g = gen()

        function onSuccess(res) {
            let result = g.next(res)
            // 增加错误捕获
            try {
                next(result)
            } catch (err) {
                reject(err)
            }
        }

        function onError(err) {
            let ret;
            try {
                ret = g.throw(err)
            } catch (e) {
                return reject(e)
            }
            next(ret)
        }

        function next(result) {
            if (result.done) {
                return resolve(result.value)
            }
            // 略去对每一步的value属性是不是Promise对象的检查
            result.value.then(onSuccess, onError)
        }

        onSuccess()
    })
}

co(g).then(data => {
    console.log(data)
}, err => {
    console.log(err)
})
```

优化改造完毕