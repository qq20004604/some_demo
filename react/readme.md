<h3>1、安装</h3>

推荐使用 DEMO 的 package.json 配置来安装

```
npm install
```

运行（HMR）：

```
npm run dev
```


单独安装

```
npm install --save react react-dom
npm i --save babel-preset-react babel-preset-es2015
```

说明：

1. ``babel-preset-react``: 需要配置 ``.babelrc`` 这个文件的 ``presets`` 属性，添加一个元素 ``"babel-preset-react"``；
2. ``package.json`` 里面的内容，随着学习进度的推进，而不断更新；
3. ``JSX`` 语法请自行学习；
4. 编辑器建议使用 ``webstorm`` 作为 IDE；
5. 默认读者已经有一定的框架开发知识（比如说学过 Vue.js），因此很多内容不会写的很细致

<h3>2、使用</h3>

app.js 添加内容：

```
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('root')
);
```

运行 ``npm run dev`` 即可。

``document.getElementById('root')`` 表示将DOM插入到 ``id = 'root'`` 的 DOM 元素中。

<h3>3、嵌套</h3>

被嵌套的目标可以是函数或者类，需要以大写字母开头：

函数是 ``return`` 的返回值，类是 ``render`` 函数的返回值；

示例：

```
// 被嵌套
function Foo() {
    return <h3>这是一个h3标签</h3>
}

// 嵌套到目标
ReactDOM.render(
    <div>
        <Foo/>
        <p>当前时间是：{formatDate(new Date())}</p>
    </div>,
    document.getElementById('root')
)
```

核心是函数名/类名是 Foo，所以嵌套的地方的标签名也为 ``Foo``，并且是一个闭合标签。

类的写法：

```
class Foo extends React.Component {
    // 如果只是单纯的显示DOM，这里的构造函数可以省略
    constructor(props) {
        super(props)
    }

    render() {
        return <h3>这是一个h3标签</h3>
    }
}
```

<h3>4、组件</h3>

组件实例必须继承于 ``React.Component``。

组件是一个完整的系统，而 React 的 DOM 元素，只是 html 片断。

```
// 继承于 React.Component
// 类名必须大写字母开头
class HelloWord extends React.Component {
    constructor(props) {
        // 调用 this 前必须先执行 super(props) ，理由是es6规则
        super(props);
        // 通过 state 设置组件变量
        this.state = {
            world: 'world'
        }
        // 调用方法时，方法的 this 指向组件实例（也就是没啥特别的地方）
        this.log()
    }

    // 渲染函数，this 指向实例本身
    render() {
        console.log(this)
        return <div className={domClass}>
            Hello，{this.state.world}!
        </div>
    }

    log() {
        console.log(this)
    }
}
```

<h3>5、变量</h3>

被中括号包含。

```
let foo = 'world'

class HelloWord extends React.Component {

    render() {
        return <div className={domClass}>
            Hello，{foo}
        </div>
    }
}
```

<h3>6、组件变量</h3>

放在 state 属性中，通过 ``setState`` 方法修改.

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        // 必须存在this.state中
        this.state = {
            seconds: 0
        }
        setInterval(() => {
            // 调用setState方法修改变量的值
            this.setState({
                seconds: this.state.seconds + 1
            })
        }, 1000)
    }

    render() {
        return <div className={domClass}>
            Hello，{foo}！距离上一次修改页面，过去了{this.state.seconds}秒
        </div>
    }
}
```

<h3>7、更新组件变量</h3>

将组件变量存到 ``state`` 属性中，然后通过 ``setState()`` 来更新变量。

```
class HelloWord extends React.Component {
    constructor(props) {
        // props的值就是你传给他的变量，比如这里就是 {toChild: 'world'}
        super(props);
        // 必须存在this.state中
        this.state = {
            seconds: 0
        }
        setInterval(() => {
            // 调用setState方法修改变量的值
            this.setState({
                seconds: this.state.seconds + 1
            })
        }, 1000)
    }

    render() {
        return <div className={domClass}>
            {/* 需要通过this.state.world 来使用。当然你也可以赋值到 this 的其他变量 */}
            Hello，World！距离上一次修改页面，过去了{this.state.seconds}秒
        </div>
    }
}

ReactDOM.render(
    <div>
        <HelloWord/>
    </div>,
    document.getElementById('root')
)
```

<h3>8、变量传递</h3>

父组件中，通过写在子组件的标签里来传值。

```
class HelloWord extends React.Component {
    constructor(props) {
        // props的值就是你传给他的变量，比如这里就是 {toChild: 'world'}
        super(props);
        // 必须存在this.state中
        this.state = {
            world: props.toChild,
            seconds: 0
        }
        setInterval(() => {
            // 调用setState方法修改变量的值
            this.setState({
                seconds: this.state.seconds + 1
            })
        }, 1000)
    }

    render() {
        return <div className={domClass}>
            {/* 需要通过this.state.world 来使用。当然你也可以赋值到 this 的其他变量 */}
            Hello，{this.state.world}！距离上一次修改页面，过去了{this.state.seconds}秒
        </div>
    }
}

// 要传的变量
let foo = 'world'

ReactDOM.render(
    <div>
        {/* ---- toChild 就是传递给子组件的变量的key ---- */}
        {/* ---- foo就是被传的变量（这里就是字符串 'world'） ---- */}
        <HelloWord toChild={foo}/>
        <p>当前时间是：{formatDate(new Date())}</p>
        {/*<Leaner/>*/}
    </div>,
    document.getElementById('root')
)
```

<h3>9、类名（样式）</h3>

在 React 里，给元素添加类名，不是通过 ``class``，而是 ``<div className={domClass}></div>`` 这种形式；

示例：

```
let domClass = 'container parent'

class HelloWord extends React.Component {
    constructor(props) {
        // props的值就是你传给他的变量，比如这里就是 {toChild: 'world'}
        super(props);
    }

    render() {
        return <div className={domClass}>
        </div>
    }
}

ReactDOM.render(
    <div>
        <HelloWord/>
    </div>,
    document.getElementById('root')
)
```

结果是：

```
<div class="container parent"></div>
```

原因：

>警告:

>因为 JSX 的特性更接近 JavaScript 而不是 HTML , 所以 React DOM 使用 camelCase 小驼峰命名 来定义属性的名称，而不是使用 HTML 的属性名称。

>例如，class 变成了 className，而 tabindex 则对应着 tabIndex.


<h3>10、事件处理</h3>

> 事件的 this

注意，事件触发的 this，默认指向的 undefined；

所以请手动绑定 this 给事件相应函数。比如：

```
this.clickCount = this.clickCount.bind(this)
```

> onChange 事件

输入框获取修改后的值，通过 ``onChange`` 事件。

假如事件的参数是 ``e``，那么 ``e.target`` 获取到当前 DOM（即这个 ``<input>`` 标签），然后 ``e.target.value`` 获取输入框的值。

但这个时候修改是无效的，因此必须通过 ``this.setState()`` 来修改值。

> onClick事件

绑定点击事件，通过 ``onClick`` 事件。

参数同上，一个道理，但这里不需要。

> 其他事件

略，事件名和原理是一样的

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        // 通过 state 设置组件变量
        this.state = {
            count: 0,
            bindValue: ''
        }
        // 在这里手动绑定 this，原因是不绑定的话，this 将指向 undefined
        this.clickCount = this.clickCount.bind(this)
        this.changeValue = this.changeValue.bind(this)
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            {/* onClick 注意是驼峰写法 */}
            <button onClick={this.clickCount}>点击我增加一次点击计数</button>
            <p>你已经点击了{this.state.count}次</p>
            这个输入框的值和上面的点击次数绑定了，因此无法被手动修改<input type="text" value={this.state.count}/>
            {/* 下面这个br标签，必须是闭合标签写法，否则会报错 */}
            <br/>
            <input type="text" value={this.state.bindValue} placeholder='请在这里输入值' onChange={this.changeValue}/>
            <br/>
            上面输入框的值是：{this.state.bindValue}
        </div>
    }

    clickCount() {
        this.setState({
            count: this.state.count + 1
        })
    }

    changeValue(e) {
        // e.target 拿到 输入框这个DOM，然后value属性拿到修改后的值
        var newValue = e.target.value
        console.log(newValue)
        // 需要通过 setState 来修改值才能生效
        this.setState({
            bindValue: newValue
        })
    }
}
```

<b>阻止默认事件：</b>

1. 阻止默认事件，需要通过 ``e.preventDefaul()`` 来实现（e 是事件的回调函数的参数）

<b>React 事件函数的特点：</b>

1. 事件参数是一个合成事件。React 根据 W3C spec 来定义这些合成事件，所以你不需要担心跨浏览器的兼容性问题；
2. 在 render 里，写成 ``this.xx``，但是这个事件执行时的 this 是 undefined，所以需要手动绑定（``bind``）；

<b>事件的传参：</b>

1. 原则上，就是返回一个带参数的函数；

【方法一】

返回通过 ``bind`` 绑定了 this 和 参数的函数;

需要注意的是，事件参数无需添加，会被默认后置到最后一个参数的位置：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            {/* 这种方法省略了 this 绑定的过程 */}
            <button onClick={this.clickCount.bind(this, 5)}>增加count</button>
            <br/>
            计数器二：{this.state.count}
        </div>
    }

    clickCount(number, e) {
        // 先是自定义参数，最后一个是事件参数
        console.log(arguments)
        this.setState({
            count: this.state.count + number
        })
    }
}
```

【方法二】

参数是一个函数，这个函数里执行了你准备执行的那个函数。

核心思想是：参数函数被执行 ——> 参数函数里执行了原本预期执行的函数 ——> 预期执行的函数里，放置了需要的参数

如代码：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            {/* 这种方法省略了 this 绑定的过程 */}
            <button onClick={e => this.clickCount.call(this, 5, e)}>增加count</button>
            <br/>
            计数器二：{this.state.count}
        </div>
    }

    clickCount(number, e) {
        // 先是自定义参数，最后一个是事件参数
        console.log(arguments)
        this.setState({
            count: this.state.count + number
        })
    }
}
```


<h3>11、组件复用</h3>

同一个组件可以同时插入多个到父组件中，并且各个组件的状态是独立的。

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
        this.clickCount = this.clickCount.bind(this)
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            <button onClick={this.clickCount}>点击我增加一次点击计数</button>
            <p>你已经点击了{this.state.count}次</p>
        </div>
    }

    clickCount() {
        this.setState({
            count: this.state.count + 1
        })
    }
}

ReactDOM.render(
    <div>
        <HelloWord/>
        <HelloWord/>
    </div>,
    document.getElementById('root')
)
```

<h3>12、生命周期</h3>


<b>参考链接：</b>

[React组件生命周期小结](https://www.jianshu.com/p/4784216b8194)

两个生命周期，分别是组件的生命周期，和状态变更的声明周期

<b>组件结构：</b>

父组件套用子组件

<b>初次渲染：</b>

1. constructor 【父组件】构造函数
2. componentWillMount 【父组件】挂载前
3. render 【父组件】
4. constructor 【子组件】构造函数
5. componentWillMount 【子组件】挂载前
6. render 【子组件】渲染完毕
7. componentDidMount 【子组件】挂载后执行
8. componentDidMount 【父组件】挂载后执行

总结：

1. 先**构造函数**，然后执行**挂载前函数**，然后父组件**开始渲染**；
2. 渲染的时候，查到子组件，开始递归子组件，执行以上流程；
3. 收尾的时候，先执行子组件的**挂载后函数**，再执行父组件的该函数；

<br>
<b>state 被改变：</b>

1. shouldComponentUpdate 【父组件】当state被改变后，这个函数会被执行，如果返回true，那么会触发render，否则不会触发render。但注意，事实上的值都会被更新 {} {count: 1}
2. componentWillUpdate(nextProps, nextState) 【父组件】，render渲染前执行
3. render 【父组件】
4. componentWillReceiveProps 【子组件】当父组件的 state 改变后，这个函数会被执行。props的值： {}
5. shouldComponentUpdate 【子组件】当state被改变后，这个函数会被执行，如果返回true，那么会触发render，否则不会触发render。但注意，事实上的值都会被更新 {} null
6. componentWillUpdate(nextProps, nextState) 【子组件】，render渲染前执行
7. render 【子组件】渲染完毕
8. componentDidUpdate 【子组件】 子组件的render已经渲染完毕
9. componentDidUpdate 【父组件】 父组件的render已经渲染完毕

总结：

1. 父组件state被改变后，首先判断需不需要重新渲染，不需要的话就没有更多事情了；
2. 需要渲染的话，先执行父组件**渲染前函数**，然后执行父组件 render；
3. 进入递归流程，开始检查子组件；
4. 子组件先执行获取 props 的函数（props 从父组件传来）；
5. 然后子组件判断要不要重新渲染子组件，如果不需要，则子组件终止流程，跳回父组件执行父组件的渲染完毕（``componentDidUpdate``）；需要则继续下一步；
6. 子组件执行**渲染前函数**（渲染前处理 props 用，同第二步），然后执行子组件 render；
7. 如果子组件还有子组件，则重复 3 ~ 6 ；
8. 子组件渲染完毕后，执行子组件 **渲染完毕函数**，并冒泡执行父组件 **渲染完毕函数**；

建议参照 [DEMO](https://github.com/qq20004604/some_demo/tree/master/react/React%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9FDEMO) 查看。

使用说明：

1. 第一次点击按钮，执行完整的 state 改变周期；
2. 第二次点击，父组件改变但不渲染；
3. 第三次点击，父组件渲染，但是子组件不渲染；
4. 第四次点击，同第二次；

即父组件第 2n+1 次点击渲染，2n 次不渲染；子组件是父组件第 2n 次渲染时，不渲染，第 2n+1 次渲染时，渲染；

<h3>13、setState 是异步行为</h3>

>setState()

这是一个异步操作，如：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
        this.clickCountAsync = this.clickCountAsync.bind(this)
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            <button onClick={this.clickCountAsync}>异步增加count</button>
        </div>
    }

    clickCountAsync() {
        console.log('【异步】setState之前，count的值：', this.state.count)
        this.setState({
            count: this.state.count + 1
        })
        console.log('【异步】setState之后，count的值：', this.state.count)
    }
}
```

会发现，两个 log 语句，输出的结果的值，都是一样的。

原因是 React 会合并多个 setState，然后统一更新；

那么如何获取更新后的数据，答案是通过回调函数；

说明见注释

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            anotherCount: 0
        }
        this.clickCountAsync = this.clickCountAsync.bind(this)
        this.clickCountSync = this.clickCountSync.bind(this)
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            <button onClick={this.clickCountAsync}>异步增加count</button>
            <br/>
            <button onClick={this.clickCountSync}>增加count，并同步更新计数器二的值等于异步增加后的count</button>
            <br/>
            计数器二：{this.state.anotherCount}
        </div>
    }

    clickCountAsync() {
        console.log('【异步】setState之前，count的值：', this.state.count)
        this.setState({
            count: this.state.count + 1
        })
        console.log('【异步】setState之后，count的值：', this.state.count)
    }

    clickCountSync() {
        // 通过setState 更新 state.count 的值
        this.clickCountAsync()
        // 1、这里是更新前的值
        console.log('【同步】setState之前，count的值：', this.state.count)
        this.setState((prevState, props) => {
            // 3、这里的回调函数，是更新后执行（即
            console.log(prevState, props)
            // 返回值就像设置 setState 的参数一样
            return {
                anotherCount: prevState.count
            }
        })
        // 2、这里也是更新前的值
        console.log('【同步】setState之后，count的值：', this.state.count)
    }
}
```

当然，这又出现一个问题，那就是假如我调用一个方法，分别修改了 A 变量，然后又调用某个方法需要修改 B 变量，并且 B 变量依赖于 A 变量修改后的值（这就是以上场景）；

可是假如我又需要调用第三个方法修改 C 变量，并且 C 的值依赖于 B 修改后的值。那么这就有问题了。

原因是：

1. React 里并不存在类似 Vue 的 computed/watch 这样的计算属性。如果需要实现，那么可能需要引入额外的库（watch.js/Rx.js/mobx）；
2. setState 本身是异步的，并且回调函数获取变更后的值，也是异步的。因此在场景复杂的情况下，你很难判断哪一个 setState 的回调函数，会优先执行；

解决办法：

1. 一个是引入额外的库，仿 Vue.js；
2. 考虑使用生命周期函数 ``componentWillUpdate(nextProps, nextState)``，将依赖的变量的修改逻辑，添加到这个函数里，如下面代码，可以解决部分场景的问题；

```
componentWillUpdate(nextProps, nextState) {
    nextState.anotherCount *= 2
    console.log(nextProps, nextState)
}
```


<h3>14、条件渲染（类似 Vue 的 v-if）</h3>

讲道理说，React 本身的条件渲染，没有 Vue.js 用起来舒服。Vue.js 只需要在标签上添加 ``v-if`` 或者 ``v-show`` 就行，但 React 就比较麻烦了。

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    // 渲染函数，this 指向实例本身
    render() {
        let display = this.display.bind(this)
        return <div>
            {/* 这种方法省略了 this 绑定的过程 */}
            <button onClick={display}>{this.state.show ? '点击隐藏' : '点击显示'}</button>
            {
                this.state.show
                    ?
                    <p>显示出来啦</p>
                    :
                    null
            }
        </div>
    }

    display() {
        this.setState({
            show: !this.state.show
        })
    }
}
```

如以上示例，通过三元操作符里面，返回 ``JSX`` 语法的 DOM 标签，或者 null ，来决定是否显示；

也可以将 JSX 语法的 DOM 作为变量，像下面这样使用。

```
render() {
    let display = this.display.bind(this)
    let DOM = null
    if (this.state.show) {
        DOM = <p>显示出来啦</p>
    }

    return <div>
        {/* 这种方法省略了 this 绑定的过程 */}
        <button onClick={display}>{this.state.show ? '点击隐藏' : '点击显示'}</button>
        {DOM}
    </div>
}
```

关于 v-show 就没什么好说的了吧？手动设置标签的 style 就行，很简单。

<h3>15、列表渲染（对标 v-for）</h3>

【实现思路】

1. 基础：数组的元素是 JSX 语法的 DOM，该数组作为 JSX 语法的 DOM，可以自动拼起来；
2. 实现：遍历数组，然后将将数组元素变为 JSX 语法的 DOM，得到一个新的数组（元素是 JSX 的 DOM），将这个新数组作为变量插入到渲染元素中即可。

如以下代码：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [1]
        }
        this.add = this.add.bind(this)
    }

    render() {
        console.log(this.state)
        let DOM = this.state.list.map((item, index) => (<li key={index}>{item}</li>))

        return <div>
            <p>列表元素：</p>
            <ul>
                {DOM}
            </ul>
            <button onClick={this.add}>点击添加一个列表元素</button>
        </div>
    }

    add() {
        this.state.list.push(parseInt(Math.random() * 1000))
        this.setState({
            list: this.state.list
        })
    }
}
```

【key】

注意，必须在列表的标签里设置唯一的 key 属性，不然会抛出异常（虽然还会正常执行）。通常建议使用 id（因为 id 一般唯一）来作为 key，实在不行，使用数组的索引作为 key 也勉勉强强了。


<h3>16、</h3>

<h3>17、</h3>

<h3>18、</h3>