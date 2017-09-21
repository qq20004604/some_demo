<h3>1、前注</h3>

关于es6的详细说明，可以参照我的系列文章[es6 从入门到熟练](http://blog.csdn.net/qq20004604/article/category/6642964)，或者阮一峰的[ECMAScript 6 入门](http://es6.ruanyifeng.com/)。

我的系列文章，是在阮一峰的基础上，增加了更多适合初中级开发者的内容（包括大量的示例代码和解释），以降低学习难度，丰富说明。

本文是对es6整体的回顾，结合我的实际开发经验，对es6的一个小结。

为了精炼内容，es6里不常用的内容已经去掉，而对常用、重要的es6知识，附上简单的代码说明，并另附有详细说明的博文链接，方便初中级开发者理解。

<h3>2、开发环境</h3>

**关键字：IE9、Babel、Babel的垫片、脚手架**

首先，使用es6的前提是最低IE9，如果你需要兼容IE8，建议放弃es6，专心使用神器jQuery。

其次，如果需要使用es6来编写，那么你需要``Babel``转码器用于将你的es6代码转换为es5代码，用于兼容只能使用es5的环境。否则对于只能运行es5的环境（例如IE9），是无法运行es6代码的。

第三，由于Babel在默认情况下，并不是全部转换的，如以下说明：

>Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。

因此，我们需要垫片，一般情况下可以用[babel-polyfill](http://es6.ruanyifeng.com/#docs/intro#babel-polyfill)，也可以用``babel-runtime``，这两个有所差异。

babel-polyfill会污染全局对象，即会对例如Object这样的对象添加方法，而babel-runtime只会转换es6语法的代码，但如果你需要调用Object.assign这样的方法，那就不行了。

由于细节很多，因此这里给几个参考链接吧：

[Babel 全家桶](https://github.com/brunoyang/blog/issues/20)

[babel的polyfill和runtime的区别](https://segmentfault.com/q/1010000005596587?from=singlemessage&isappinstalled=1)

看完以上两个，可能会觉得应该同时使用这两个，然而并不需要，看下面这个链接：

[transform-runtime 会自动应用 polyfill，即便没有使用 babel-polyfill](https://github.com/lmk123/blog/issues/45)的``conanliu``于``17 Dec 2016``提交的issues。

如果你使用的Vue.js，那么可以直接fork我的脚手架，然后当做自己的脚手架使用。

附脚手架链接：[vue-scaffold](https://github.com/qq20004604/vue-scaffold)，如果可以，给个star喔~~

如果你用的不是Vue.js，那么可以去搜一下你所使用的框架的脚手架，然后拿来使用。如果找不到，可以找使用带脚手架的该框架项目，然后down下来，删除对方的项目只取壳来用即可。（如果有许可，记得阅读一下许可看能不能这么干）

<h3>3、let和const</h3>

既然有let和const了，那么推荐优先使用这两个。

一般情况下，let可以直接替代var，对于常量，可以用const。

这不是必须的，但用这2个可以帮你规范写代码的习惯，所以还是强烈推荐的。

比较蛋疼的是，用webtorm，let有时候不会高亮，只有var和const是高亮的。这个可能是用的风格的问题，我也不太确定。解决方案我自己是没找到，凑合用吧。

另外，let和var之间的一个重要区别是变量提升，所以如果你写代码不太规范的话，可能会报错，好好检查一下吧。

另外，阮一峰推荐将**函数设置为常量**，就像这样子：

```
const add = function (a, b) {
    return a + b
}
```

我觉得挺有道理的，推荐。


<h3>4、字符串</h3>

既然用es6，当然要用反引号这个高大上的东西了。

详细用法推荐我自己的博客：[ECMAScript 6（7）模板字符串](http://blog.csdn.net/qq20004604/article/details/67106150)

最基本的用法，可以直接用反引号替代普通的引号（单引号和双引号）

例如：

```
let a = 'ab'
// 可以直接用以下替换
let a = `ab`
```

而且一般情况下，简单需求不用再拼接字符串了~（另外，反引号也可以像普通字符串那样拼接）

如：

```
let str = '20004604';
let html = 'my QQ is ' + str;

//用以下替换
let str = '20004604';
let html = `my QQ is ${str}`;
```

简单暴力省事。

<h3>5、解构赋值</h3>

最大的好处是简化了写法，如代码：

```
let obj = {
    a: 1,
    b: 2
}

//old
let a = obj.a;
let b = obj.b;

// es6
let {a, b} = obj
```

除了对象之外，还有数组也可以解构赋值，别忘了。

<h3>6、对象</h3>

es6的对象，比早期版本的写起来舒服很多。

例如：

1. 对象属性是函数的时候可以简写；
2. setter和getter的简写；
3. 通过``Object.assign()``来合并对象，实现继承或添加属性效果；
4. 可以用属性名表达式；
5. 可以用变量名只要作为对象的属性名，并且变量的值可以自动成为对象该属性名的值；

列一些常见写法：

```
let obj = {
    // 对象属性是函数的时候可以简写
    a(){
        console.log('对象属性是函数的时候可以简写')
    },
    // setter和getter的简写；
    get b() {
        return this._b
    },
    set b(val) {
        this._b = val
    }
}


let c = '添加了一个c'
// 通过``Object.assign()``来合并对象，实现继承或添加属性效果
// 可以用变量名只要作为对象的属性名，并且变量的值可以自动成为对象该属性名的值
Object.assign(obj, {
    c
})

// 可以用属性名表达式
let d = "abcd"
obj[d.replace(/abc/, '')] = '属性名表达式'
```

<h3>7、数组</h3>

最常用的就两个：

1. 扩展运算符``...``；
2. 将类数组的转为数组的``Array.from()``

如代码：

```
function getArgs() {
    let foo = [...arguments]
    console.log(foo)
    let bar = Array.from(arguments)
    console.log(bar)
}
getArgs(1, 2, 3)
// [1, 2, 3]
// [1, 2, 3]
```

需要注意的一个特性：

1. es5在面对，通过``Array(5)``这样生成带空位的数组时，处理他的时候会跳过空位[数组的空位](http://blog.csdn.net/qq20004604/article/details/71699206#t10)；
2. es6在同样情况下，因为使用遍历器接口，所以会进行处理（视为undefined），而不是跳过；

<h3>8、函数</h3>

函数常用特性有以下几个：

1. 箭头函数：特点是this永远指向声明时的父级作用域，写起来比普通函数简单；
2. bind：可以给函数绑定this，并将这个绑定后的函数返回（不影响原函数）；
3. rest函数：即函数参数使用例如``function test(..args){}``这样的，这个返回的是一个数组，而不是类数组。
4. 参数默认值：一般带默认值的参数，放在参数列表的后面。

```
function test(a, b = 3) {
    console.log(a, b)
    console.log(this)
}
test.bind('Is this')(1)
// 1 3
// Is this

function test2(...args) {
    console.log(args.length)
}
test2(1, 2, 3, 4, 5)
// 5
```

<h3>9、Set和Map</h3>

Set结构最大的特点是去重，Map结构最大的特点是kv结构。

**Set:**

Set和数组类似，可以存储元素，但是Set不能存储相同的值。

非引用类型变量来说，就是值相等；对于引用类型变量来说，指地址相等（而不是值相等）。详细情况请点击[Set类型和WeakSet](http://blog.csdn.net/qq20004604/article/details/72901399)查看。

至于去重，一般是对数组使用。先作为参数生成一个Set类型变量，再利用扩展运算符变回数组，去重完成，完美。

利用扩展运算符，调用Set的迭代器接口

```
// 去重
let foo = new Set([1, 2, 3, 3, 3])
console.log([...foo]);  // [1, 2, 3]
```

**Map:**

Map结构和对象非常类似，不过最大的区别在于，Map结构可以用其他类型作为key，例如数组、对象等。

Map可以参照这篇博客[Map和WeakMap](http://blog.csdn.net/qq20004604/article/details/72905172)

示例代码：

```
let zhang = {
    firstName: "王"
}
let property = {
    gender: "男"
}
let foo = new Map()
foo.set(zhang, property)
foo.has(zhang)  // true
foo.get(zhang)  // {gender: "男"}
```

<h3>10、Promise</h3>

Promise是es6的精华之一，他非常适用于异步处理。

Promise对象在使用的时候，分为两部分，第一部分是``new Promise``这一步，第二部分是对返回的Promise实例进行处理的内容。

因为是通过执行``resolve``或``reject``来改变Promise的状态，从而决定执行then的时机的（类似回调函数），以及执行的哪一个。因此写起来和回调函数相近，但是可以连写，避免回调地狱的情况。

关于Promise的详细介绍请阅读[Promise(1)基础知识](http://blog.csdn.net/qq20004604/article/details/76228705)及之后三篇博客

如示例代码（对比普通ajax和promise）（另注：为了方便理解，仿jQuery的写法，并且没有用jQuery的``$.ajax().then()``这种写法）

```
// 模拟ajax
function ajax (options) {
    setTimeout(function () {
        options.success(options.url)
    }, 1000)
}

// old
let foo = function (callback) {
    ajax({
        url: "/1",
        success: function (result) {
            callback(result)
        }
    })
}
let foo2 = function (result) {
    console.log(result)
    return function (callback) {
        ajax({
            url: "/2",
            success: function (val) {
                callback(val)
            }
        })
    }
}
// 核心，调用的时候如果是连续请求的话，基本要写成回调地狱了
foo(function (result) {
    foo2(result)(function (val) {
        console.log(val)
    })
})

// Promise
let bar = function () {
    return new Promise((resolve, reject) => {
        ajax({
            url: "/1",
            success: function (result) {
                resolve(result)
            }
        })
    })
}
let bar2 = function (result) {
    console.log(result)
    return new Promise((resolve, reject) => {
        ajax({
            url: "/2",
            success: function (val) {
                resolve(val)
            }
        })
    })
}
// 核心，then连写即可
bar().then(function (result) {
    return bar2(result)
}).then(function (result) {
    console.log(result)
})
```

显然，then连写比回调函数的写法要方便一些。

如果面对的是特殊需求，比如是多个ajax请求全部完成后，再执行执行函数，那么Promise的优势会更大一些，而非Promise写法要麻烦很多。

甚至如果要对错误进行处理，那么Promise写法会更方便。

不过这里只是小结，就不细说了。


<h3>11、class</h3>

class是好东西。

有了class后，写构造函数、写类的继承的难度，下降了很多很多。

先附我的博文[class(1)基本概念](http://blog.csdn.net/qq20004604/article/details/77775341)，以及之后5篇博文。

由于很简单，给一个示例大约就能理解这个是怎么用的：

```
class Foo {
    constructor () {
        console.log('this is constructor')
        this.defaultValue = '变量要在构造函数里赋值，而不能直接声明'
    }

    log () {
        console.log('log')
    }
}

let foo = new Foo() // this is constructor
foo.log()   // log
foo.defaultValue   // "变量要在构造函数里赋值，而不能直接声明"
```

<h3>12、es6模块</h3>

es6的模块不同于以往的CommonJS（node用，服务器环境），AMD（RequireJS的规范，浏览器环境，依赖前置）、CMD（SeaJS定义的规范，浏览器环境，依赖就近）。

他的特点有两个：

1. 编译时加载，因此可以做静态优化；
2. 模块的引用进来的，都是值的引用，而非值的拷贝。

缺点是：

1. 浏览器环境下不支持，node环境下支持的也比较差；
2. 必须考babel转码后才可以正常使用，因此对某些符合规范的特性支持的不是很好；

详细说明阅读这篇博客：[es6的import和export](http://blog.csdn.net/qq20004604/article/details/77961647)，另外三个规范阅读这篇博客[AMD、CMD、CommonJS](http://blog.csdn.net/qq20004604/article/details/77929400)

基本使用方式如示例代码：

```
// foo.js
let foo = 'foo'
export default foo

// bar.js
import foo from 'foo'
console.log(foo)
```

<h3>13、async函数</h3>

这个并不是es6的，而是es2017（又称es8）的内容。

可以认为async函数是Generator函数的语法糖，详细说明参照这篇博客：[async函数](http://blog.csdn.net/qq20004604/article/details/77657729)。

他的前置知识比较多，包括Iterator遍历器、Generator状态机、Thunk函数（自动执行Generator 函数）。

简单的说，假如有多个异步请求，你需要让这些起步请求依次执行，例如在执行完前一个之后，再执行后一个。那么你就需要async函数了。

async函数可以让你写这种请求如同写同步函数一样简单（对比【10】中的Promise更简单）。

以下示例是基于【10】中的代码，在最后一步执行的时候，改用async函数来完成

```
// 模拟ajax
function ajax (options) {
    setTimeout(function () {
        options.success(options.url)
    }, 1000)
}

// Promise
let bar = function () {
    return new Promise((resolve, reject) => {
        ajax({
            url: "/1",
            success: function (result) {
                resolve(result)
            }
        })
    })
}
let bar2 = function (result) {
    console.log(result)
    return new Promise((resolve, reject) => {
        ajax({
            url: "/2",
            success: function (val) {
                resolve(val)
            }
        })
    })
}

async function foo () {
    let result1 = await bar()
    let result2 = await bar2(result1)
    return result2
}

foo().then(result => {
    console.log(result)
})
```

可以发现，async让连续异步调用像写同步函数一样简单。

<h3>14、ESLint</h3>

规范化开发，建议还是用ESLint来帮忙检查吧。不会这个怎么行？

>ESLint是一个语法规则和代码风格的检查工具，可以用来保证写出语法正确、风格统一的代码。

这里直接给一个阮一峰写的文章，等以后我再单独补一篇详细用法的博客。

[ESLint的使用](http://es6.ruanyifeng.com/#docs/style#ESLint的使用)

<h3>15、小结</h3>

es6常用内容基本就以上13点。

虽然es6实际包括了很多知识，例如：

1. string方面增加了对utf16字符的更好的支持；
2. number方面增加了对最大值、最小值、以及合理误差误差值的处理等；
3. Symbol产生唯一变量；
4. Proxy的代理；
5. 遍历器，状态机等等。

但实际常用的就以上这些，如果只是日常使用的话，熟悉以上内容足够了。

但若要做的更好，那么应该深入学习，es6新增的很多内容，是将传统后端语言的一些很好的思想，搬到JavaScript来，让js规范化。

对于专精于前端的同学，学习es6的过程中，可以学习到这些来自于其他语言的精华，因此建议至少完整的看一遍，勿要只满足于常用的这些API。