<h3>1、class继承概述</h3>

<h4>1.1、所谓继承</h4>

继承这个概念还需要解释么？好吧，我解释一下：

简单粗暴的解释继承，就是指：

1. 我定义一个类A，他自带一些方法；
2. 然后我定义一个类B，他有一些方法是独特的，但他还有一些方法是类A已有的，那么如果让类B再重复定义这些类A已有的方法，显然是低效的写法；
3. 这种让类B可以使用类A的方法的做法，就是继承；
4. 传统解决办法是创建一个类A的实例，然后让类B指向这个创建的实例，从而利用原型链来实现；
5. 而class相对传统方法来说，更简单，他的写法类似c++中的继承，利用关键字``extends``来实现。

以上继承中，类A就是父类，类B就是子类。

<h4>1.2、class的继承</h4>

> 子类 extends 父类 {子类的方法}

继承的语法如上，关键字是``extends``（记得有s）代码如下：

```
class Foo {
    logFoo() {
        console.log("foo")
    }
}

class Bar extends Foo {
    logBar() {
        console.log("bar")
    }
}
let p = new Bar()
p.logBar()  // "bar"
p.logFoo()  // "foo"
```

<h4>1.3、继承与构造函数</h4>

class在继承时，子类的构造函数``constructor``可写可不写。

假如子类有自己的构造函数的话，那么必须在子类构造函数里执行``super()``函数，并且需要在调用this之前，不然会报错。

> super( 传给父类构造函数的参数 )

```
class Foo {
    constructor(a) {
        console.log(a)
    }
}

class Bar extends Foo {
    constructor(b) {
        console.log(b)
        super(b + 1)
    }
}

let p = new Bar(1)
// 1
// 2
```

输出内容里：

1. ``1`` 是创建Bar的实例时，作为参数传给Bar的构造函数的；
2. ``2`` 是通过super传给Foo的构造函数的参数；

另外，如果要在构造函数里使用this，那么必须先调用``super()``

```
class Foo {
}

class Bar extends Foo {
    constructor() {
        // this.a = 1  这里会报错
        super()
        this.a = 1  // 在使用this之前，必须先调用super来调用父类的构造函数
    }
}
```

至于为什么，贴一段引自[阮一峰的解释](http://es6.ruanyifeng.com/#docs/class-extends#简介)

>ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。<br>
ES6 的继承机制完全不同，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。

简单来说，就是es5先子类后父类，es6先父类后子类。

<h4>1.4、父类和子类的关系</h4>

首先，我们需要分析一下类的方法和类本身的关系。

因为class目前的实现是依靠原型链的，是原型链的一个语法糖，因此class的方法都可以在原型链上找到。

```
class Foo {
    foo() {
    }
}
typeof Foo.prototype.foo    // "function"
```

说明类的方法是在他的原型链（prototype）上的。

其次，当子类继承父类的时候，父类位于原型链上的什么位置呢？我们可以通过代码测试得知

```
class Foo {
    foo() {
    }
}

class Bar extends Foo {
    bar() {
    }
}

Bar.__proto__ === Foo;  // true
Bar.__proto__.prototype === Foo.prototype;    //true
Bar.prototype.__proto__ === Foo.prototype;  // true
```

前两个表达式解释了类的**静态方法**：

1. 类Bar的\_\_proto\_\_属性指向类Foo，因此当类Foo有静态方法时，Bar可以直接调用（靠``__proto__``）；
2. 所以自然``Bar.__proto__.prototype === Foo.prototype``了；

<br>

但第三个表达式如何解释，子类在继承父类是如何实现的？

1. 而我们知道，当构造函数通过new来生成实例时，构造函数的``prototype``属性将被自动转为``__proto__``作为实例的原型链（只有对象在执行方法时，会顺着``__proto__``去找对象本身没有的方法）；
2. 而从上面类和方法的示例里，我们可以知道类的方法位于类的``prototype``属性上；
3. 因此如果要实现继承，那么父类的方法必然位于子类的``prototype``上（不然子类的实例找不到父类的方法）；
4. 但是，显然父类的方法，不能直接挂载在子类的``prototype``属性上，虽然在实际使用时，只要控制子类方法后写入该属性即可（后写入会覆盖先写入的）；
5. 但这样明显不是原型链继承的风格（不是链式继承）。
6. 那么如何让子类的实例可以调用父类的方法呢，答案很简单，对象在调用方法时，如果找不到对应的方法，那么会沿着``__proto__``属性一直往上找。
7. 因此只需要把父类``prototype``属性挂在子类的``prototype.__proto__``上即可（即实例的``__proto__.__proto__``上）；

因此可以推导出第三个表达式。

更多的在下面分析。


<h3>2、获取class的父类</h3>

>Object.setPrototypeOf(obj, prototype)<br>
Object.getPrototypeOf(object)

效果：

1. 设置当前对象的原型链； 
2. 获取当前对象的原型链；

简单来说，用我们通常的理解：

1. 第一个相当于``foo.__proto__ = bar``；
2. 第二个相当于``foo.__proto__``；

之所以有这两个方法的原因，在于``__proto__``属性并非是标准的方法，而是浏览器厂商都这么干，于是相当于约定俗成的做法，但实质上来说，并不是标准做法，所以不是最好的。

于是，我们也可以通过这个方法来获取原型链，或者证明类A是不是类B的父类

```
class Foo {
    foo() {
    }
}

class Bar extends Foo {
    bar() {
    }
}
Object.getPrototypeOf(Bar) === Foo  // true
```

但这个方法也有一个缺点，只能获取到直接父类，如果是父类的父类（祖先），那便无法获得

如代码：

```
class Foo {
    foo() {
    }
}

class Bar extends Foo {
    bar() {
    }
}

class Baz extends Bar {

}

Object.getPrototypeOf(Baz) === Bar  // true
Object.getPrototypeOf(Baz) === Foo  // false
Object.getPrototypeOf(Object.getPrototypeOf(Baz)) === Foo   // true
```

---

既然能获取到类的原型链，那么能不能通过 ``Object.setPrototypeOf(obj, prototype)`` 来设置原型链，替代``extends``这种方式来继承呢？

答案是否定的。先根据class的继承链上代码：

```
class Foo {
    constructor() {
        console.log('Foo constructor')
    }
    foo() {
        console.log('foo')
    }
}

class Bar {
    constructor() {
        console.log('Bar constructor')
    }

    bar() {
        console.log('bar')
    }
}

Object.setPrototypeOf(Bar, Foo)
Object.setPrototypeOf(Bar.prototype, Foo.prototype)
let p = new Bar()
// Bar constructor
p.foo() // foo
p.bar() // bar
```

虽然从表面看，Bar的实例既可以调Bar的方法，也可以调Foo的方法，看似很正常。

但是在new Bar()这一步。只调用了Bar的构造函数，并没有调用Foo的构造函数。

虽然看似在Bar的constructor函数里，以下表达式的值是true

```
this.__proto__.__proto__.constructor === Foo    // true
```

但是Foo的构造函数是没办法直接调用执行的

```
this.__proto__.__proto__.constructor    // Uncaught TypeError: Class constructor Foo cannot be invoked without 'new'
```

因此，就算设法实现，但过程也是十分麻烦的，并且不合标准的class使用方法。不予考虑。

<h3>3、class继承普通构造函数</h3>

<h4>3.1、传统构造函数与class</h4>

在【2】中提过，class不通过extends关键字来继承另外一个class是十分麻烦的事情。因此我们应该使用extends来继承class。

但是若假如我们现有一个普通的构造函数，他有一些直接挂载在类本身的方法，也有一些挂载在``prototype``上的方法，还有一个构造函数。

如以下代码，是一个标准的传统构造函数：

```
function Foo() {
    console.log('Foo constructor')
}
Foo.staticFoo = function () {
    console.log("static foo")
}
Foo.prototype.foo = function () {
    console.log('foo')
}
```

如果用class来实现这个构造函数，就是：

```
class Foo {
    constructor() {
        console.log('Foo constructor')
    }

    foo() {
        console.log('foo')
    }

    static staticFoo() {
        console.log("static foo")
    }
}
```

<h4>3.2、class的继承</h4>

如果我现在根据需要，想要继承父类Foo，假如是父类是用class声明的，那么很简单，方法如下：

```
class Bar extends Foo {
    constructor() {
        super()
        console.log('Bar constructor')
    }

    bar() {
        console.log('bar')
    }
}
let p = new Bar()
// Foo constructor
// Bar constructor
p.foo() // foo
p.bar() // bar  
Bar.staticFoo() // static foo
p.staticFoo()   // Uncaught TypeError: p.staticFoo is not a function
```

通过关键字``super()``来调用父类的构造函数（先别管super是什么，下面说）。

<h4>3.3、传统构造函数的继承</h4>

那么如果是一个普通构造函数（我们第一次列出来的那个），Bar该如何继承他呢？

两种方法：

1、extends关键字继承法：

很简单，就像继承普通class那样继承就行了。如代码：

```
function Foo() {
    console.log('Foo constructor')
}
Foo.staticFoo = function () {
    console.log("static foo")
}
Foo.prototype.foo = function () {
    console.log('foo')
}

class Bar extends Foo {
    constructor() {
        super()
        console.log('Bar constructor')
    }

    bar() {
        console.log('bar')
    }
}

let p = new Bar()
// Foo constructor
// Bar constructor
p.foo() // foo
p.bar() // bar
Bar.staticFoo() // static foo
p.staticFoo()   // Uncaught TypeError: p.staticFoo is not a function
```

---

2、但假如，我头很铁，就是不想用``extends``关键字，怎么办？

当然也是可以的，核心在于以下两行等式：

```
Bar.__proto__ === Foo;  // true
Bar.prototype.__proto__ === Foo.prototype;  // true
```

即父类本身成为子类的原型（第一行等式），以及子类原型链的原型，指向父类的原型链（第二行等式）

这是两条原型链。

因此在class继承普通构造函数的时候，也需要做出这两条原型链，除此之外，还要调用原方法的构造函数。

如代码：

```
function Foo() {
    console.log('Foo constructor')
}
Foo.staticFoo = function () {
    console.log("static foo")
}
Foo.prototype.foo = function () {
    console.log('foo')
}

class Bar {
    constructor() {
    	 // 核心：构造函数
        Foo.prototype.constructor.call(this)
        console.log('Bar constructor')
    }

    bar() {
        console.log('bar')
    }
}
// 核心：两条原型链
Bar.__proto__ = Foo
Bar.prototype.__proto__ = Foo.prototype

let p = new Bar()
// Foo constructor
// Bar constructor
p.foo() // foo
p.bar() // bar
Bar.staticFoo() // static foo
p.staticFoo()   // Uncaught TypeError: p.staticFoo is not a function
```

因此便能很好的完成继承的效果了。

<h3>4、super关键字</h3>

<h4>4.1、作为函数时使用</h4>

当super作为函数时使用，非常简单。

1. 只允许在子类的构造函数中调用；
2. 并且需要在调用this之前调用；
3. 而且必须调用一次（除非你省略掉子类的构造函数）；

如果不符合以上要求，那么就会报错，以下是标准写法

```
class Foo {
}

class Bar extends Foo {
    constructor() {
        super()
    }
}
```

<h4>4.2、作为对象使用</h4>

当super关键字作为对象使用时，有几点比较特殊：

1、首先，必须放在类的函数里使用；<br>
2、并且不能只使用super，不然**在声明的时候**就会报错；

原因是不知道你是把super是当做函数使用，还是当做对象使用。

```
class Foo {
    logFoo() {
        super;  // Uncaught SyntaxError: 'super' keyword unexpected here
    }
}
```

3、因此必须通过``super.xx``这种方式来调用；

```
class Foo {
    logFoo() {
        return super.abc;
    }
}
(new Foo()).logFoo()    // undefined
```

4、super在作为对象使用时，又分为两种情况：

4.1、当位于类的普通方法时，指向父类的prototype属性（但由于不能单独调用super，因此这个无法直接通过等式来验证）。

变相验证方式如下：

```
class Foo {
    logFoo() {
        console.log("Foo.log")
    }

    static staticFoo() {
        console.log("Foo.static")
    }
}
class Bar extends Foo {
    logBar() {
        console.log('Bar.log')
    }

    static staticBar() {
        console.log("Bar.static")
    }

    runSuper(key) {
        try {
            super[key]()
        } catch (err) {
            console.log("ERROR: " + err)
        }
    }
}
let bar = new Bar()
bar.runSuper('logFoo')  // Foo.log
bar.runSuper('staticFoo')  // ERROR: TypeError: (intermediate value)[key] is not a function
bar.runSuper('logBar')  // ERROR: TypeError: (intermediate value)[key] is not a function
bar.runSuper('staticBar')   // ERROR: TypeError: (intermediate value)[key] is not a function
```

以上代码表示，除了Foo本身上的方法之外，无论是Foo的静态方法，或者是Bar的普通/静态方法，都不存在。

因此可以变相说明super关键字在作为对象时，直接指向父类的prototype属性。

大约是（之所以说大约，是跟浏览器实现有关，我没具体看标准）：

```
super === Foo.prototype
```

4.2、当位于类的静态方法中时，指向父类。

和上面类似，验证代码如下：

```
class Foo {
    logFoo() {
        console.log("Foo.log")
    }

    static staticFoo() {
        console.log("Foo.static")
    }
}
class Bar extends Foo {
    logBar() {
        console.log('Bar.log')
    }

    static staticBar() {
        console.log("Bar.static")
    }

    static runSuper(key) {
        try {
            super[key]()
        } catch (err) {
            console.log("ERROR: " + err)
        }
    }
}

Bar.runSuper('logFoo')  // ERROR: TypeError: (intermediate value)[key] is not a function
Bar.runSuper('staticFoo')  // Foo.static
Bar.runSuper('logBar')  // ERROR: TypeError: (intermediate value)[key] is not a function
Bar.runSuper('staticBar')   // ERROR: TypeError: (intermediate value)[key] is not a function
```

会发现只能调用到父类的静态方法。而只能调用到父类静态方法的对象，只有父类本身。

因此大约是以下（之所以说大约，是跟浏览器实现有关，我没具体看标准）：

```
super === Foo
```

5、那么剩下最后一个问题，当通过super调用父类的方法时，this指向谁？

5.1、作为类的普通方法时，this指向子类的实例

```
class Foo {
    foo() {
        return this
    }
}
class Bar extends Foo {
    runSuper(key) {
        return super[key]()
    }
}

let p = new Bar()
p.runSuper('foo') === p   // true
```

如代码，this指向子类的实例。

不过想想也正常，假如不指向子类的实例的话，那么通过this调用的一些子类的方法、变量等，那么是会报错的。

这也是es6的规定。

5.2、作为静态方法时，this指向子类

```
class Foo {
    static staticFoo() {
        return this
    }
}
class Bar extends Foo {
    static runSuper(key) {
        return super[key]()
    }
}

Bar.runSuper('staticFoo') === Bar  // true
```

<h3>5、extends关键字</h3>

我们在上面讨论子类继承不同父类的时候，提到extends关键字。

并且在继承一个普通的构造函数时，也可以通过extends关键字来继承。

那么，可以通过extends关键字继承其他类型么？

答案当然是可以的，但仅限于部分。

<h4>5.1、继承Object对象；</h4>

```
class Bar extends Object {
}
```

讲道理说，继承这个，效果就是让``Bar.__proto__ === Object``，因此可以让Bar调用Object的原生方法。

可以算是对Object对象的扩展吧，如果对哪些方法不满意，可以写在Bar上，不影响Object对象本身。

但由于Object.prototype属性上没有什么特殊的东西，因此这样继承，一般没必要使用子类的实例（因为子类实例本身无法调用Object的方法）

<h4>5.2、继承Funtion</h4>

在分析这个之前，先分析一波普通函数的继承。在分析普通函数的继承之前，分析一波Function这个内置对象的原型和原型链。

<b>前注：</b>称``prototype``是原型，``__proto__``是原型链

如代码和注释：

```
// Function的原型链指向Function的原型
Function.__proto__ === Function.prototype   // true
// Function原型的原型链，指向Object的原型
Function.prototype.__proto__ === Object.prototype   // true
```

以上说明Function继承于Object的原型

然后分析class的继承，如代码和注释：

```
class Foo {
}
// 说明类的原型链指向Function的原型链，相当于类Foo的构造函数就是Function
Foo.__proto__ === Function.prototype    // true
Foo.__proto__ === Function.__proto__    // true
Object.prototype.toString.call(Foo)     // "[object Function]"
Foo.constructor === Function    // true

// 但类Foo的原型显然指向他自己的原型链（是一个对象），所以以下是false
Foo.prototype === Function.prototype    // false
// 因为Foo.prototype是对象，所以对象的原型链向对象的原型
Foo.prototype.__proto__ === Object.prototype
```

从以上结论可以得出，Foo是Function的实例（而非Function本身）

而假如类继承Function对象的话，是一个标准的继承，代码如下：

```
class Bar extends Function {
}
// 原型链指向对象本身
Bar.__proto__ === Function  // true
// 原型的原型链指向函数的原型
Bar.prototype.__proto__ === Function.prototype  //true
```

分析：

1、因为Bar的原型链指向Function，因此Bar可以调用Function上的方法，也可以调用Function原型链上的方法（不继承的时候也可以调用原型链上的方法）；

2、因为Bar的原型的原型链指向Function的原型，因此Bar的实例的原型链的原型链指向Function的原型。

3、所以当类继承Function的时候，最大不同之处在于，<b>类的实例可以调用被继承对象的原型链上的方法</b>，放在这里就是可以使用Function原型链上的方法（比如apply或者call），而正常是不行的

```
let p = new Bar()
p.apply === Function.apply		// true
```

