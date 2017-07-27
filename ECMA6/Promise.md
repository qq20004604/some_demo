<h2>Promise</h2>

<h3>1、是什么</h3>
<ol>
    <li>一个十分适合处理异步操作的对象</li>
    <li>有进行中(pending)、成功(resolved)、失败(rejected)三种状态</li>
    <li>可以轻松处理成功或失败的情况，代码结构更清爽，操作结果可预期</li>
    <li>对象的状态不受外界影响，只会根据预先设定的情况执行代码，方便从pending状态切换到resolved或者rejected</li>
    <li>Promise对象在创建后会立即执行，但他的then是异步的（即使状态立刻改变，也要等其他代码执行完毕后才会去执行）</li>
    <li>Promise对象的状态改变是一次性的，改变后值即确定。不会因为任何情况导致状态反复变化</li>
    <li>Promise的状态改变后，会立刻触发其回调函数（执行resolve或者reject）</li>
    <li>Promise对象foo可以作为另外一个Promise对象bar的值，并且在foo和bar的状态都不是pending后，才会执行bar的回调</li>
    <li>Promise对象的then的值是Promise对象，但和最初的Promise不是同一个</li>
    <li>then可以连写，方便连续异步函数的调用</li>
    <li>Promise.all可以轻松处理多个异步操作，在全部完成后才应执行的逻辑</li>
    <li>Promise.race可以轻松处理多个异步操作，但只需要最快的那个异步操作结果的情况</li>
    <li>Promise.resolve和Promise.reject可以轻松将一个变量转为Promise对象并使用</li>
</ol>

<h3>2、基本例子</h3>

Promise有几个特点：

1. new出来后立刻执行；
2. 只执行一次，并且结果发生后，无论之后几次调用then，都只执行那唯一一个结果（resolve或者reject）；
3. 如果处于pending中，那么执行then时，相当于添加到队列里，pending中不执行，但等结果出来后，会一起执行（而非只执行一个或者不执行）；
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

这当遇见这种情况的时候有一个特点，只有作为参数的Promise实例的状态从pending转变为resolved或者rejected时，另一个Promise实例的回调函数才会执行。

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
2. 在执行resolve或者reject时，他们的返回值，将被设置为新的Promise实例的值。

设置值的示例：

```
let foo = new Promise((res, rej) => {
    setTimeout(function () {
        res("foo");
    }, 1000)
})
foo.then(val => {
    console.log(val);   // 显示当前Promise的对象的值
    return "new value";   // 返回值将作为新的Promise实例的值
}).then(val => {
    console.log(val);   // 显示当前的值
})
// foo
// new value
```

值的变化：

1. Promise实例的初始值是undefined；
2. 在Promise实例的值被设置之后，他的值会保持不变；
3. 在执行resolve或者reject时，Promise的值就是执行回调函数时的参数的值；


在上面讨论两个Promise实例互动时，即将一个Promise实例作为值传递给了另外一个Promise的回调函数。

在这个传递过程中，Promise回调函数的实例的参数，就是Promise的值。

Promise作为返回值的示例：

```
let foo = new Promise((res, rej) => {
    setTimeout(function () {
        res("foo");
    }, 1000)
})
foo.then(function (v) {
    console.log(v);
    return new Promise((res, rej) => {    //这里相当于把Promise对象作为新的Promise对象（即第二个then的调用者）的值
        setTimeout(() => {
            //这里执行的是reject
            rej("Promise return value")
        }, 1000)
    });
}).then(undefined, (val) => {
    //因此then这里执行的也是reject，而不是resolve
    console.log(val);
})
//foo   第一个then的输出
//Promise return value     第二个then的输出
```

<h3>6、错误捕获catch</h3>

简单来说，当执行Promise内部的代码时，如果抛错，那么将执行then的第二个回调函数（reject）。

或者使用catch替代then，然后执行第一个回调函数。

如代码：

```
let foo = new Promise((res, rej) => {
    throw "This is a error"
})
foo.then(val => {
    console.log(val)    //不执行
}, err => {
    console.log(err)    //执行这行
})
foo.catch(err => {
    console.log(err)    //也执行这行
})
//This is a error
//This is a error
```

那么当抛出错误的时候，发生什么事情呢？

通过查看foo对象可以得知，当抛出错误后，foo这个Promise实例，会将``[[PromiseStatus]]``状态设置为``reject``（因此会执行reject回调函数），又会将``[[PromiseValue]]``的值设置为抛出的错误信息。

因此，会执行then的reject的方法，并且reject的值是抛出的错误信息

而因为``foo.catch(callback)`` 相当于 ``foo.then(null, reject)``，因此使用catch的时候相当于执行了then的reject回调函数，可以用来捕获错误信息。

**脑洞时刻**

1、假如抛出多个错误会发生什么事情呢？

哦，不会发生什么事情，后面的的抛错会被无视，如果抛错的后面有执行resolve或者reject，那么也会被无视（因为Promise的值只能被设置一次，设置之后就不可改变了）。

同样也因为这个原因，假如在抛错前就执行了resolve或者reject，那么抛错也会被无视。

2、catch里抛错呢？

由于then的返回值是一个新的Promise对象，因此catch里的抛错就会被新的Promise的reject所捕获，所以可以在catch后继续catch，从此子子孙孙无穷尽也。

<h3>7、全部完成才结束Promise.all</h3>

**场景**

我们在写ajax的时候，经常会面临这样一个场景：

我有三个ajax请求，但是需要等着三个ajax的请求结果都出来后再进行处理。

如果常见写法，我们需要在每个都执行完之后，依次判断一下其他的完成了没有，完成了才能继续，没完成就return。

但是使用``Promise.all``的话，问题简单多了。

>Promise.all(iterable);

**参数：**

一般是一个数组，也可以是一个有迭代器接口的对象，但要求每个成员都是Promise实例。

**返回值：**

是一个Promise对象，为了方便称之为foo。

返回值的状态将维持pending不变，直到当参数的每个Promise实例的状态从pending变化为resolved，或者rejected时。

**返回值Promise对象的变化规则：**

1、参数的所有Promise都执行resolve，那么结果：

1. foo的状态resolved；
2. foo的then执行resolve；
3. foo的值是一个数组；
4. 参数里的Promise对象的值按顺序（迭代器里的顺序，而非状态变化顺序）被放入到这个数组中，作为foo的值使用；

2、假如参数里的Promise对象有一个执行了reject，那么结果：

1. foo的状态rejected；
2. foo的then执行reject；
3. foo的值被执行了reject的那个Promise对象所决定；
4. foo的reject将在那个执行了reject的Promise对象执行后立刻执行（而不是等所有的都执行完毕）；

3、假如参数中的Promise对象有多个执行了reject，那么结果：

1. 同上一种情况的1、2和4
2. foo的值被第一个执行了reject的那个Promise对象所决定（后面的对其无影响）；

情况一示例代码：

```
function delay(msg, time, isRej) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            isRej ? rej(msg) : res(msg)
        }, time)
    })
}

let promiseArray = [delay("first", 500), delay("second", 3000), delay("third", 1000)];

let foo = Promise.all(promiseArray);
foo.then(msg => {
    console.log(msg)
}, err => {
    console.log(err)
})

// ["first", "second", "third"] //3秒后
```

情况三示例代码（情况二可以参考情况三的，基本是一样的）：

```
function delay(msg, time, isRej) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            isRej ? rej(msg) : res(msg)
        }, time)
    })
}

let promiseArray = [delay("first", 500), delay("second", 5500, true), delay("third", 1000, true)];

let foo = Promise.all(promiseArray);
foo.then(msg => {
    console.log(msg)
}, err => {
    console.log(err)
})

// third    //1秒后
```

另外由于Promise.all的返回值也是一个Promise实例，因此适用于Promise实例的方法，自然也适用于它。


**关于参数，更复杂的情况**

假如``Promise.all``的参数，不是一个单纯的``new Promise()``对象，而是``(new Promise()).then(() => {})``这样的，会发生什么事情呢？

首先，Promise.all执行哪个，不取决于第一个new Promise()里的状态，而是取决于``.then()``执行之后的状态。

原因在于，``(new Promise()).then(() => {})``这个表达式的值，是作为``Promise.all()``的参数的。

而这个表达式的值，取决于``.then()``的值，而这个值，和``new Promise()``并不是同一个Promise对象（参照本博客前几章）。

因此假如new Promise()执行了reject，而then里的reject执行了resolve，那么最终结果还是resolved，而不是rejected。

<h3>8、谁快用谁的Promise.race</h3>

> Promise.race(iterable);

**参数：**

同Promise.all，懒得解释了。

**返回值：**

也是一个Promise对象，为了方便称之为foo。

**返回值变化规律：**

简单来说，参数的所有Promise对象，哪个的状态最先变化，返回值foo就使用它的。

例如：

1. 参数里有三个Promise对象；
2. 他们状态变化所需要时间分别是2秒，1秒，3秒；
3. 他们的状态变化结果分别是resolved，resolved，rejected；
4. 他们的值分别为'A', 'B','C'；
5. Promise.race执行，等1秒后，第二个Promise对象的状态变为resolved；
6. 此时foo的状态立刻变为resolved，执行resolve，值为'B'；
7. 另外两个的状态变化将不能影响foo；

如示例代码：

```
function delay(msg) {
    let isFailed = Math.random() > 0.5;
    let time = parseInt(Math.random() * 1000);
    return new Promise((res, rej) => {
        setTimeout(() => {
            let data = {
                msg,
                time,
                state: 'isFailed? ' + isFailed
            }
            isFailed ? rej(data) : res(data)
        }, time)
    })
}

let promiseArray = [delay("first"), delay("second"), delay("third")];

let foo = Promise.race(promiseArray);
foo.then(data => {
    console.log(data.msg, data.time, data.state)
}, data => {
    console.log(data.msg, data.time, data.state)
})

// 因为是随机结果，所以下面是随机结果之一
// second 207 isFailed? true
```

**应用场景：**

比如说你请求一个东西，但不想等待时间太久，比如说超过3秒钟就停止请求报告请求失败。

那么就可以使用这个，然后写一个Promise对象，3秒后执行reject的那种，作为最后一个参数。

然后只要超时，就自动执行，然后就ok了。

如示例：

```
function preventTimeout(promise) {
    let timeout = new Promise((res, rej) => {
        setTimeout(() => {
            rej('超时了！')
        }, 3000)
    })
    return Promise.race([promise, timeout])
}

let foo = new Promise((res, rej) => {
    setTimeout(() => {
        res("foo")
    }, 4000);
})
let bar = preventTimeout(foo)
bar.then(null, val => {
    console.log(val)
})

// 超时了！ //3秒后
```

将需要进行超时检测的Promise对象，作为preventTimeout函数的参数，然后取用其返回值用于替代使用被检测的Promise对象。

<h3>9、Promise.resolve</h3>

>Promise.resolve(value);
>
>Promise.resolve(promise);
>
>Promise.resolve(thenable);

**参数与返回值：**

1. 参数是promise对象：返回值是参数，不做任何改变；
2. 参数是thenable：指是一个有then属性的对象，返回值是一个新建的Promise对象，相当于将then方法作为创建时的参数使用；
3. 参数是value：指不是以上两种情况，比如是一个字符串或者普通对象，返回一个状态是resolved的Promise对象，值是value

为了方便理解，``Promise.resolve``相当于以下代码：

```
function resolve(data) {
    // 当参数是Promise对象时
    if (Object.prototype.toString.call(data) === '[object Promise]') {
        return data;
    }
    // 当参数不是thenable时
    if (typeof data !== 'object' || typeof data.then !== 'function') {
        return new Promise(res => {
            res(data)
        })
    }
    // 当参数是thenable时
    return new Promise(data.then.bind(data))
}
```


**情况一：参数是Promise对象**

直接返回该Promise对象，不做任何操作

```
let foo = new Promise(res => res('foo'));
let bar = Promise.resolve(foo);
foo === bar;    //true
let baz = resolve(foo);
foo === baz;    //true
```

**情况三：参数是value**

```
let bar = new Promise(res => res("bar"))
bar.then(msg => console.log(msg))
let foo = Promise.resolve('foo')
foo.then(msg => console.log(msg))
let res = resolve('res')
res.then(msg => console.log(msg))
let baz = new Promise(res => res("baz"))
baz.then(msg => console.log(msg))
// bar
// foo
// res
// baz
```

**情况二：参数是thenable**

这个情况看起来，但细节比较多，理解起来会有点费劲。

首先，对象的then方法被作为一个新的Promise对象的参数使用；

其次，该方法的this被默认指向了对象本身。

> 如果在resolve里不将this通过bind绑定给data的话，那么在执行的时候，this会指向window。原因是new Promise的时候，会改变新建对象的this指向目标，而Promise对象的this指向的是window

第三，如果在then方法里，状态改变之前抛错，那么会触发reject回调函数，而不是resolve。原因跟new Promise的参数里抛错会执行reject是一个道理

第四，假如在then方法中，最终执行了第二个参数reject，而不是resolve，那么最终状态也会变为rejected。

示例代码：

```
let foo = {
    then(res, rej){
        res('123')
    }
}
Promise.resolve(foo).then(msg => console.log(msg))
resolve(foo).then(msg => console.log(msg))
// 123
// 123
```

**Promise.reject**

跟Promise.resolve没啥区别，除了在非thenable情况下，状态会默认变为rejected之外。

所以参考上面的Promise.reject即可。



<h3>10、</h3>
