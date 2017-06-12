#let

解释：

    1. 简单来说，就是类似var，但使用该方法声明的变量，只在当前作用域生效；

几个特点：

**1、let和var相比，不存在变量提升（即先使用后声明会报错）；**

```javascript
{
    console.log(a);    //Uncaught ReferenceError: a is not defined
    let a = 1;
}
```


**2、使用let声明的变量，当前作用域里，该变量唯一。**

即，假如在当前作用于的父级作用域里声明一个var a，在当前作用域里也声明一个let a，那么在当前作用域里，只有let声明的a生效，也就是说，以下代码是不可行的：

```javascript
var a = 1;
{
    console.log(a);    //Uncaught ReferenceError: a is not defined
    let a = 2;
}
```

但若将let a改为var a，那么console.log的结果就是1了（采用父级作用域的变量的值）；
```javascript
var a = 1;
{
    console.log(a);    //1
    var a = 2;
}
```       


**3、同一级作用域里面，只允许对一个变量使用一个let来进行声明。**

具体来说，2个var a是正常的，剩下的2个let a或者先let a后var a又或者先var a再let a是统统都是报错的。
```javascript
{
    var a = 1;
    var a = 2;    //ok
}
```
```javascript
{
    var a = 1;    //Uncaught SyntaxError: Identifier 'a' has already been declared
    let a = 2;
}
```
```javascript
{
    let a = 1;
    let a = 2;    //Uncaught SyntaxError: Identifier 'a' has already been declared
}
```
```javascript
{
    let a = 1;
    var a = 2;    //Uncaught SyntaxError: Identifier 'a' has already been declared
}
```

**4、但是不同级作用域里，是没有影响的，比如分别在父级作用域和当前作用域里声明let a各一次，是没问题的。**

另外，外层和内层作用域都声明了一个同样的变量名时，内层作用域该变量的值的修改，对外层作用域的值是没有影响的。
```javascript
{
    let a = 1;
    {
        let a = 2;    //can do it
    }
    console.log(a);  //1
}
```
但若内层不适用let声明，而是直接调用a = 2进行修改，那么是有影响的
```javascript
{
    let a = 1;
    {
        a = 2;    //1 to 2
    }
    console.log(a);  //2
}
```

**5、let的限制情况**

不是十分确认，是实践后的结果。（部分因为条件不足，没法调试）

1. 在某些时候，let不能作为html标签的onclick事件的函数变量名的声明方式；
2. 比如onclick=start，然后只能var start，不能let start；
3. 用addEventListener也会发生这种问题；
4. 有时候给对象赋值的时候，也会发生这种问题；
5. 最奇怪的是，以上类似情况不是必然发生的，但是同一种情况会一直发生；
6. 发生在ios手机端的safari浏览器下（chrome下正常）；
7. 有时候let需要在"use strict"条件下才能使用（严格模式），我在写nodejs的服务器端遇见过这种问题；

---

#块级作用域

**1、let相当于新增了块级作用域。**

简单来说，以前只有全局作用域和函数作用域，例如以下是函数作用域的体现：
```javascript
(function () {
    var a = 1;
})();
console.log(a);    //Uncaught SyntaxError: Unexpected identifier
```
而在使用var时，是不存在块级作用域的，即如下代码视为同一个作用域内，所以console.log可以显示结果：
```javascript
{
    var a = 1;
}
console.log(a);    //1
```
而使用let时，会相当于创造出了一个块级作用域，例如将以上代码改用let进行声明，则在块级作用域外无法正常显示结果：
```javascript
{
    let a = 1;
}
console.log(a);    //Uncaught ReferenceError: a is not defined
```
**【Babel处理】**另外提一句，使用babel在对以上代码进行转换处理时，为了使结果符合预期的运行结果，他会自动进行一些处理。

例如将let a转换为其他的，例如var _a，而下面的console.log(a)不变；如果有重名（比如有_a）他会继续处理，变为_a2这样。


**2、在块级作用域下进行函数声明**

简单来说，let制造了块级作用域（见上面）；

而ES5中（也许还包括更早的），理论上，函数只能在全局作用域和函数作用域内声明，不能在块级作用域内声明。但实际上，因为要兼容以前版本，所以是可以的（不会出错，除非在严格模式'use strict'）。

但也是因为这样，所以如果在块级作用域内声明函数，你很难控制在不同浏览器中（包括同一浏览器不同版本）的实现是同样的效果。所以应该 **尽量避免在块级作用域内声明函数**。


**3、do表达式（存疑）**

按照[阮一峰的博客关于do表达式的说明](http://es6.ruanyifeng.com/#docs/let#do-表达式)，现在有一个提案，使得块级作用域可以变为表达式，也就是说可以返回值，办法就是在块级作用域之前加上do，使它变为do表达式。

代码如下：

```javascript
let x = do {    //Uncaught SyntaxError: Unexpected token do
  let t = f();
  t * t + 1;
};
```

我实测无效（chrome版本 55.0.2883.87），会报错，报错信息见注释，不知为何。也许是该提案未实现？

---

#const

解释：

    1. 简单来说，学过c++的可以理解为c++的const，没学过可以继续往下看；
    2. 如果指向非按引用传递类型（比如字符串，布尔值等），那么该值声明后无法被修改；
    3. 如果指向按引用传递，则无法更改其指向的对象，但该对象的值可以被修改；
    4. 准确的说，是让按引用传递时，保证该const变量指向的地址不变（而非该地址里的数据不变）（理解本条需要有指针相关概念）；

**1、指向非按引用传递类型的变量，其变量值不可以被修改**

即声明后不能被修改，修改会报错；

```javascript
const a = 1;
a = 2;    //Uncaught TypeError: Assignment to constant variable.
```

**2、指向引用类型的变量，其值可以被修改，但是不能让其指向另外一个对象**

对象的值可以被修改：
```javascript
const a = {test: 1};
a.test = 2;
console.log(a.test);    //2
```

不能修改指向的对象：（报错这步是因为更改了指向的对象）
```javascript
var a = {test: 1};
var b = {another: 2};
const c = a;
console.log(c);    //{test:1}
c = b;    //Uncaught TypeError: Assignment to constant variable.
```

**3、不能声明const变量时不赋值**

会报错
```javascript
const a;    //Uncaught SyntaxError: Missing initializer in const declaration
```

**4、块级作用域，相关特性类似let**

显然是块级的
```javascript
var a = 1;
{
    const a = 2;
    console.log(a);    //2
}
console.log(a);    //1
```
不存在变量提升，出现暂时性死区，不能先使用后声明
```javascript
{
    console.log(a);    //Uncaught ReferenceError: a is not defined
    const a = 1;
}
```
也不可重复声明（在同一个块级作用域内）(使用let和var同样不可）
```javascript
{
    const a = 1;
    const a = 2;    //Uncaught SyntaxError: Identifier 'a' has already been declared
}
```
**5、指向一个被冻结的对象**

const和Object.freeze不同，后者是冻结对象，而前者只涉及地址。

所以可以二者结合起来，让const变量指向一个被冻结的对象。那么该变量则不可更改指向的目标（因为const）也不可更改其值（因为冻结）。

先从阮一峰的博客拿来一个深度冻结函数（递归冻结该对象所有属性）：

```javascript
var constantize = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key, value) => {
        if (typeof obj[key] === 'object') {
            constantize(obj[key]);
        }
    });
};
```
然后略微修改，让const变量指向一个被冻结的对象，  
会发现既无法更改变量里对象的值，也无法让变量指向另外一个对象。  
有点像让const变量成为一个常量。  
（下面代码没有体现深度冻结的效果）
```javascript
var constantize = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key, value) => {
        if (typeof obj[key] === 'object') {
            constantize(obj[key]);
        }
    });
    return obj;     //I add this code
};
const a = constantize({a: 1});
console.log(a);    //{a:1}
a.a = 2;
console.log(a.a);    //1
a = 10;    //Uncaught TypeError: Assignment to constant variable.
```
---
#顶层对象的属性

1. 所谓顶层对象，在js里面指window
2. 当一个变量在顶层作用域里（比如说打开浏览器通过F12的console来直接输入命令），那么该变量在之前情况下，是属于window这个顶层对象的属性的；
3. 我们之前一般称之为全局变量，全局变量在以前会被认为就是window的属性的值；
4. 而ES6中则不是，全局变量和顶层对象的属性的值将脱钩；


###具体来说：

1、通过var或者function甚至直接写变量名然后进行赋值创建的对象，其变量名作为key添加到window对象中，而window里该key的值为被赋值的值。

如代码：

```javascript
console.log(window.a);  //undefined
console.log(window.b);  //undefined
console.log(window.c);  //undefined
var a = 1;
console.log(window.a);  //1
b = 2;
console.log(window.b);  //2
function c(){}
console.log(window.c);  //function c(){}
```

2、而通过let、const，以及之后的class创建的对象，则不会被添加到window里面。

如代码：
```javascript
console.log(window.a);  //undefined
console.log(window.b);  //undefined
let a = 1;
console.log(window.a);  //undefined
const b = 2;
console.log(window.b);  //undefined
```
---
#顶层对象的获得

1. 简单来说，顶层对象在浏览器里就是window；但是在Node.js里面没有window（Web Worker也没有，他是运行在后台的js脚本）；
2. 浏览器和Web Worker里，self指向顶层对象，但是Node.js里没有self；
3. Node里，顶层对象是global，但其他环境不支持（比如chrome里打global会告诉你未定义）；
4. 有时候我们需要用同一套代码，但在各个环境拿到顶层对象（啥时候？），所以得找个通用的办法；
5. 但是没有非常完美的。
6. 阮一峰给了两个办法，我直接摘抄了，如下代码：

```javascript
// 方法一
(typeof window !== 'undefined'
    ? window
    : (typeof process === 'object' &&
typeof require === 'function' &&
typeof global === 'object')
    ? global
    : this);

// 方法二
var getGlobal = function () {
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    throw new Error('unable to locate global object');
};
```

想要了解更多的话，参考[阮一峰的博客相关内容](http://es6.ruanyifeng.com/#docs/let#global-对象)。