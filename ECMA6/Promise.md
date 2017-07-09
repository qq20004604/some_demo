<h2>Promise</h2>

<h3>1、是什么</h3>


<h3>2、基本例子</h3>

Promise有几个特点：

1. new出来后立刻执行（除了声明中的resolve和reject）；
2. 只执行一次，并且结果发生后，无论之后几次调用then，都只执行那唯一一个结果（resolve或者reject）；
3. 如果处于pending中，那么执行then时，相当于添加到队列里，peding中不执行，但等结果出来后，会一起执行（而非只执行一个或者不执行）；
4. resolve或者reject只能接受一个参数，如果要传多个参数的话，请使用数组或者对象的形式；
5. resolve和reject里函数不是在声明时执行，而是异步的，在判定promise的状态为非pending状态时执行；

如以下示例：

```
console.log(new Date);
let foo = new Promise(function (resolve, reject) {
    setTimeout(function () {
        //获取毫秒的数值
        var d = (new Date()).getMilliseconds();
        if (d % 2 === 0) {
            resolve([new Date(), d]);
        } else {
            reject([new Date(), d]);
        }
    }, 1000);
})

foo.then(function (arr) {
    console.log(new Date);
    console.log("resolve: " + arr[0]);
}, function (arr) {
    console.log("reject: " + arr[0]);
})

foo.then(function (arr) {
    console.log(arr[1]);
    console.log("resolve: " + arr[0]);
}, function (arr) {
    console.log(arr[1]);
    console.log("reject: " + arr[0]);
})

//Tue Jul 04 2017 00:06:52 GMT+0800 (中国标准时间)

/* 然后，1秒后 */
//reject: Tue Jul 04 2017 00:06:53 GMT+0800 (中国标准时间)
//633
//reject: Tue Jul 04 2017 00:06:53 GMT+0800 (中国标准时间)
```

以上代码证明了第2，3，4点。而第一点和第五点通过以下代码证明：

```
let foo = new Promise(function (resolve, reject) {
    resolve();
    console.log("in Promise");
})

console.log("after Promise");

foo.then(function (arr) {
    console.log("in resolve");
});

console.log("at last");

//in Promise
//after Promise
//at last
//in resolve
```

证明除了resolve和reject中的代码是异步的之外，其他都是顺序执行（位于foo.then后的代码先执行，之后才执行了foo.then的回调函数）。

<h3>3、当两个Promise对象发生交互时</h3>

具体来说，Promise实例在执行回调函数时可以传一个参数，而这个参数可以是另外一个Promise实例的回调函数。如代码：

```
let foo = new Promise(function (res, rej) {
    setTimeout(function () {
        res("1")
    }, 1000)
})
let bar = new Promise(function (res, rej) {
    res(foo);    //参数是foo实例
})
```

在这种情况下，bar的回调函数并不会立即执行，而是会等待foo的状态改变后，再去执行bar的回调函数。

即当Promise实例bar的回调函数的参数是另外一个Promise实例foo时，bar在状态改变后不会立即执行，而是等待前一个Promise实例的状态发生改变后，他才会执行。

<table>
    <tr>
        <td>情况</td>
        <td>foo</td>
        <td>bar</td>
    </tr>
    <tr>
        <td>基本情况</td>
        <td>一个Promise实例</td>
        <td>bar的then的回调函数的参数是foo</td>
    </tr>
    <tr>
        <td>延迟等待时间：foo小于bar</td>
        <td>先执行</td>
        <td>后执行</td>
    </tr>
    <tr>
        <td>延迟等待时间：foo大于bar</td>
        <td>先执行</td>
        <td>等待foo执行完后即执行</td>
    </tr>
</table>

如代码：

```
let foo = new Promise(function (res, rej) {
    setTimeout(function () {
        res("1")
    }, 1500)
})
let bar = new Promise(function (res, rej) {
    setTimeout(function () {
        console.log(bar);
    }, 1000)
    setTimeout(function () {
        res(foo);
    }, 500)
})
let baz = new Promise(function (res, rej) {
    res("3");
})

foo.then(function (val) {
    console.log("foo: " + val);
})
bar.then(function (val) {
    console.log("bar: " + val);
})
baz.then(function (val) {
    console.log("baz: " + val);
})

//bar: 3
//状态为"pending"
//foo: 1
//bar: 1
```

如上代码：

1. bar因为没有延迟，也没有依赖，所以先执行了；
2. bar虽然500ms后就可以执行，但因为依赖于bar，所以在等待foo执行，注意，此时其状态依然为pending，而不是resolved；
3. foo在1500ms后执行完毕；
4. bar发现foo执行完毕了，自己也可以执行，所以跟着执行了；