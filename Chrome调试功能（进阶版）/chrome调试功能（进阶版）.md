<h3>0、前注</h3>

[英文原文](https://raygun.com/javascript-debugging-tips)

本文基于[译文](https://www.oschina.net/translate/javascript-debugging-tips)，在原有基础上进行<b><i>增强</i></b>，根据我个人了解，额外加了很多内容。

默认是基于chrome来进行调试的，如果是其他浏览器，不一定能支持（特别是IE）

<h3>1、debugger</h3>

``debugger`` 的效果是当浏览器执行到这一段语句的时候，自动被断点。

你可以在控制台输入以下测试代码：

```
console.log('before')
debugger
console.log('after')
```

新人最爱用``alert()``来显示内容，进行调试。

但毫无疑问，使用``debugger``比``alert()``更专业。

并且，可以通过命令来统一管理代码：

```
function debug (arg) {
    let allDebugger = false    // 为true时，会所有都被断点
    // 不能写成 true ? debugger : null
    if (arg || allDebugger)
        debugger
}

console.log('1')
debug(1)
console.log('2')
debug(0)
console.log('3')
```

当传参且为true的时候，会被debugger，否则不会debugger。

如果``allDebugger``为``true``，那么所有都会被断点。

当然，个人只建议在调试的时候这么写，调试完后还是应该删除，毕竟太丑。

<h3>2、把object或array输出为表格</h3>

>console.table(args)

只对第一个参数生效（后面的无效）

先上代码：

```
let foo = {
    a: 1,
    b: 2,
    c: function () {
        console.log('c')
    }
}
let bar = [
    {
        a: 1, b: 2,
        c: function () {
            console.log('c')
        }
    },
    {
        a: 3, b: 4,
        c: function () {
            console.log('c')
        }
    },
    3
]
console.table(foo)
console.table(bar)
```

都是生成表格，但是对对象和数组的生成方式有所区别：

<b>对象</b>

对于对象，生成表格的时候，对象的key作为第一列，值作为第二列。

假如对象的某个属性的值是函数，那么：

* 第二列``Value``为空；
* 第三列``length``是参数的个数（``fn.length``的值）；
* 第四列``name``是函数名；
* 第五列``arguments``（因为只有调用时这个才有值，所以一般都是null）；
* 第六列``caller``（一般也为null）；
* 第七列``prototype``（显示不出来，也点不开）

<img width='100%' src='./console.table(object).png'>

<b>不能显示的：</b>

1. 单独对函数使用``console.table()``是没用的；
2. 对``class``类也无效（除非是类的实例）；
3. ``writable``, ``enumerable``, ``configurable``这三个属性不影响显示；
4. 不能显示原型链上的内容，如代码：

```
function Test () {
    this.a = 1
}

Test.prototype.b = 2
console.table(new Test())
```

只能显示a的值，不能显示b的值。

<b>数组</b>

1. 数组的索引作为第一列（``(index)``）的值；
2. 数组元素如果是非对象，那么有一列为``Value``的值为该元素的值；
3. 数组元素如果是对象，那么对象的key为一列，value为该列；

<img width='100%' src='./console.table(array).png'>

<h3>3、响应式调试</h3>

玩移动端H5开发的，估计没人不知道这个吧？

按下F12（win版，mac的话自己打开开发者工具）。如下图：

<img src='./3.png'>

然后在调试窗口的左上角点击【2】指向的地方，就会打开响应式调试模式。

然后会在浏览器显示区域的上方出现以下内容：

<img src='./4.png'>

上图：

1. 点击【1】区域，可以适配不同的机型，不过比较遗憾的是没有比较新的机型，我目前版本的chrome最新的是iPhone6 plus；
2. 点击【2】区域，可以切换横屏竖屏；
3. 点击【3】区域，有显示手机外壳的，有拍照的，还有显示DPI的；

然后我们再看回第一个图

<img src='./3.png'>

点击：

1. 点击区域【1】，然后可以鼠标移动到HTML元素上，再点击一下，可以自动选中那个HTML元素，适合分析DOM结构；
2. 点击区域【3】，在下拉弹窗的【Dock side】选项，可以切换调试窗所在位置，比如【靠左】【靠右】【靠下】【独立窗口】。双屏强烈推荐【独立窗口】；
3. 其他的略略略。

<h3>4、显示你最近5次点击的DOM</h3>

在控制台的【Elements】，可以显示DOM树，然后你点击一个html元素，又点了另外一个。这个时候想知道你之前点击的记录怎么办？

在控制台输入：

```
$0    // 表示最近一次点击的，输出的是DOM
$1    // 表示是比最近一次远一次的那个DOM
```

从``$0``一直到``$4``，可以记录最近5次点击。

不过个人感觉，这个没啥用。

<h3>5、获取时间段</h3>

>console.time(flags)

>console.timeEnd(flags)

这2个是成对出现的，参数表示标识（因为可能同时出现多个）。

时间不一定完全相等于你预期的时间，例如：

```
console.time('1')
setTimeout(() => {
    console.timeEnd('1')
}, 1000)
// 1000.459228515625ms
```

以上就是还额外多出来了0.459ms，这个时间可以用来参考估计某些代码执行的时间。

但缺点是，这个console.timeEnd没有返回值，所以你不能用变量来存下来（所以自己new Date()来计算时间差吧）；

另外注意，不能连续两个参数一样的console.timeEnd()，第二个的输出时间会是0ms。

<h3>6、显示堆栈调用</h3>

>console.trace(flags)

个人感觉这个用的也比较少。

原因在于如果需要捕捉堆栈，一般是出错的时候，但出错的时候抛错会自动显示堆栈。

<b>使用场景：</b>

在你发现有一个函数``fn1``被执行，但不能确定是谁调用了``fn1``；

或者``fn1``你预期只执行了一次，但实际上却发现执行了多次；

那么可以使用这个来分析。

使用示例：

```
function fn1 () {
    console.trace('fn1')
}

function fn2 () {
    fn1()
}

function fn3 () {
    fn2()
}

function fn4 () {
    fn1()
}

fn3()
fn4()
```

输出：

```
// 注释说明：fn3执行时的调用栈
fn1 @ 新建文本文档 (4).html:13
fn2 @ 新建文本文档 (4).html:17
fn3 @ 新建文本文档 (4).html:21
(anonymous) @ 新建文本文档 (4).html:28


// 注释说明：fn4执行时的调用栈
fn1 @ 新建文本文档 (4).html:13
fn4 @ 新建文本文档 (4).html:25
(anonymous) @ 新建文本文档 (4).html:29
```

<h3>7、格式化代码</h3>

我们在使用webpack打包的时候，一般会将代码压缩混淆。

好处是可以减少代码体积，但坏处是如果打包后报错（比如在测试环境），通过点击console的堆栈跳到代码处，会发现一堆代码无换行杂糅一起，基本无法调试。

解决办法chrome浏览器已经提供了，以[阿里巴巴的矢量图标库](http://www.iconfont.cn/)为例。

首先打开控制台，进入以下页面（进入方法已经用箭头标注）。

<img src='./5.png' width='100%'>

会发现中间区域的代码明显是压缩混淆之后的。

格式化代码很简单，如图箭头指向的地方，点一下：

<img src='./6.png' width='100%'>

然后原本的js文件被一个文件后加了``:formatted``的文件所替代，代码行数从23行变成了600多行如下图：

<img src='./7.png'>

这个文件替代了原文件。

点击console的报错，或者在这里打断点，都是可以正常生效的。

建议自己试试，试完后理解起来很简单。

<h3>8、断点某函数</h3>

控制台输入：

> debug(函数名)

效果：在执行某个函数的时候，自动触发断点。

但这个其实不实用，原因有几点：

1. 如果某个函数在页面刷新后就执行，而不是例如点击按钮后执行，那么是基本用不到的。理由是执行这个命令后，再刷新页面，之前的输入无效（而刷新后立即执行的话，执行速度太快了）；
2. 现在通行的是混淆打包编译，在局部作用域内，在控制台，基本是没办法访问到这个函数的。

示例代码：

```
<script>
    function test () {
        console.log('test')
        let foo = function () {
            console.log('foo')
        }
        foo()
    }

    test()
</script>
<button onclick="test()">点击执行test</button>
```

1. 输入``debug(test)``，再刷新页面，调试不会生效；
2. 输入``debug(test)``，点击按钮，会触发调试；
3. 输入``debug(foo)``，会报错``foo is not defined``；
4. 如果想在执行foo的时候生效，代码需要如下改写：

```
<script>
    function test () {
        this.foo = function foo () {
            console.log('foo')
        }
        this.foo()
    }

    let bar = new test()
</script>
<button onclick="test()">点击执行test</button>
```

输入``debug(bar.foo)``，然后点击按钮，会触发断点。

