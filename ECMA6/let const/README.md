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

