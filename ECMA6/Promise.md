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

除此之外，还有几个特点：

1. 作为参数的Promise实例，他会将自己的参数的值传递给另一个Promise实例，即bar的resolve的参数是foo，而foo的resolve的参数的值是"1"，因此bar的resolve的参数的值是"1"；
2. 两个Promise实例要执行的必须都是resolve或者都是reject，不然不会互相影响；

<h3>4、回调函数返回值与then的返回值</h3>

<h4>4.1、 回调函数返回值</h4>

回调函数的返回值，指的是Promise实例的then的回调函数resolve和reject的返回值。

如代码：

```javascript
let foo = new Promise((resolve, reject) => {
    resolve("foo");
}).then(msg => {
    console.log(msg);
    msg += " return value";
    return msg;     //这一行代码即是返回值
})
```

<h4>4.2、 then的返回值</h4>

初期接触Promise的人可能不会注意到，Promise实例是一个Promise对象，而他的then方法在执行后的返回值也是一个Promise对象，但这两个对象是并不是同一个Promise对象。

如代码：

```javascript
let foo = new Promise((resolve, reject) => {});
let bar = foo.then();
console.log(foo === bar);    //false
```

并且更有意思的是，由于then方法在执行后的返回值是一个Promise对象，因此他也可以有一个then方法（即then的连写），但这个Promise对象也和之前的Promise对象不是同一个Promise对象。

如代码：

```
let foo = new Promise((resolve, reject) => {
});
let bar = foo.then();
console.log(foo === bar);    //false
let baz = bar.then();
console.log(foo === baz);    //false
console.log(bar === baz);    //false
```

<h4>4.3、 then连写的应用</h4>

**1、基本应用：**

then的连写的最基本的应用就是连写then，如以下代码：

```
new Promise((resolve, reject) => {
    setTimeout(_ => {
        reject("res");
    }, 1000)
}).then(resVal => {
    resVal += " barRes";
    console.log(resVal);
    return resVal;
}, rejVal => {
    console.log(rejVal);
    rejVal += " barRej";
    return rejVal;
}).then(resVal => {
    resVal += " bazRes";
    console.log(resVal);
    return resVal;
}, rejVal => {
    console.log(rejVal);
    rejVal += " bazRej";
    return rejVal;
});

//输出结果
res
res barRej bazRes
```

连写then的特点如下（对照上面代码查看）：

1. 第一个Promise实例将决定第一个then的回调函数执行哪一个；
2. 当返回值是不是Promise对象时，无论第一个then执行的是resolve或是reject，第二个，以及之后then只会执行resolve（从输出结果可以得知）；
3. 第二个及之后的then的resolve在执行回调函数时，其参数是前一个then的回调函数的返回值（例如resVal）；
4. 当返回的不是Promise对象时，后面的then显然会立即执行，而不是等待（即使你想使用setTimeout作为返回值也不行，因为setTimeout的值是他的计时器编号）（在setTimeout里面试图返回那就更不可行了）；

简单几个词总结一下：

1. 第一个then二选一；
2. 第二个then和以后执行第一个；
3. 回调函数返回值是下一个then的回调函数的参数。

**2、当返回值是Promise实例时：**

在上面，我们看到两个Promise实例交互时的情况，即一个Promise实例是另外一个Promise实例的参数。

这当遇见这种情况的时候有一个特点，只有作为参数的Promise实例的状态从pending转变为resolve或者reject时，另一个Promise实例的回调函数才会执行。

而当then的回调函数的返回值是Promise实例时，那么由于这个Promise实例会作为下个then的参数，因此下个then会等待这个返回值的Promise实例的状态从pending发生改变后，才会继续执行。

如代码：

```
let foo = new Promise(function (res, rej) {
    setTimeout(function () {
        res("foo");
    }, 1000)
})
foo.then(function (v) {
    console.log(v);
    return new Promise(function (res, rej) {
        setTimeout(function () {
            //这里执行的是reject
            rej("1")
        }, 1000)
    });
}).then(undefined, function (val) {
    //因此then这里执行的也是reject，而不是resolve
    console.log(val);
})
//foo   第一个then的输出，延迟1秒
//1     第二个then的输出，再延迟1秒
```

<h3>5、Promise的[[PromiseValue]]</h3>

Promise实例是有值的，但这个值不能直接获取，只能通过实例的回调函数的参数，或者通过控制台查看Promise实例时，通过``[[PromiseValue]]``得知。

得到Promise的值的方法有以下一种方法：

1. 通过Promise实例的then的回调函数resolve或者reject的参数获取；

设置Promise实例的值的方法有以下两种：

1. 在创建Promise实例时，在执行时向resolve或者reject传递参数，执行哪个回调函数，那么执行它时传递的值就是Promise实例的值；
2. 在执行resolve或者reject时，他们的返回值，将被设置为Promise实例的值。

值的变化：

1. Promise实例的初始值是undefined；
2. 在Promise实例的值被设置之后，他的值会保持不变；
3. 在执行resolve或者reject时，Promise的值就是执行回调函数时的参数的值；


在上面讨论两个Promise实例互动时，即将一个Promise实例作为值传递给了另外一个Promise的回调函数。

在这个传递过程中，Promise回调函数的实例的参数，就是Promise的值。

如