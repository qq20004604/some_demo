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

