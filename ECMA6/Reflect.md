<h2>Reflect</h2>

<h3>1、是什么？</h3>


<ol>
    <li>window的原生对象，但不能通过new来生成实例；</li>
    <li>对对象的属性的操作，都可以通过这个来完成（读、写、定义属性等）；</li>
    <li>返回值更加合理（失败返回false而不是抛错）；</li>
    <li>函数式调用（而非属性式）</li>
    <li>在使用Proxy时，使用本方法效果比直接通过对象属性调用效果更好</li>
</ol>


<h3>2、如何使用（几种常见方法示例）</h3>

<h4>2.1、读</h4>

>Reflect.get(target, propertyKey[, receiver])

拦截对target对象的propertyKey属性的读取，返回这个属性的值。

1. 参数一是被访问的对象；
2. 参数二是属性名；
3. 参数三当遇见getter时，将getter的this指向他

参数一和参数二好理解，如代码：

```
let target = {
    _test: 1,
    get test() {
        return this._test;
    }
};

Reflect.get(target, "_test");   //1
Reflect.get(target, "test");    //1
```

参数三比较特殊，当遇见getter时，getter的this将指向他。下面代码可以很好的体现这一点：

```
let receiver = {_test: 2}
let target = {
    _test: 1,
    get test() {
        console.log(this === target, this === receiver);
        return this._test;
    }
};

Reflect.get(target, "test", receiver);
// false true
// 2

target.test;
// true false
// 1
```

通过Reflect.get调用时（且有第三个参数），this指向参数三；<br>
当通过target.test调用时，this指向对象本身；

<h4>2.2、写</h4>

>Reflect.set(target, propertyKey, value[, receiver])

如果理解``Reflect.get``了，那么理解``Reflect.set``自然也很简单了。

1. 参数一是目标对象；
2. 参数二是属性名；
3. 参数三是要设置的值；
4. 参数四是遇见setter时，this指向的目标；
5. 返回值是是否设置成功，成功则为true，报错为false；

如代码：

```
let receiver = {_test: 2};
let target = {
    _test: 1,
    get test() {
        return this._test;
    },
    set test(val) {
        this._test = val;
    }
};

Reflect.set(target, "test", "a");   //true
target.test;    //"a"

//修改setter的this指向目标
Reflect.set(target, "test", "b", receiver);   //true
target.test;    //"a"
receiver._test; //"b"

//修改被禁止修改的属性
Object.defineProperty(target, "test", {
    value: 1
});
Reflect.set(target, "test", "a");   //false
target.test;    //1
```

<h3>3、观察者模式</h3>

观察者模式是结合了Proxy代理以及Reflect实现的，重点是Proxy。

我这里对阮一峰给的示例代码略有修改，并添加注释，以示使用方法：

```
//存储观察者函数，用数组也可以
const queuedObservers = new Set();
// const queuedObservers = [];

//定义observe函数，执行本函数会将观察者函数添加到queuedObservers中，返回的是观察者函数的列表
const observe = fn => queuedObservers.add(fn);
// const observe = fn => queuedObservers.push(fn);

//定义observable函数，将该对象添加代理后返回proxy实例
const observable = obj => new Proxy(obj, {set});

//handler，执行时会调用观察者里函数里的每个观察者
function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    queuedObservers.forEach(observer => observer(key, value));
    return result;
}

//对对象进行代理绑定
const person = observable({
    name: '张三',
    age: 20
});

//定义2个函数
function printKey(key, value) {
    console.log("key: " + key)
}
function printValue(key, value) {
    console.log("value: " + value)
}

//将函数设置为观察者函数
observe(printKey);
observe(printValue);

//调用person（proxy实例）的属性name
person.name = '李四';
//输出
//key: name
//value: 李四

//创建另外一个被观察的对象（空）
const foo = observable({});
//给他添加一个属性（触发set），因此会触发所有添加到观察者里的函数
foo.fruit = "梨";
//输出
//key: fruit
//value: 梨
```

简单来说：

1. 可以创建一个函数用于进行proxy绑定（observable）；
2. 并且创建一个观察者列表，用于添加你的观察者函数（列表queuedObservers，添加函数observe）；
3. 因为是proxy，所以你还需要一个handler，并且假定你handler里的set会执行所有观察者函数；
4. 然后所有被绑定过的函数，在使用它的返回值时（即proxy实例），你设置对象属性就会触发handler的set，而set就会执行所有观察者函数；
5. 于是有了上面示例代码发生的情况；

再附用set和get有限改写后，实现的对已有属性的观察（对新增属性无影响）：

```javascript
//存储观察者函数，用数组也可以
const queuedObservers = [];

//定义observe函数，执行本函数会将观察者函数添加到queuedObservers中，返回的是观察者函数的列表
const observe = fn => queuedObservers.push(fn);

//定义observable函数，将该对象添加代理后返回proxy实例
const observable = function (obj) {
    //todo write your code here
    Object.keys(obj).forEach(function (item) {
        obj["_" + item] = obj[item];
        Object.defineProperty(obj, item, {
            get(){
                return obj["_" + item];
            },
            set(val){
                queuedObservers.forEach(observer => observer(item, val));
                obj["_" + item] = val;
            },
            configurable: true,
            enumerable: true
        })
    })
    return obj;
}

//对对象进行代理绑定
const person = observable({
    name: '张三',
    age: 20
});

//定义2个函数
function printKey(key, value) {
    console.log("key: " + key)
}
function printValue(key, value) {
    console.log("value: " + value)
}

//将函数设置为观察者函数
observe(printKey);
observe(printValue);

//调用person（proxy实例）的属性name
person.name = '李四';
//输出
//key: name
//value: 李四
```