<h3>1、前注</h3>

本文基于[阮一峰的es6编程风格](http://es6.ruanyifeng.com/#docs/style)所写。

我在其基础上，结合我本人实际开发经验，对不重要的部分进行简略，并新增了一些内容，方便初级中级开发者理解。

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