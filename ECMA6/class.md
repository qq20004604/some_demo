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

不得不遗憾的表示，目前来看，类似c++或者java里的那种私有方法和私有变量，在js里面还是实现不了的。

因此变通方法有三个：

**1、伪私有：**

下划线开头表示私有方法。如代码：

```
class Foo {
    _testPrivate() {
        
    }
}
```

这种私有方法是一种**约定俗称**的私有方法**命名方式**。

用下划线开头，表示告诉使用者，这些是私有方法，你最好不要改，改了有可能出错。但实际中，如果用户想要访问，还是可以访问到的。

**2、作用域改变：**

把私有方法移到类之外的同级作用域（或上级作用域中），当使用的时候，通过直接调用该方法，或者通过``fun.call(this, ..arg)``这样的方式调用。

由于该方法位于类的同级或上级作用域，因此类是可以访问到的；

而在使用类的实例的时候，便可能因为作用域的不同，无法调用该方法，因此达到私有方法的作用。

如代码：

```
function test() {
    let formatTime = function () {
        let date = this.date
        let hour = date.getHours()
        let min = date.getMinutes()
        let sec = date.getSeconds()
        let milliseconds = date.getMilliseconds()
        return `${hour}:${min}:${sec} ${milliseconds}ms`
    }
    class Foo {
        constructor() {
            this.date = new Date()
        }

        showCreateTime() {
            console.log(formatTime.call(this))
        }
    }
    this.getFoo = function () {
        return new Foo()
    }
}

let p = (new test()).getFoo()
p.showCreateTime()
setTimeout(function () {
    let q = (new test()).getFoo()
    q.showCreateTime()
}, 1000)
// 22:18:26 252ms
// 22:18:27 262ms
```

在外层作用域，显然是访问不到``formatTime``这个函数的，因此达成了私有函数的效果。

如果是模块的话，通过模块导出Foo这个类后，其他方法显然是无法访问到这个模块里的任何非被导出函数的。

**3、Symbol变量作为方法名**

关于Symbol的知识请复习这篇博客[Symbol简述](http://blog.csdn.net/qq20004604/article/details/72870576)。

简单来说，通过Symbol生成的变量，他是唯一的。换句话说，只要你用的不是我这个Symbol的变量，那么你自己怎么生成，都无法生成一个和我这个Symbol变量相等的变量。

```
Symbol() !== Symbol()	// true
```

除此之外，Symbol变量可以作为对象/类的key使用。

因此当我生成一个Symbol变量作为类的方法名，如果你访问不了我这个Symbol变量，那么你必定无法调用这个方法。

如代码：

```
function Foo() {
    const bar = Symbol()
    class Foo {
        [bar]() {
            console.log("this is private")
        }

        test() {
            this[bar]()
        }
    }
    return new Foo()
}

let p = new Foo()
p.test()
```

在以上代码中，你只能通过p.test()来间接调用``p[bar]``这个方法，但却不能直接通过p[bar]来调用这个方法。

因此，达成了私有方法的效果。

<h4>4.2、私有变量</h4>

简单来说，目前不支持私有变量写法，甚至不支持把变量写在和类的方法平级的地方。

有提案说可以用``#``放在变量名前，作为私有变量，但所谓提案，就是现在还不行，就是这样。

如果只是创建变量（而非私有变量），那么一个变相的解决办法是可以专门用一个方法，来初始化该变量。然后在constructor函数中调用他即可。

如代码：

```
class Foo {
    constructor() {
        this.createPrivateVarible()
    }

    createPrivateVarible() {
        this.a = 1
        this.b = "a"
    }
}
let p = new Foo()
console.log(p.a, p.b)   // 1 "a"
```

如果要创建私有变量，那么可以参照私有方法的办法。

```
function Foo() {
    const p = 1
    class Foo {
        test() {
            console.log(p)
        }
    }
    return new Foo()
}

let p = new Foo()
p.test()
```

<h3>5、this</h3>

<h4>5.1、默认情况</h4>

``this``可真是让人又爱又恨。

不过搞清楚this的话，可以避免很多错误，还可以提升自己对要学习内容的认识。

在class里，this默认情况下，指向的是当前实例

如代码：

```
class Foo {
    test() {
        return this
    }
}
let p = new Foo()
p.test() === p  // true
```

<h4>5.2、需要调用类的某个方法</h4>

由于类的实际实现，目前还是依靠原型链的。

因此，可以通过原型链来调用。

这个时候，this指向类的原型链（而不是类本身）；

如果没注意的话，可能会误解指向类本身（记住对象的方法的this指向对象本身就好了）。

如代码：

```
class Foo {
    test() {
        return this
    }
}
Foo.prototype.test() === Foo.prototype; // true
Foo.prototype.test() === Foo;	// false
```

<h4>5.3、单独提取类的方法</h4>

假如我们看上类的某个方法了，想要提取出来，那么这个时候this指向谁呢？

答案是undefined。

原因有二：

1. 当单独提取出类的方法时，他就是一个函数，而不是一个对象的方法了，因此this不再指向对象本身（对象的方法中的this，指向对象自己）；
2. 如果是一个函数，那么this应该指向window，然而由于类天生是严格模式，因此提取出来的函数也是严格模式的，而严格模式下函数的this，默认是undefined；

```
class Foo {
    test() {
        return this
    }
}
let {test} = Foo.prototype
test()  // undefined

function bar() {
    "use strict"
    return this
}
bar()   // undefined
```

与此同理的，是提取类的实例的方法，效果是一样的。

<h4>5.4、改变this指向</h4>

当知道提取出来的类的方法，this指向的是谁后，如果想改变this指向，那么方法很多啦。

比如什么``Fn.call``、``Fn.apply``、``Fn.bind``之类之类的。

<h4>5.5、默认this指向类的实例</h4>

如果你需要该类的方法，默认指向类的实例，有两种比较常见的解决办法：

1. 参照5.4中的，在提取出来之后，通过bind来绑定。这个办法的好处在于无需修改原来的类。
2. 假如可以修改原本的类，那么也可以用一个绑定过this的函数，位于原型链更靠近实例的地方，用于替换未被绑定this的函数；

第二种方法，具体来说，是这样实现的。

1、由于类的方法，是挂在类的原型链上的（例如Foo.prototype.test）这样；

2、因此当通过new生成实例后，该方法实际上是在实例的``__proto__``属性上（例如``bar.__proto__.test``）这样；

3、那么假如我直接在实例的属性上挂载一个绑定后的test方法（例如``bar.test``），那么在获取test方法的时候，会优先获取``bar.test``，而不是``bar.__proto__.test``。

4、而这个获取的``bar.test``是绑定了this，让this指向类的实例的；

如示例代码：

```
class Foo {
	// 在构造函数中，给实例添加一个绑定了this的test方法
    constructor() {
        this.test = this.test.bind(this)
    }

    test() {
        return this
    }
}
let bar = new Foo()
bar;    // Foo {test: ƒ}

let {test} = bar
test() === bar; //true，可以证明test返回的this就是bar本身
```

除了上面两个常规方法之外，还有两个方法：

1、利用Proxy，在获取函数的时候，自动绑定this。

但有几个问题：

1. 	Proxy在一般情况下，使用的比较少，若只是为了这个简单的要求使用Proxy，是把事情复杂化了，必要性不大；
2. Babel的转换也是一件麻烦的事情。

所以不推荐使用。

2、箭头函数。

箭头函数的原理，是通过一个特性：

**箭头函数的this，指向其定义时的作用域，而不是箭头函数在使用时的作用域**

只要记住这个特性，那么在理解下面这段代码的时候，就非常容易了：

```
class Foo {
    constructor() {
        this.test = () => {
            return this
        }
    }

    test() {
        return this
    }
}
let bar = new Foo()
bar;    // Foo {test: ƒ}

let {test} = bar
test() === bar; //true
```

顺便出一道关于【箭头函数】的题，猜猜下面这段代码的输出结果是什么？

```
let a = 1;
function Foo() {
    let a = 2;
    this.logA = () => {
        console.log(++a)
    }
}
let p = new Foo()
p.logA();    // 输出？
let {logA} = p
logA();  // 输出？
```
