#Proxy代理

##0、一句话总结

##1、是什么？

1. 用于修改对某个对象的属性的操作的默认行为；
2. 绑定与指定对象；
3. 返回值和原对象不全等（原因是返回值在原对象外面套了一层壳，已经不是同一个玩意了）；
4. 但返回值终究操作的还是原对象，因此无论对哪个操作，修改的都是原对象的值；
5. 可以拦截对对象属性的读取、修改、遍历等；
6. 由于是对对象的属性生效，而访问对象的子属性的子属性时，需要先访问子属性，因此当操作对象子属性的子属性也生效；
7. 对之后新增的属性也生效；


##2、创建Proxy

###2.1、原型

>var p = new Proxy(target, handler);

**参数一target：**

目标对象，即拦截目标，可以是原生对象或者内置对象（比如是Object或者其他）；

**参数二handler：**

拦截配置，是一个对象。

你对参数一拦截哪些属性，拦截后的操作如何，都是在这里配置的；

**返回值p：**

返回绑定后的对象。需要注意，p和target并不相等。对返回值p进行的操作，会触发handler中自定义的方法。


###2.2、示例

####2.2.1、读取
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
3. 参数三就是Proxy对象（即target加上Proxy的壳后返回的那个对象，也可以说是get的调用者）
4. 如果对象的属性是不可写的话（writable为false），那么get的返回值需要和原值保持一致，否则会报错。

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

####2.2.2、写入

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

