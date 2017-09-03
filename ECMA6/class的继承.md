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

