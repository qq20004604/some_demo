<h3>1、概述</h3>

<h4>1.1、module是什么</h4>

俗称【模块】。

简单来说，假如我写了三个功能，每个功能1000行代码。

如果放在一个js文件里，那就是3000行代码；

如果每个功能放在一个js文件里，那就是各1000行代码。

在往常情况，我们可能需要在html文件里，通过script标签来加载这三个js文件。但这个带来几个问题：

1. 必须依赖html文件；
2. 没有办法做到按需加载（除非你用例如``document.write``或者创建新的DOM标签，之类的方法写入标签）；
3. 不能做到js文件对js文件的依赖关系；
4. 不能做到只暴露指定接口（可以通过立即执行函数返回一个对象，来变相实现，但是很麻烦）；
5. 会污染全局变量；
6. 不方便；

为了解决以上问题，有一些通行的规范，比如**CommonJS**（被Node使用，一般用于服务器端）、**AMD规范**等（一般用于浏览器端）。而ES6也推出了自己的规范。

<h4>1.2、CommonJS</h4>

先给一个[CommonJS规范的链接](http://javascript.ruanyifeng.com/nodejs/module.html)。

简单概述一下：

**导出：**

通过``module.exports``来导出。

``module.exports``可以理解为一个对象，你可以把要导出的东西挂载在这个对象上。比如``module.exports.foo = 'a'``或者

```
module.exports = {
    foo(){
        console.log('foo')
    },
    bar: 'bar'
}
```

**导入：**

通过``var obj = require(模块名)``来导入。

效果相当于``obj = module.exports``这样。

**使用示例：**

新建foo.js文件，里面内容为：

```
module.exports = {
    foo(){
        console.log('foo')
    },
    bar: 'bar'
}
```

新建bar.js文件，里面内容为：

```
let test = require('./foo')
test.foo()
console.log(test.bar)
```

打开命令行，确保你安装了Nodejs，然后运行：

```
node bar.js
```

输出结果：

```
foo
bar
```

具体细节看本节开头的链接。

另附一个我自己写的模拟CommonJS规范的CommonJS极简易加载器，附上。

```
function require(url) {
    // 去拿取加载的信息
    let text = sync(url)
    // 前后添加一些字符串，封装成一个函数，用括号括起来表示是一个表达式
    text = '(function(module){' + text + '})'
    // eval这个字符串，把他变为一个真函数
    let fn = eval(text)
    // 调用这个函数，并将module这个对象作为参数传进去
    // 这样module就可以拿到导出的数据了
    let module = {}
    fn(module)
    // 我们是通过module.exports导出的，所以返回他
    return module.exports
}

// 因为是CommonJS是同步的，因此用本函数模拟同步加载
function sync(url) {
    // 省去加载文件的过程，直接输出返回结果
    return `module.exports = {
foo(){
    console.log('foo')
},
bar: 'bar'
}`
}

let myModel = require('test')
myModel.foo()
console.log(myModel.bar)
```

<h4>1.3、AMD规范</h4>

先上一个[AMD规范文档的中文版](https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88))

再附一个[AMD加载器分析与实现](https://github.com/creeperyang/blog/issues/17)

如果看上去还比较糊涂，那么就继续看下面我的解释：

首先上AMD规范的核心：

>define(id?, dependencies?, factory);

参数一和参数二可以省略，参数三是必须的。

参数一：模块名（字符串）。有没有随意，没有的话会自动给一个默认的；

参数二：依赖（数组）。可选，如果需要依赖的话，会等这些依赖加载完后，再去执行参数三。

参数三：工厂方法，可以是对象，也可以是函数，**核心内容**。

1. 如果是对象，那么此对象为模块的输出值；
2. 如果是函数，那么应该只被执行一次（且那些依赖会作为参数传入）；
3. 如果是函数且有返回值（隐式转换非false），那么这个返回值就是模块的输出值；

简单总结一下，通过``define``函数，可以加载一些依赖，全加载完之后，会执行一个函数（依赖作为参数传入）。如果这个函数没值返回，那就单纯只是执行而已，如果有值返回，那么这个值就是本模块的输出值。

