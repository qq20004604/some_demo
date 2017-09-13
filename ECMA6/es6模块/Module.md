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

引入的文件foo.js代码如下，如无特殊声明，那么只使用这个。

```
// foo.js
import {log} from './bar.js'
log()
```

被引入bar.js的代码，如下面几种情况：

先上**错误**的示例：

```
// 错误的
function log() {
    console.log('test')
}
export log	// 原因是导出变量不能直接导出变量名
```

然后上正确的示例：

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

5、导出默认的（引入文件不需要知道内部提供的接口的名字是什么）

> export default expression;<br>
export default function (…) { … } // also class, function* <br>
export default function name1(…) { … } // also class, function* <br>
export { name1 as default, … };

之前几种导出方法可以用，但实际使用中，用这种方式的比较多。因为最大的好处是不需要知道模块对外提供的接口的接口名是什么。

这种导出方式和上面不同之处在于：

1. 是唯一的，一个模块内只能出现这一个；
2. 和``export``不冲突，可以同时存在；
3. import的引入方式，与``export``方法导出的引入方式不同；
4. 后面可以直接跟变量、函数、类或其他，而``export``后面跟的必须放在大括号里；

以下代码可验证：

```
// bar.js
function log() {
    console.log('test4')
}
export default log  // 如果是export，这里就不能是log，而应该是{log}
export let a = 1    // 可以同时export和export default都存在

// foo.js
import log from './bar.js'
import {a} from './bar.js'
log()	// test4
console.log(a)	// 1
```

6、导出继承来的模块

6.1、导出默认接口

需要注意的是，``bar.js``不能直接用``export default from './baz'``，转码的时候回报错。

也不能用``export {default} from './baz'``，转码后用现有``foo.js``代码无法正常导入。

总之，稳妥起见，请用以下方式来实现

```
// baz.js
export default 'baz'

// bar.js
import baz from './baz'
export default baz

// foo.js
import baz from './bar.js'
console.log(baz)    // baz
```

6.2、导出指定接口

由于转码问题，理论上一些合法的写法不能写，例如``export * from './baz'``这样可以导出全部接口的，在转码后无法正常显示数据，因此建议以以下这种方式来写。（即导入导出分两行代码来写）

```
// baz.js
export let baz = 'baz', BAZ = 'BAZ'

// bar.js
import {baz} from './baz'
export {baz}

// foo.js
import {baz} from './bar.js'
console.log(baz)    // baz
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

另外，就算中间夹杂着其他模块，只要一路传递过来，没做其他处理，依然是引用的。

2、对外的接口，必须和内部的变量/常量/函数是一一对应的关系。

你不能直接使用例如``export 1``这样的写法，这是没有办法引入的。

而``export default 'bar'``这样的直接导出字符串的情况，虽然在我上面提供的转码工具的情况下是可以正常使用的，但MDN并没有提供这样的用法，因此也不推荐使用。

3、错误的写法：

```
// 错误的写法
export {myLastName:myFirstName, myLastName:'1'}
```

原因：export后面的大括号，并不是对象的缩写。

4、export必须出现在模块的顶层，而不能是某个块级作用域或者函数作用域之内。这个没啥好说的，略。

<h4>2.3、import</h4>

上面分析export，其实也顺便解释了import。

[MDN上关于import的说明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)

用法：

1、引入默认模块：

```
// bar.js
export default 'bar'

// foo.js
import bar from './bar.js'
console.log(bar)    // bar
```

import后面直接跟变量名即可，变量名即是导出的变量/常量/函数/类

2、引入模块的多个/指定变量/常量/方法等：

```
// bar.js
export let bar = 'bar', BAR = 'BAR'

// foo.js
import {bar, BAR} from './bar.js'
console.log(bar, BAR)    // bar BAR
```

3、引入整个模块暴露的接口；

这里必须通过as重新命名

```
// bar.js
export let bar = 'bar', BAR = 'BAR'

// foo.js
import * as bar from './bar.js'
console.log(bar.bar, bar.BAR)    // bar BAR
```

相当于让整个``bar.js``的对外接口被挂载了``foo.js``的bar对象上。

注意，因为是按引用传递的，因此只能输出值，或者执行方法，但是不能修改变量（比如``bar.bar``指向的值）

4、在3的基础上同时导入默认接口：

无非是1和3的结合罢了，看完代码就秒懂。如果是1和2的组合，写法是类似的，把``* as bar``替换成2的写法即可

```
// bar.js
export let bar = 'bar', BAR = 'BAR'
export default 'bar default'

// foo.js
import barDefault, * as bar from './bar.js'
console.log(bar.bar, bar.BAR, barDefault)    // bar BAR bar default
```

5、修改导入接口的名字：

> import name as newName from 'xxx'<br>
> import {name as newName, ...} from 'xxx'

例子不给了，简单的说，上面那个是修改默认接口，下面的是修改暴露出来的接口。从上面看到这里还看不懂的就太笨了。

没了吧？应该没了吧？导入再导出的参照export那边的代码

注意点：

1、``import``和``export``不同，他会被提升到模块的顶部（而``export``不会被提升，因此必须先声明再导出，或者声明时立即导出）；

但依然推荐把``import``写在最上面，这是一个好习惯。另外，请不要写在块级作用域内。

2、模块名的``.js``后缀可以省略，其他的不行；

3、模块名的路径也可以省略，但你得配置告诉解析引擎取法，一般有固定的取法（比如先同级目录，再去``node_modules``目录下找之类，具体看解析引擎的设置）；

4、如果某个模块被多次导入，里面的代码只会被执行一次。

例如以下代码，bar里的代码只会执行一次。

```
import 'bar'
import 'bar'
```

又例如：模块A导入模块B和模块C，而模块B和模块C都导入模块D，那么模块D里面的代码依然只会被执行一次。（证明方法略）

原因是因为模块是按引用传递的，因此如果执行多次，就不会是按引用生效的了。

<h4>2.4、export default</h4>

目的是让用户不用查看有哪些接口也能用，毕竟我用你的方法，还要知道你提供哪些接口，实在是很麻烦的事情。要是引入进来，用我自己定的变量名直接使用，才够人性化。

具体用法见2.2的【6.1】和2.3的【1】即可。

一般默认输出一个对象、类、函数，偶尔会默认输出变量。

因为很灵活，个人建议按标准写法写，即先声明，再导出，这样看起来既美观，也不容易出错，还好维护。

<h4>2.5、import和export的混合使用</h4>

先给个[阮一峰的文章链接](http://es6.ruanyifeng.com/#docs/module#export-与-import-的复合写法)，这些写法理论上是正确的。

但还是那句话，转码工具有时候会给你搞事，所以还是稳妥起见，先导入，再导出。

有些代码，如以下，都是会无法正常执行的：

```
// 默认接口导出
export { default } from 'foo';
```

```
// 默认转具名导出
export {default as bar} from 'baz';
```

更多都不列举了。

但只要先导入、再导出，一般是不会出错的。

<h3>3、模块的继承</h3>

读者们，你们知道我写这篇博客最痛苦的是什么么？

明明es6规定了这个特性，但却由于浏览器本身不支持，外加转码工具的不支持这个特性，导致无法正常实现。

继续先给个[阮一峰的博文](http://es6.ruanyifeng.com/#docs/module#模块的继承)

例如，以下代码应该是允许的：

```
// bar.js
export * from 'baz'
export let bar = 'bar'
```

这段代码的效果是将baz导出的原封不动导出，再顺便再加导出一个bar变量。

然而转码工具转码后会报错。所以GG。

如果你像我一样，想先获取``import * as baz from 'baz'``，然后遍历baz再导出来实现。对不起，请念一句话：``export不能用在块级作用域内``。

所以模块的继承，如果你使用的是不支持这种特性的转码工具，那么就没法用。

另外，并不确认``babel``是否支持。建议使用babel转的人可以试试。

<h3>4、常量、配置</h3>

<h4>4.1、关于常量</h4>

阮一峰的博文提到，const的作用域只有声明的时候作用域。

然而，由于模块的特性，因此const声明的变量也可以被导出，并且也是按引用传递的。

那么其他模块能不能修改呢？这存在几个问题：

1、有的转码工具，不允许直接修改引用变量的值（准确的说，是这儿变量名指向的内存地址），会报错（原因是会按引用传递，如果修改导致出现很多问题，比如其他引入这个变量的值也会被修改，很麻烦），根本不能转；

2、按照解耦和封装的思想，也不应该修改。

直接修改获取到的变量的值，是违反封装的原则的，如果真需要修改，应该调用模块提供的方法来进行修改；

3、一般也没必要改，如果要改，可以把引入的变量的值赋给新的一个变量，然后修改那个新的变量的值即可；

4、对于对象之类的按引用类型来说，一般不会让他指向另外一个对象，而是给原有对象添加属性，这个可以直接修改，并不影响，但我并不建议。原因参照第二条。

let同理。

<h4>4.2、模块和配置</h4>

我们一般在开发的时候，需要在多个组件或者页面里，实现相同的逻辑。

如果是比较初级的开发者，可能会通过复制粘贴，将一段逻辑复制粘贴到多个地方。

然而这造成两个问题：

1. 当变更需求的时候，需要一一去找使用这段逻辑的地方，很容易造成漏改；
2. 代码亢余，维护不方便。

对于有一定经验的开发者来说，通常是将这样的逻辑，写在一个单独的js文件中。这样在使用的时候，直接引入这个文件，并执行里面的方法即可。

有没有发现，这不就是模块嘛，这种模块可以称为配置模块。

作为配置的模块，导出的内容不仅有函数，可以是常量、对象、类等。

例如：

我们需要做一个表单功能，他需要校验一个字段。而这个字段会在多个表单中出现，我们就可以抽象出这个验证方法来。放在一个js文件中，通过export导出这个校验逻辑。

既然这个校验逻辑可以放，那么其他可能共用的校验逻辑，自然也可以放入这个js文件。

最后，这个js变成一个专门用于校验表单模块了。

---

除了校验逻辑外，还可以有很多其他的东西。

例如，同样是表单，校验成功和失败后，是要有提示图标的。如果每个页面单独放，那显然是很麻烦的。

另外，万一产品经理觉得这个图标不好看，要改成其他图标，你只有两个办法，同名替换文件法，或者是在代码里搜索并修改。

同名替换文件法是一个办法，但万一这个图标还在其他地方使用，替换后导致本不应该被换的地方也被换了，岂不是坑。

所以可以在模块里增加一个成功/失败的图标url，导出这个url字符串，并让该url成为你使用的图标的url即可。

如果需要修改，直接改url即可，所有使用这个url的地方都会自动用新的值。

就像下面这个示例代码一样

```
// config.js
let successIconUrl = './success-icon.png'
export {successIconUrl}

// field.js
import {successIconUrl} from 'config'
icon.src = successIconUrl

// field2.js
import {successIconUrl} from 'config'
icon.src = successIconUrl
```

<h3>5、异步加载</h3>

>import()

别看了，提案而已，还不支持。

import和export浏览器都不支持，更别说这个了。

阻碍js发展的，就是浏览器的兼容性的，以及可恶的IE6、7、8

→_→

[阮一峰的博文链接](http://es6.ruanyifeng.com/#docs/module#import)点击查看import()，我略了。

