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

