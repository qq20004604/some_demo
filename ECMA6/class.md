<h3>1、概念</h3>

<h4>1.1、前注</h4>

如果对c++之类语言比较熟悉的话，上手class的难度会很低，比上手原型链的难度低不少。

目前来看，class的实现，依然是通过构造函数和原型链来实现的（相当于是一个语法糖，至少目前是这样的），而在Babel转码之后，也是通过构造函数和原型链来做到的。

这里对于较为简单的内容，不会费太多笔墨，如果某些地方不太明白，可以看[阮一峰的博文](http://es6.ruanyifeng.com/class.md#docs/class)。

<h4>1.2、基本形态</h4>

为了帮助理解，写一个构造函数版，和一个class版进行对比。

```
function Foo() {
    this.count = 0
}
Foo.prototype.add = function () {
    this.count++
}
let m = new Foo()
```

```
class Foo {
    constructor() {
        this.count = 0
    }

    add() {
        this.count++
    }
}
let m = new Foo()
```

二者的效果是一致的。

<h4>1.3、一些需要注意的地方</h4>

1、class的关键字是全部小写；

```
class Foo
```

2、class在定义的时候，每个属性都需要是函数，而不能是变量（如add）；

```
class Foo {
	count:0 	// error！报错！
}
```

3、如果需要创建变量，那么应放在constructor函数（构造函数）里声明）；

```
constructor() {
    this.count = 0
}
```

4、构造函数里可以执行其本身的方法（例如上面的add()），通过``this.add()``这样来调用；

```
constructor() {
    this.count = 0
    this.add()
}
```

5、this指向class本身，在new出来之后，是实例本身；

```
// this当然指向自己啦
```

6、class声明的类，不能直接调用，例如``Foo()``这样是会报错的，只能通过new关键字来生成实例，如``new Foo()``；

```
Foo();	//Uncaught TypeError: Class constructor Foo cannot be invoked without 'new'
```

7、类的不同方法之间，不应用逗号来分隔，如果有，则会报错；

```
constructor() {
    this.count = 0
}				// 这里没有逗号

add() {
    this.count++
}
```

8、constructor就相当于类的构造函数，在new出来的实例的时候会被调用一次；

```
// 感觉这句话是废话
```

9、类有prototype属性，而constructor挂在在prototype属性下，并且类的constructor属性指向类本身；

```
Foo.prototype.constructor === Foo		//true
```

<h4>1.4、不可枚举</h4>

es5给属性加了三个特性，分别是：writable、enumerable、configurable。表示能否可写，能否枚举，能否可设置。

class声明的方法，默认是可写、不可枚举、可设置的

``Object.getOwnPropertyDescriptors()``方法可以获取对象的三个属性的值。

```
Object.getOwnPropertyDescriptors(Foo.prototype);
// add: {writable: true, enumerable: false, configurable: true, value: ƒ}
// constructor: {writable: true, enumerable: false, configurable: true, value: ƒ}
```

而class new出来的实例，三个属性都为true

```
Object.getOwnPropertyDescriptors(new Foo())
// count: {value: 0, writable: true, enumerable: true, configurable: true}
```

相对而言，通过原型链声明的方法，或者通过构造函数声明的方法，他们当然是可以枚举的啦。

<table>
    <tr>
        <td>版本</td>
        <td>声明的方法是否可枚举</td>
    </tr>
    <tr>
        <td>es6之前版本</td>
        <td>可枚举</td>
    </tr>
    <tr>
        <td>class声明的方法</td>
        <td>不可枚举</td>
    </tr>
</table>

<h4>1.5、使用表达式作为属性名</h4>

class的方法名可以直接使用表达式

```
let name = 'abc'
class Foo {
    [name]() {
        console.log('abc')
    }
}
let m = new Foo()
m.abc()
// abc
```

<h4>1.6、严格模式</h4>

class的类和模块是严格模式，自带的。

例如
```
class Foo {
    constructor() {
        a = 1
    }
}
new Foo()
// Uncaught ReferenceError: a is not defined
```

对未声明的变量直接赋值，于是报错了。

<h4>1.7、constructor</h4>

constructor函数是class的构造函数，如果没有就会自己加一个空的。

因为是构造函数，所以会被自动执行。

如果constructor没有返回值，那么默认返回的是创造出来的实例本身。

如果constructor有返回值，那么该返回值只能是对象或者undefined。<br>
1、当是undefined时，当做无返回值来处理；<br>
2、当是对象时，那么返回值就是这个对象，而不是class的实例；

```
class Foo {
    constructor() {
        return {}
    }

    test() {
        console.log('test')
    }
}
let p = new Foo()
p.test; // undefined
```

话说应该不会有人无聊的在constructor里返回一个其他对象吧……

当new Foo的时候，传的参数，会被作为constructor的参数。

```
class Foo {
    constructor(...args) {
        console.log(...args)
    }
}
new Foo(1, 2, 3)    //1 2 3
```

<h3>2、实例和原型链上的属性</h3>

<h4>2.1、不同的位置</h4>

在constructor函数里，通过this.foo这种方式声明的变量，在创建出实例后，属于实例的属性。

而在class上声明的属性（各种函数），在创建实例后，位于实例的原型链上（实例的__proto__属性的属性）

```
class Foo {
    constructor() {
        this.a = 1;
    }

    test() {

    }
}
let p = new Foo()
Object.keys(p); // ["a"]
p;	// {a: 1}
p.__proto__;	// {constructor: class Foo, test: ƒ test()}
```

<h4>2.2、通过原型链，给类添加新的方法</h4>

假如我声明了一个Foo类，现在又想给Foo类添加一个新的方法怎么办？

通过原型链来实现即可，如果熟悉原型链，一看就明白

```
class Foo {
    constructor() {
        this.a = 1;
    }

    getA() {
        return this.a
    }
}
Foo.prototype.log = function () {
    console.log(this.a)
}
let p = new Foo()
p.getA();   // 1
p.log();    // 1
```


<h3>3、一些细节</h3>

<h4>3.1、class表达式</h4>

之前都是声明式写法。

当然还有，表达式写法（赋值式）：

标准写法如下：

```
let Foo = class {
    constructor() {
        console.log("Foo")
    }
}
new Foo()   // "Foo"
```

class后面也可以跟类名，但该类名仅限于该class内使用

```
let Bar = class bar1 {  //这个bar1只能在class里面用
    constructor() {
        console.log(bar1.name)
    }
}
Bar.prototype.log = function () {
    console.log(bar1.name)  //在这里用会报错
}
let p = new Bar()   //bar1
bar1;   // Uncaught ReferenceError: bar1 is not defined
p.log();    // Uncaught ReferenceError: bar1 is not defined
```

<h4>3.2、变量提升（不存在）</h4>

普通函数作为构造函数的时候，如果是声明式，那么是可以变量提升的（因为是函数）

只有赋值式（函数表达式）之类的，才是不行的。

```
new Bar()   // "1"
function Bar() {
    console.log('1')
}
```

但是class无论哪种都不行。

```
new Foo()   //Uncaught ReferenceError: Foo is not defined
class Foo {
    constructor() {
        console.log("Foo")
    }
}
```

原因是继承的时候，肯定要先声明父类，子类再通过继承父类来生成实例。

如果存在变量提升，那么假如父类不是class，那么子类被提升到作用域顶部，但继承的时候会发现父类还没有声明，岂不是尴尬。


<h3>4、私有</h3>

<h4>4.1、私有方法</h4>

