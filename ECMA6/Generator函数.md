<h3>0、一句话总结</h3>


<h3>1、Generator基本概念</h3>

注：【遍历器】和【迭代器】是一个意思。

<h4>1.1、表象：</h4>

1. 函数名有个星号（就是乘号*）；
2. 函数体内部使用yield表达式（yield翻译成中文：产生）；
3. 函数调用后返回值是一个遍历器对象，该对象可以调用next方法遍历yield表达式返回的值；
4. 函数内部可有返回值，也可以没有（这个影响的是遍历器遍历到第一次done为true时，value的值是什么）；
5. 函数执行后并不直接执行函数内部代码，而是返回一个遍历器（参考上一章Iterator），但注意，他本身并没有``[Symbol.iterator]``属性

简单来理解，就是当函数名前面有星号时，调用函数的时候不会运行该函数，而是返回一个遍历器，该遍历器通过调用next方法可以遍历执行函数内部的语句，每次执行到yield表达式（或执行到函数结束）为止；

如示例代码：

```
function* foo() {   // 星号在function关键词和函数名之间
    yield 'first';  // yield表达式表示会被遍历到的内容
    let second = 'sec'; // 函数内部可以有正常的js语句
    yield second + 'ond';   // yield表达式只关心该表达式的返回值（即"second"字符串）
    return 'last'   // 可以有return返回值也可以没有
}

foo[Symbol.iterator];    // undefined，说明没有这个属性

let bar = foo();
// bar:
// {[[GeneratorStatus]]: "suspended"}
// 原型链上有next、return、throw三个方法

bar.next(); // {value: "first", done: false}
bar.next(); // {value: "second", done: false}
bar.next(); // {value: "last", done: true}  如果没有return，那么这里的value是undefined
bar;    // {[[GeneratorStatus]]: "closed"}  出现done之后才会closed
```

<h4>1.2、运行：</h4>

<b>函数本身的运行：</b>

1. Generator函数可以视为一个状态机；
2. 简单来说，就是内部可能有A、B、C状态，初始是空状态，然后通过多次调用next方法，依次切换到A、B、C状态；
3. 当之后没有其他状态时，调用next方法返回的对象的done属性的值为true；

<br>
这三句话可能比较抽象，可以结合下面代码的执行来理解：

<b>代码的执行：</b>

1. 直接调用本函数，并不会执行函数内部的代码，而是返回一个遍历器；
2. 此时什么都不执行，直到调用该遍历器的next方法为止；
3. 第一次调用next时，从函数内部第一行开始执行，直到遇见yield表达式为止，输出yield表达式的值（即yield所在的那一段js语句的返回值）；
4. 第二次调用next时，从上一次yield表达式停止的地方开始继续执行，直到再次遇见yield表达式，或者到函数的结尾，或遇见return后停止；
5. 注意，是执行到yield表达式为止，而不是yield所在的那一行代码，典型情况是：``console.log(yield "test");``其中的console.log是不执行的；
6. 每次执行next()后，返回值的是一个对象，有value属性和done属性，参考Iterator，其中value的值是yield表达式的值；
7. 当结束到结尾时，或者遇见return时，done会变为true，在此之前，done为false；
8. done变为true，没必要继续调用next了（就像Iterator接口那样）；

<br>
首先，当然是上示例代码啦：

```
function* foo() {
    let a = 1;
    console.log('第一次执行')
    yield a;
    a++;
    console.log(yield "test");
    a *= 2;
    return a
}

// 调用foo()
let bar = foo();
// 此时没有输出任何东西，bar的值

// 第一次调用next()，下面的两行注释，其中第一行是console.log，第二行是返回值****
bar.next();
// 第一次执行
// {value: 1, done: false}

// 第二次调用next()，注意，这个时候没执行yield "test"外面的console.log
bar.next();
// {value: "test", done: false}

// 第三次调用next()，这个时候执行了console.log()，但显然由于yield之前已经执行了，所以参数是空
// 遇见return了，所以done变为true，value的值是return的返回值
bar.next();
// undefined
// {value: 4, done: true}
```

看注释，就懂代码怎么执行的了。

另外提一句，每次通过foo()生成的遍历器，都是独立的，他们之间不会互相影响。


<h4>1.3、yield关键字</h4>

首先，yield在非Generator函数内不是关键字，只有在Generator函数内才是关键字，可以通过赋值，然后不会报错来证明。

因此，不要试图在非Generator函数内部的场合使用yield，肯定会报错的啦。

```
let yield = 1;
console.log(yield);   //1
```

<h4>1.4、yield表达式的值</h4>

yield表达式起到的是暂停函数执行的作用，**该表达式的值是下一次调用next()时作为参数传入的值，默认情况下是undefined**。

原因在于，每次执行到yield表达式时就会终止，等到下次执行的时候，相当于yield表达式所在的地方为空（上次执行过了，所以这次不会再执行一遍），所以值undefined。

那么怎么让yield表达式有值呢？答案是通过遍历器的next()方法的参数来传入。该参数将作为上一个yield表达式的值来使用；


```
function bar(val) {
    console.log(val, arguments.length)
}

function* foo() {
    console.log('Hello ' + (yield 123));
    bar(yield 456)
}

let test = foo();

test.next();
// {value: 123, done: false}

test.next();
// Hello undefined
// {value: 456, done: false}

test.next('input');
// input 1
// {value: undefined, done: true}
```

另外提一句，由于第一次调用next()时，之前是没有yield表达式的，所以如果想在初始化的时候就输入值，需要进行特殊化处理，比如外面包一层，或者放弃第一次next输入参数，空调用一次next()来实现（这个也是外面包一层的实现原理）

如示例代码（引自阮一峰的）：

```
// 包一层
function wrapper(generatorFunction) {
  return function (...args) {
    let generatorObject = generatorFunction(...args);
    generatorObject.next();
    return generatorObject;
  };
}

const wrapped = wrapper(function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
});

wrapped().next('hello!')
// First input: hello!
// {value: "DONE", done: true}
```

```
// 空调用一次next()
function* dataConsumer() {
    console.log(`1. ${yield}`);
    console.log(`2. ${yield}`);
    return 'result';
}

let genObj = dataConsumer();
genObj.next();
genObj.next('a')
// 1. a
genObj.next('b')
// 2. b
```

最后，yield表达式如果单独使用，那么不需要括号，如果要将yield表达式与其他变量进行运算，那么需要使用圆括号将其括起来（如上面的示例）；


<h4>1.5、Generator的简写</h4>

普通函数作为对象属性的时候可以简写，Generator函数作为对象属性的时候，虽然多了一个星号，但也可以简写，简写方法是将星号放在属性名前即可

如代码：

```
let foo = {
    * [Symbol.iterator]() {
        // some code
        
    }
}
```

<h3>2、基本应用</h3>

<h4>2.1、解构赋值</h4>

数组是可以通过Iterator接口进行解构赋值的，对象不行是因为对象没有这个接口，那么假如我们给对象补上这个接口，对象自然也可以了。

而Generator函数显然是Iterator的完美搭配（因为他能返回一个遍历器），将Generator函数作为对象的``[Symbol.iterator]``属性即可。

如代码：

```
let foo = {
    a: '1',
    b: '2',
    * [Symbol.iterator]() {
        for (let i in this) {
            yield this[i]
        }
    }
}
let bar = [...foo]
bar;    // ['1', '2']
```

<h4>2.2、可以通过for...of来遍历</h4>

Generator函数返回的是一个遍历器，而for...of可以遍历遍历器，所以显然for...of也可以遍历Generator函数的返回值（注意：**是返回值**）

如代码：

```
function* foo() {
    yield 1;
    yield 2;
    return 3
}

for (let i of foo()) {
    console.log(i)
}
// 1
// 2
```

但注意：**通过 ``return`` 返回的值**，并不会被遍历到（如上面的结果是没有3的）。

另外，解构赋值等，也会忽视return返回的值。

<h3>3、throw和return</h3>

<h4>3.1、throw</h4>


> gen.throw(exception)

throw方法在Generator的原型链上。

throw和next相对来说，比较特殊，他具备以下特点：

1. 和next一样，是通过迭代器来执行的；
2. 和next一样，从上一次yield表达式所在的地方开始执行代码；
3. 但区别在于，next会继续执行下一句代码，而throw相当于在开始执行下一句代码之前，立刻先执行了一个``throw err``，err就是throw的参数（建议err使用``new Error(err)``的形式）；
4. 当抛错时，根据其上一次yield表达式是否在``try...catch``捕获的作用于内，分为两种情况：
<br>4.1 假如不在其中，无法捕获到报错，那么throw语句没有返回值，代码停止继续运行。下次执行next()时，返回值变为``{value: undefined， done: true}``
<br>4.2 假如在其中，可以捕获到报错，那么立刻进入``catch``代码块，然后继续正常执行到下一个yield表达式的位置，并且该yield表达式的值将成为throw语句的返回值（就像执行了``next()``语句一样）
5. 由于4.2的情况很正常，所以不做讨论。假如遇见4.1的情况，那么错误还将被抛到Generator函数外，遍历器执行throw()的地方，就像在遍历器执行throw的地方执行了一次``throw err``一样。假如此时该错误没有被``try...catch``所捕获，那么将解释器按照抛错处理（比如说继续停止之后的代码）

简单来说，相当于在执行了一次next()，并且在Generator函数内开始执行应执行的代码之前，抛错。如果错误没有被捕获，内部执行抛错处理，并且该错误会冒泡到执行throw()的地方，并且按照正常出错的情况来处理。

请结合代码理解：

```

    try {
        yield;
        // 由于抛错，下面这个console.log不会被执行
        console.log('上一个yield表达式之后，同在try里的代码块。因为throw所以不会执行这里')
    } catch (e) {
        // 因为throw，所以错误被捕获到了
        console.log('内部捕获', e);
    }
    console.log('内部在catch捕获后的代码块，这里会在catch后继续执行')
    yield '第二个yield，成为foo的值'
    console.log("第二个yield之后，也会继续执行")
    yield '第三个yield，成为bar的值'
};

var i = g();
// 过渡到第一个yield表达式的位置（此时在try...catch语句内）
i.next();

let foo;
let foo2;
try {
    foo = i.throw('a');
    // foo2 = i.throw('a');
    // 如果解除注释，这个抛错将被"外部捕获"捕捉到
    // foo2的值是undefined
} catch (e) {
    console.log('外部捕获', e);
    // 如果没有这个try...catch捕捉错误，那么代码将报错（停止继续执行）
}
// 内部捕获 a
// 外部捕获 b
let bar = i.next()
console.log(foo)    // {value: "第二个yield，成为foo的值", done: false}
console.log(bar)    // {value: "第三个yield，成为bar的值", done: false}
```

另外，i.throw()和throw的区别在于，后者只会影响到外部，而前者先影响到Generator内部，未处理的话才会冒泡到外部。

简单总结一下：

1. 遍历器的throw方法可以将错误传入Generator函数内部；
2. Generator函数内部可以通过try...catch来捕获错误，如果没有被捕获，将冒泡到Generator函数外面来；
3. 如果在Generator函数内部正常捕获了错误，那么代码将继续执行下去；
4. 如果没有捕获到错误，遍历器的done将变为true；
5. 可以用于调试Generator函数内部错误捕获；

<h4>3.2、return</h4>

>gen.return(value)

返回值是``{value: value, done: true}``，value是传入的值。

同样是在Generator的原型链上。

简单来说，相当于立即结束了Generator函数（除了当时yield在``try...finally``代码块以内的情况）。

如代码：

```
let g = function*() {
    console.log("Before 1")
    yield 1;
    console.log("Before 2")
    yield 2;
    console.log("Before 3")
    yield 3;
};
let foo = g();

foo.next();
// Before 1、
// {value: 1, done: false}

foo.return('input');
// {value: "input", done: true}

foo.next();
// {value: undefined, done: true}
```

1. 在第一次执行完next后，停留在``yield 1``；
2. 然而当执行return后，并没有继续执行到``yield 2``，而是立刻跳到函数结束，并且返回的对象的done为true；
3. 可说明Generator函数已经遍历完毕了（虽然是被终止的）；
4. 从之后调用foo.next()的返回值也可以得到证明；
5. 需要特别注意的是：return并非是跳转到Generator函数的结尾来实现done变为true的，而是直接停止了Generator函数。这点可以通过下面的``try...finally``来证明。

**finally和return**

当return遇见``try...finally``时，如果当前的yield在try的代码块内，那么将直接跳到finally代码块内，执行finally代码。

等finally里的代码执行完毕后，才会立刻结束Generator函数，并将return的参数作为return的返回值对象的value属性的值。

有一点比较特殊：

1. 假如finally里有yield表达式，那么return并不会造成Generator函数的结束，而是在遇见yield表达式后停止（就像正常那样）；
2. 可以通过继续调用next往下执行，直到离开finally代码块为止；
3. 离开finally代码块后不会继续执行，而是立即结束Generator函数

```
let g = function*() {
    console.log("Before 1")
    try {
        yield 1;
        console.log("Before 2")
        yield 2;
    } finally {
        console.log('finally')
        yield 4;
    }
    console.log("last")
    yield 5;
};
let foo = g();

foo.next();
// Before 1
// {value: 1, done: false}

foo.return('input');
// finally
// {value: 4, done: false}

foo.next();
// {value: "input", done: true}
```

简单来说，return用于终结Generator函数。


<h3>4、yield*表达式</h3>

<h4>4.1、基础</h4>

简单来说，yield*表达式就是在一个Generator函数内嵌套另外一个Generator函数。

于是在遍历的过程中，当在第一个Generator函数内遇见第二个Generator函数后，就会先停止遍历第一个Generator函数，先遍历完第二个Generator函数，然后再恢复。

如代码：

```
let g1 = function*() {
    yield 1;
    yield* g2();
    yield 2;
}
let g2 = function*() {
    yield "a";
    yield "b";
}
let foo = g1();
for (let i of foo) {
    console.log(i)
}
// 1
// a
// b
// 2
```

如上，简单暴力通俗易懂。

假如不是``yield* g2()``，而是``yield g2()``会发生什么事情呢？

1. 首先，g2()会返回一个遍历器对象，毫无疑问；
2. 其次，yield表达式会使得该遍历器对象作为next的返回值来返回；
3. 因此最终结果是1——》g2()的遍历器——》2，代码就略了不写

<h4>4.2、递归</h4>

因为yield*表达式的存在，因此遍历器可以递归自己，代码十分简单：

```
let g1 = function*(count) {
    console.log("count:" + count)
    if (count > 3) {
        return
    }
    yield 1;
    yield 2;
    yield* g1(count + 1);
}
let foo = g1(1);
for (let i of foo) {
    console.log(i)
}
// count:1
// 1
// 2
// count:2
// 1
// 2
// count:3
// 1
// 2
// count:4
```

<h4>4.3、有Iterator接口的数据结构</h4>

yield*表达式可以遍历Generator函数，原因是Generator函数有Iterator接口，相当于对Generator函数的遍历器执行了``for...of``；

那么yield*表达式能不能遍历非Generator函数，但是也有Iterator接口的数据结构呢？显然也是可以的。

如代码：

```
let g1 = function*() {
    yield* [1, 2]
    yield* "ab"
}
let foo = g1();
for (let i of foo) {
    console.log(i)
}
// 1
// 2
// "a"
// "b"
```

也可以对自定义数据结构生效，只要他有Iterator接口即可：

```
function Test() {
    let arr = [3, 2, 1]

    function Iterator() {
        let index = 0
        // 该对象有next方法，调用后返回一个当前索引下的值
        this.next = function () {
            let obj = {}
            if (index < 3) {
                obj.value = arr[index]
                obj.done = false
                index++
            } else {
                obj.value = undefined
                obj.done = true
            }
            return obj
        }
        // 返回他自己
        return this
    }

    // 遍历器接口
    this[Symbol.iterator] = function () {
        // 创建一个遍历器对象（Iterator不是关键词）
        let temp = new Iterator()
        // 返回他
        return temp
    }
}
let m = new Test()

let g1 = function*() {
    yield* m
}
let foo = g1();
for (let i of foo) {
    console.log(i)
}
// 3
// 2
// 1
```

<h4>4.4、返回值</h4>

1. Generator函数是返回值是他的遍历器；
2. 遍历器的返回值是对象，有value和done属性；
3. yield表达式的返回值是根据遍历器的next的参数决定；
4. 那么yield*表达式的返回值是什么呢？

答案是根据被遍历函数的return所决定；

最简单的示例如代码：

```
let g1 = function*() {
    console.log(yield* g2())
}

let g2 = function*() {
    yield 'a';
    return 'b';
}
let foo = g1();
for (let i of foo) {
    console.log(i)
}
// 'a'
// 'b'
```

那么，是否还记得Generator函数的返回值在什么时候起作用？

可以回去看看1.1，return是在done第一次变为true时，value属性的值。

因此，yield*的值，取决于遍历器在遍历结束，done变为true时，value属性的值，如以下代码自定义了一个数据结构，这个数据结构在done变为true时是有值的。

```
function G() {
    let arr = [3, 2, 1]

    function Iterator() {
        let index = 0
        this.next = function () {
            let obj = {}
            if (index < 3) {
                obj.value = arr[index]
                obj.done = false
                index++
            } else {
                // 这里与之前的例子不同
                obj.value = '自定义数据结构的done变为true了'
                obj.done = true
            }
            return obj
        }
    }
    this[Symbol.iterator] = function () {
        let temp = new Iterator()
        // 返回他
        return temp
    }

}
let g = new G()

let g1 = function*() {
    console.log(yield* g)
}
let foo = g1();
for (let i of foo) {
    console.log(i)
}
// 3
// 2
// 1
// "自定义数据结构的done变为true了"
```

<h3>5、简写与this</h3>

<h4>5.1、简写</h4>

Generator函数的写法有三种（除了第一种名字都自己捏的）：

1. 声明式；
2. 赋值式；
3. 属性式；

其中，属性式除了常规写法外，还有简写版（就像当函数作为对象属性时的简写一样）。

如代码，一目了然：

```
// 声明式
function *g1() {
    yield 'g1'
}

// 赋值式
let g2 = function*() {
    yield 'g2'
}

// 属性式
let foo = {
    g3: function*() {
        yield 'g3'
    },
    // 简写的属性式
    *g4(){
        yield 'g4'
    }
}

for (let i of g1()) {
    console.log(i)
}
// g1
for (let i of g2()) {
    console.log(i)
}
// g2
for (let i of foo.g3()) {
    console.log(i)
}
// g3
for (let i of foo.g4()) {
    console.log(i)
}
// g4
```

<h4>5.2、this</h4>

Generator函数的this指向谁呢？

答案是window，如代码：

```
function *g1() {
    console.log(this)
    yield 'g1'
}

let foo = g1()
foo.next()
// Window
// {value: "g1", done: false}
```

由于Generator函数不能通过new来生成遍历器（会报错），因此显然通过这条路来改变this的指向显然是走不通的。

那么如何改变Generator的this指向的目标呢？

答案很简单：

1. apply或者call；
2. bind

使用bind的示例如下：

```
function *g1() {
    console.log(this)
    yield 'g1'
}

g1 = g1.bind("g1")
let foo = g1()
foo.next()
// 'g1'
// {value: "g1", done: false}
```

call的示例：

```
function *g1() {
    console.log(this)
    yield 'g1'
}

let foo = g1.call("g1")
foo.next()
// 'g1'
// {value: "g1", done: false}
```

**遍历器调用更多的方法**

遍历器通常只能调用next、throw、return。

假如想调用更多的呢？

简单解决办法是通过原型链来完成，示例如下：

```
function *g() {
    yield 'g1'
}
g.prototype.getDate = function () {
    return new Date()
}
let foo = g()
foo.getDate()
// Tue Aug 22 2017 00:06:26 GMT+0800 (CST)
```

**在遍历器里调用更多方法并且能操作this**

简单来说，就是假如我遍历器想要添加count和add两个方法，分别是获取当前计数和对计数增加。

如果分别是独立的，那么很简单，通过上面来完成即可。

但假如需要操作Generator函数内部的变量呢？由于Generator函数不能通过new来生成实例，因此要复杂一些。

具体思路是让Generator函数的this，指向他本身的prototype原型链，于是当调用this的时候，自然相当于this指向了原型链，可以调用原型链上的属性。

如代码：

```
function Foo() {
    function *g() {
        yield 'g1'
    }

    g.prototype.number = 0;
    g.prototype.count = function () {
        return this.number
    }
    g.prototype.add = function (val) {
        this.number += val;
        return this.number;
    }
    let foo = g.call(g.prototype)
    return foo;
}
let bar = new Foo();
```
另外：

1. new Foo与直接Foo()没什么区别，都是返回一个新的Generator遍历器；
2. 虽然不能通过new g()来生成，但实质上，通过g()生成的遍历器对象，他们原型链上的number的状态，并不共享（独立的，互不干扰）；

