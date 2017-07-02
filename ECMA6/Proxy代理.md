#Proxy代理

<h3>1、是什么？</h3>

1. 用于修改对某个对象的属性的操作的默认行为；
2. 绑定与指定对象；
3. 返回值和原对象不全等（原因是返回值在原对象外面套了一层壳，已经不是同一个玩意了）；
4. 但返回值终究操作的还是原对象，因此无论对哪个操作，修改的都是原对象的值；
5. 可以拦截对对象属性的读取、修改、遍历等；
6. 是对对象的属性生效，而访问对象的子属性的子属性时，需要先访问子属性，因此当操作对象子属性的子属性也生效；
7. 同样因为只对子属性生效，因此Proxy在操作对象属性时，并非是递归的（只在被代理对象的子属性这层生效一次，更深层的属性不生效）；
8. 对之后新增的属性也生效；


<h3>2、创建Proxy</h3>

<h3>2.1、原型</h3>

>var p = new Proxy(target, handler);

**参数一target：**

目标对象，即拦截目标，可以是原生对象或者内置对象（比如是Object或者其他）；

**参数二handler：**

拦截配置，是一个对象。

你对参数一拦截哪些属性，拦截后的操作如何，都是在这里配置的；

**返回值p：**

返回绑定后的对象。需要注意，p和target并不相等。对返回值p进行的操作，会触发handler中自定义的方法。


<h3>2.2、示例</h3>

<h4>2.2.1、读取</h4>
>get(target, propKey, receiver)

原型示例：

```
var p = new Proxy(target, {
  get: function(target, property, receiver) {
      return target[property];    //关键是这一步
  }
});
```

**效果：**

拦截对属性的读取，是一个函数。

1. 参数一是对象，即你绑定的那个对象；
2. 参数二是当前修改的key，例如对 ``foo``进行绑定后，你读取 ``foo.a``，这个key就是``a``。但假如 ``foo.a`` 是一个对象，你修改 ``foo.a.b`` 的值，这个key也是a；
3. 参数三就是Proxy对象（即target加上Proxy的壳后返回的那个对象，也可以说是get的调用者）。
4. 如果对象的属性是不可写的话（writable为false），那么get的返回值需要和原值保持一致，否则会报错。
5. 当返回值是Reflect.get时，且目标属性是getter，这个参数是否传给Reflect.get，结果会不一样。具体来说，将参数三作为Reflect.get的参数三使用，遇见getter在取子属性时，会触发代理，而若没有，则不触发代理。（原因请见下一篇Reflect的博客，跟this有关）。

示例代码：
```
var foo = {};
var bar = new Proxy(foo, {
    get: function (target, key, receiver) {
        console.log("This is get! The key: " + key);
        console.log(receiver === bar, foo === target);
        return target[key];
    }
});
bar.a = 1;
console.log(bar.a);
//This is get! The key: a
//true true
//1

bar.b = {c: "d"};
console.log(bar.b.c);
//This is get! The key: b
//true true
//"d"
```

解析：

1. key永远是target的属性的属性名；
2. 即使读取的是子属性的子属性，key依然是子属性的属性名，因为需要先读取子属性，才能访问子属性的子属性；
3. 返回的``target[key]``并非是最后取的值，而是对象foo属性为key的值，例如bar.b.c的返回值就是 ``{c: "d"}`` 。
4. 当取值时，如果取的是b.c.d，那么实际上是先读取b.c的值，这个时候触发Proxy的get方法，然后对返回值再取其d的值；
5. 可以借鉴getter的写法；
6. 和getter的区别在于，getter属性本身是不存值的，需要通过其他属性来存值。而通过Proxy代理，值是存在原属性上，代理只是控制读，不影响原值。

<h4>2.2.2、写入</h4>

>set(target, property, value, receiver)

原型实例：

```
let foo = {};
let bar = new Proxy(foo, {
    set(target, key, value, proxy){
        if (key === 'a') {
            console.log(foo === target);
            console.log(key, value);
        }
        target.lastModify = {
            key, value
        }
        target[key] = value;
    }
})
bar.a = 1;
console.log(bar.a);
console.log(bar.lastModify);
//true
//"a" 1
//1
//{key:"a", value:"1"}

bar.b = 10;
console.log(bar.b);
console.log(bar.lastModify);
//10
//{key:"b", value:"10"}
```

解析：

1. 比get多一个参数（value参数，被赋值的值），
2. 依旧是对对象的子属性进行操作；


**另外：**

引自MDN：

>set方法应该返回一个布尔值，返回true代表此次设置属性成功了，如果返回false且设置属性操作发生在严格模式下，那么会抛出一个TypeError;

注意，是否抛错只取决于两点：

1. 严格模式；
2. 返回值false；

即使你实际设置成功了，但是返回值依然是false且在严格模式下，那么也是会抛错的；

因此需要注意，如果不需要特殊设置的话，那么固定返回true即可（无返回值会导致严格模式下抛错），这个不影响因为writable为false导致的抛错。

<h4>2.2.3、其他示例</h4>

略略略，看阮一峰的吧。

[链接](http://es6.ruanyifeng.com/#docs/proxy#Proxy-实例的方法)

<h3>3、可撤销的Proxy代理</h3>

可撤销的Proxy代理和普通代理在使用上没有什么区别，唯一区别就是可以移除这个代理。

>Proxy.revocable(target, handler);

参数一与参数二，和new Proxy的两个参数是一样的。

返回值是一个对象，他有两个属性，一个是``proxy``，就是Proxy的实例，另外一个是``revoke``，类型是函数，用于移除这个代理。

如示例：

```
let target = {};
let handler = {
    get(target, key){
        console.log(key);
        return target[key];
    }
};

let obj = Proxy.revocable(target, handler);
console.log(obj);   //{proxy: Proxy, revoke: function}

obj.proxy.foo = 123;
console.log(obj.proxy.foo); // 123

obj.revoke();
console.log(obj.proxy.foo); // TypeError: Revoked
```

>Proxy.revocable的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

<h3>4、this</h3>

当被代理后，Proxy对象的this指向的目标，和一般常见情况下this指向的目标略有不同。

主要体现在两个方面：

1. handler对象里，代理方法中的this指向的目标依然指向的是handler本身，而不是proxy实例或者原对象；
2. 原对象中的this，在通过proxy实例调用时，指向的是proxy实例，而非原对象；

特别是第二点，在原对象里有通过this对对象本身进行操作时，其结果就可能和预期的情况不同。

示例代码：

```
let target = {
    m(){
        console.log(this === pro);
    }
};
let handler = {
    get(target, key){
        console.log(this === handler);
        return target[key];
    }
};

let pro = new Proxy(target, handler);
pro.m();
//true
//true
```

不过要因为第二点而发生问题，其实条件也比较特殊。

因为虽然this指向proxy实例，但是你终究操作的是属性，如果你只是单纯的通过this来调用属性，那么在经过proxy代理后，依然会操作原属性。

但假如你的某个操作，必须严格基于原对象生效，那么就会出现这样的问题。如果交互逻辑比较复杂，也可能遇见这样的问题。

如以下代码：

```
//区分当前是通过代理还是非代理来访问的属性
let target = {
    isTarget(){
        if (this === target) {
            console.log("true");
        } else {
            console.log("false");
        }
    }
}
const proxy = new Proxy(target, {});
target.isTarget();  //true
proxy.isTarget();   //false
```

<h3>5、兼容性</h3>

Proxy虽好，但是兼容性是一个很大的问题，IE

附兼容性链接：

http://caniuse.mojijs.com/Home/Html/item/key/proxy/index.html

另外，似乎babel对其的转码支持也很弱，见链接：

https://kangax.github.io/compat-table/es6/#test-Proxy,_internal_'get'_calls


<h3>6、如何更好的使用Proxy</h3>

这里有一篇写的很好的博客，我这里附上链接：

[6种ES6 Proxy的使用案例](http://www.zcfy.cc/article/6-compelling-use-cases-for-es6-proxies-888.html)
