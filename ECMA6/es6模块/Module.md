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

<h4>1.2、AMD、CMD、CommonJS</h4>

参照这个git链接：[模块化的三种规范，简要说明](https://github.com/qq20004604/some_demo/blob/master/%E6%A8%A1%E5%9D%97%E5%8C%96%E7%9A%84%E4%B8%89%E8%A7%84%E8%8C%83/AMD%E3%80%81CMD%E3%80%81CommonJS.md)

我将之前原本写在这里的内容单独截取出来了，参照上面。

<h4>1.3、es6的模块化</h4>

es6的模块化设计思想有以下特点：

1. 静态化，加载哪些，可以在编译的时候就确定，而不是只有当运行的时候才确定；
2. 编译的时候就能确认依赖关系，这样好优化（缺点是某些模块不确定需不需要用，异步加载需要另外实现，很麻烦）；
3. 通过``export``显式的指定导出的内容，避免全局污染，例如让模块内部的一些东西影响到其他模块；
4. 模块内部的作用域是独立的，不同模块即使有同名变量，只要该变量不影响外部，那么也是互不干扰的；

另外，es6的模块内部，自动启用**【严格模式】**。

<h3>2、import和export</h3>

<h4>2.1、准备工作</h4>

由于浏览器还不支持import和export，因此需要转码。

转码的教程参照我这篇文章[如何在修改代码后，查阅效果](https://github.com/qq20004604/some_demo/tree/master/ECMA6/es6%E6%A8%A1%E5%9D%97)

然后从我的github上down下来这个文件夹下的东西：

[qq20004604/some_demo/ECMA6/es6模块/](https://github.com/qq20004604/some_demo/tree/master/ECMA6/es6%E6%A8%A1%E5%9D%97)

1. 先全局安装转码工具；
2. 然后再修改入口文件``foo.js``，以及他引用的文件的代码；
3. 并运行``npm run test``完成转码；
4. 打开``test.html``查看效果。

每次做完后，重复2、3、4步流程即可开始下一次

<h4>2.2、export</h4>

先上一个[MDN关于export的说明（中文）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)的链接，建议扫一眼。

``export``用于规定模块的对外接口。

通俗的说，只有通过这个方式暴露的才可以被外界访问。而其他的，相对于外界是独立的（不会造成影响，除非你使用全局变量）。

**关于``export``导出模块内部的方法：**

首先，因为浏览器不支持，因此只能转码执行。因此，不排除在某种情况下，某些写法会出问题的情况，如果遇见报错，建议换种方法试试。

其次，2.3再讲``import``的注意点，这里只会简单提一下。

最后，代码要编译转码后才能运行，切记加载转码后的结果。

附一个[stack overflow上关于export用法的回答](https://stackoverflow.com/questions/25494365/es6-javascript-module-export-options)

1、声明后直接导出的写法：

```
// bar.js
export const myFirstName = 'Dong';
export let myLastName = 'Wang'

// foo.js
import {myFirstName} from './bar.js'
import {myLastName} from './bar.js'
console.log(`My name is ${myFirstName} ${myLastName}`)
```

引入的时候，需要引入的变量名和导出的变量名一致才可以，比如foo.js里的``{myFirstName}``和bar.js里的``myFirstName``是一样的。不然是无法正确被import进来。

注意：导出的无论是变量还是常量，都不允许在foo.js里修改，原因是因为引用的，具体查看下面的**注意点【1】**。如果修改的话，编译时会出错的。

如果连续导出刚声明的变量，可以这么干：（不过我个人觉得这种写法一点都不好看，并且他们的声明方式要一致才行。）

```
export const myFirstName = 'Dong', myLastName = ''
// 相当于
export const myFirstName = 'Dong';
export const myLastName = 'Wang';
```

2、先声明后导出的写法：

```
// bar.js
const myFirstName = 'Dong';
let myLastName = 'Wang';
export {myFirstName, myLastName}

// foo.js 和上面保持一致
```

被导出的变量，用大括号包裹起来，注意有这种并不是es6对象的简洁写法，请不要混淆了。（具体参照下面的**注意点【3】**）

3、用其他名字导出变量/常量/函数：

标准写法是：

> export { 模块内变量名1 as 导出名字1, 模块内变量名2 as 导出名字2 }

但经测试，我上面发的那个转码的插件，是不能正确的转码这种方式的，但这种方式按照MDN和stack overflow上别人的回答，是正确的（见本节开始给的链接）。

因此，如果为了稳妥起见，建议规避这种方法。

```
// bar.js

const firstName = 'Dong';
let lastName = 'Wang';
export {firstName as myFirstName, lastName as myLastName}
```

4、导出函数/类：

和导出变量/常量的方法是一样的，唯一需要注意的是，假如函数是声明式的，那么导出他需要注意一下方法。

先上**错误**的示例：

```
// 错误的
function log() {
    console.log('test')
}
export log
```

然后上正确的示例：

```
// foo.js
import {log} from './bar.js'
log()
```

**bar.js**

【正确1】：声明时直接导出，类似上面的【1】``export let a = 1``


```
export function log() {
    console.log('test1')
}
```


【正确2】：先声明再导出，类似上面的【2】

```
let log = function () {
    console.log('test2')
}
export {log}

```

【正确3】：同样是先声明再导出，和【正确2】类似

```
function log() {
    console.log('test3')
}
export {log}
```

---

注意点：

1、export导出的变量是按引用传递的，是模块内的实时值。

具体来说，如有以下代码：

```
export let myLastName = 'Wang'
setTimeout(() => {
    myLastName = 'Zhang'
}, 1000)
```

import导入myLastName后，直接console.log，会显示值是``Wang``。假如再等超过1秒后去打印这个值，会发现他变成了``Zhang``。

2、对外的接口，必须和内部的变量/常量/函数是一一对应的关系。

3、错误的写法：

```
// 错误的写法
export {myLastName:myFirstName, myLastName:myLastName}
```