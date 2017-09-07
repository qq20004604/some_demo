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

先附一个符合AMD规范的函数：

```
define(['3'], function (obj) {
    return Object.assign({}, obj, {b: 2})
})
```

再上一个带AMD模块自制加载器，完整注释的模拟异步加载的代码，有以下特点：

1. 根组件异步加载2个模块；
2. 异步的模块之一，也异步加载第三个模块；
3. 三个模块情况各不同，分别是：①只有参数3，值是对象；②有依赖，且参数三是函数并有返回值；③只有参数三，是函数，有返回值；

```
// 接受3个参数，分别是id（可选），依赖（可选），工厂函数/对象
function define() {
    let array = [...arguments]	// 参数直接用...array可以省略本行
    let id, dependencies, factory;
    if (array.length > 2) {
        [id, dependencies, factory] = array
    } else if (array.length > 1) {
        [dependencies, factory] = array
    } else {
        [factory] = array
    }
    // 略过id，太麻烦不写，也不考虑缓存什么的

    // 如果有依赖，先加载依赖
    if (dependencies) {
        // 创建一个空数组备用
        let deArr = []
        dependencies.forEach(item => {
            // ajaxGet函数是返回一个Promise对象
            // 所以deArr变成一个放满Promise对象的数组
            deArr.push(ajaxGet(item))
        })
        // 利用Promise.all的特性
        // 只有当deArr里面所有Promise对象的值都变为resolve才会执行all的then
        // 具体原理请谷歌
        return Promise.all(deArr).then(array => {
            // deArray的所有结果被放到数组里然后返回
            // 由于异步请求到的被当做字符串处理，所以先要eval解析
            // funArray是放解析后的结果，每个元素都是Promise对象
            // 因为define函数的返回值是Promise对象
            let funArray = array.map(str => {
                return eval(str)
            })
            // 这个时候，Promise对象的状态还没变化，
            // 因此用all的特性，等待他们全部状态变化为正常的，再执行then
            return Promise.all(funArray).then(result => {
                // 这次有结果了，result是每个依赖的define函数的返回值
                // 如果是函数，那么执行函数，并返回函数结果
                if (typeof factory === 'function') {
                    return factory(...result)
                }
                // 如果不是函数，那么直接返回参数3的值
                return factory
            })
        })
    }
    // 是函数，则直接执行函数（因为没有依赖）
    if (typeof factory === 'function') {
        return factory()
    }
    // 不是函数，则直接返回参数三的值
    return factory
}

// 模拟请求依赖
function ajaxGet(sign) {
    // 简化代码，只考虑成功
    return new Promise(resolve => {
        setTimeout(() => {
            let str = {
                // 依赖1只有一个参数3，值是对象
                '1': 'define({a: 1})',
                // 依赖2有一个自己的依赖（依赖3），值是函数
                '2': `define(['3'], function (obj) {return Object.assign({}, obj, {b: 2})})`,
                // 依赖3是一个函数，他有返回值
                '3': `define(function () {return {c: 3}})`
            }
            resolve(str[sign])
        }, 1000)
    })
}

// 这是root
define(['1', '2'], function () {
    console.log(arguments)
    // {a:1}
    // {c:3, b:2}
})
```


<h4>1.4、CMD规范</h4>

上面讲了CommonJS和AMD规范，还剩下一个Sea.js推荐的CMD规范。

老规矩先上链接[CMD规范](https://github.com/seajs/seajs/issues/242)

CMD规范和AMD规范的区别有：

1. 同步加载，类似Common.js（**性能好**）；AMD是依赖前置，提前执行了（**用户体验好**）;
2. 按顺序加载，放在代码前的先加载，代码后的后加载——**依赖前置**；AMD的是依赖加载完后，哪个依赖先下载完就先加载和执行哪个依赖——**依赖就近**；
3. CMD是就近原则，先下载好依赖，然后需要执行的时候再解析（**延迟执行**）；AMD是下载好就立刻解析（**提前执行**）；

上CMD的核心函数：

> define(id?, deps?, factory);

是不是觉得和AMD的很像，事实也如此，defined的参数基本是一致的，区别在于factory的参数。

> factory(require, exports, module) {//...}

1. require类似Common.js的require，但他不负责去同步加载（因为模块已经加载好了），他主要负责解析；
2. exports类似Common.js的module.exports，用于向外提供接口；
3. module是一个对象，上面存储了与当前模块相关联的一些属性和方法；

