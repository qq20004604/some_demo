#Proxy代理

##0、一句话总结

##1、是什么？

1. 用于修改对某个对象的操作的默认行为；
2. 绑定与指定对象；
3. 返回值和原对象不全等（原因是返回值在原对象外面套了一层壳，已经不是同一个玩意了）；
4. 但返回值终究操作的还是原对象，因此无论对哪个操作，修改的都是原对象的值；
5. 可以拦截对对象属性的读取、修改、遍历等；
6. 甚至对对象子属性的子属性也生效；
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

分析：

1. key永远是target的属性的属性名；
2. 即使读取的是子属性的子属性，key依然是子属性的属性名；
3. 

####2.2.2、设置

>set