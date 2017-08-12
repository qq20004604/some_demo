<h3>0、一句话总结</h3>


<h3>1、Generator基本概念</h3>

<b>表象：</b>

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

<b>运行：</b>

函数本身的运行：

1. Generator函数可以视为一个状态机；
2. 简单来说，就是内部可能有A、B、C状态，初始是空状态，然后通过多次调用next方法，依次切换到A、B、C状态；
3. 当之后没有其他状态时，调用next方法返回的对象的done属性的值为true；

<br>
这三句话可能比较抽象，可以结合下面代码的执行来理解：

代码的执行：

1. 直接调用本函数，并不会执行函数内部的代码，而是返回一个遍历器；
2. 此时什么都不执行，直到调用该遍历器的next方法为止；
3. 第一次调用next时，从函数内部第一行开始执行，直到遇见yield表达式为止，输出yield表达式的值（即yield关键字所在的那一段js语句的返回值）；
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

